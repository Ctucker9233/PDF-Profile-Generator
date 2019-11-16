const fs = require("fs");
const generate = require("./generateHTML")
const stream = require("stream")
const util = require("util")
var convertapi = require('convertapi')('tTi0uXTS08ennqBS');
const inquirer = require("inquirer");
const axios = require("axios");
const questions = ["What is your Github user name?", "Pick your favorite color?"];


const writeToFile = util.promisify(fs.writeFile);


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
}

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
                    const html = generate(res.data);
                    console.log(html)
                    return writeToFile("profile.html", html)
                })
                .then(function() {
                    console.log("Successfully wrote to index.html");
                  })
                  .catch(function(err) {
                    console.log(err);
                  });
        })
}

init();