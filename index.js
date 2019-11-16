const fs = require("fs");
const generate = require("./generateHTML")
const stream = require("stream")
const inquirer = require("inquirer");
const axios = require("axios");
const questions = ["What is your Github user name?", "Pick your favorite color?"];


function writeToFile(fileName, data) {

}

function init() {
    inquirer
        .prompt([
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
        .then(function ({ username, colorchoice }) {
            const color = colorchoice;
            const queryUrl = `https://api.github.com/users/${username}`;
            axios
                .get(queryUrl)
                .then(function (res) {
                    res.data.color = color
                    console.log(res)
                    generate(res.data);
                })
        })
        
        
    }
init();

module.exports = index;