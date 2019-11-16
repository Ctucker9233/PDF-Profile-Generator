const fs = require("fs")
const convertapi = require('convertapi')('tTi0uXTS08ennqBS');
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
            let html;
            axios
                .get(queryUrl)
                .then(function (res) {
                    res.data.color = color
                    console.log(res)
                    html = generate(res.data);
                    console.log(html)
                    writeToFile("profile.html", html)

                });
            convertapi.convert('pdf', { File: './profile.html' })
                .then(function (result) {
                    // get converted file url
                    console.log("Converted file url: " + result.file.url);

                    // save to file
                    return result.file.save(__dirname + "/profile.pdf");
                })
                .then(function (file) {
                    console.log("File saved: " + file);
                });

        })
    }
init();