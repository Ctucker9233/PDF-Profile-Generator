const fs = require("fs"),
    convertFactory = require('electron-html-to'), 
    electronWorkers = require('electron-workers')
const path = require("path");
const generate = require("./generateHTML");
const inquirer = require("inquirer");
const axios = require("axios");
const questions = ["What is your Github user name?", "Pick your favorite color?"];


function writeToFile(fileName, data) {
    return fs.writeFileSync(path.join(process.cwd(), fileName), data);
};




function promptUser() {
    return inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: questions[0]
        },
        {
            type: "list",
            name: "colorchoice",
            choices: ["green", "blue", "pink", "red"],
            message: questions[1]
        }
    ])
};

function init() {
    promptUser()
        .then(function ({ username, colorchoice }) {
            const color = colorchoice;
            const queryUrl = `https://api.github.com/users/${username}`;
            axios
                .get(queryUrl)
                .then(function (res) {
                    res.data.color = color
                    console.log(res)
                    html = generate(res.data);
                    console.log(html)
                    writeToFile("profile.html", html)
                })
                .then(html => {
                    console.log(html)
                    const convert = convertFactory({
                        converterPath: convertFactory.converters.PDF,
                        pathToElectron: '\node_modules\.bin\electron.CMD',
                        allowLocalFilesAccess: true
                    });
                    convert({ html: html }, (err, result) => {
                        if (err) return console.error(err);
                        result.stream.pipe(fs.createWriteStream(__dirname + "profile.pdf"));
                        convert.kill(); // necessary if you use the electron-server strategy, see bellow for details
                    });
                });
        });
};



init();