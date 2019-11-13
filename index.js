const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const questions = ["What is your Github user name?", "What is your favorite color?"];


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
            const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
            axios
                .get(queryUrl)
                .then(function (res) {
                    res.color = color
                    console.log(res)
                })
        })
    }
init();
