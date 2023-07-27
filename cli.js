#!/usr/bin/env node
//Indica que el archivo debe ser interpretado por Node

const { mdLinks } = require('./index.js');
const { statsValidate, statsLinks } = require('./functions.js');
const path = process.argv[2];
const options = process.argv; //contiene los argumentos de la linea de comandos

let validate = options.includes('--validate');
let stats = options.includes('--stats');


mdLinks(path, validate).then(links => {
    if (stats && validate) {
        console.log(statsValidate(links));
    } else if (stats) {
        console.log(statsLinks(links));
    } else if (validate) {
        links.forEach(link => {
            const { href, message, status, text, file } = link;
            console.log(`${file} ${href} ${message} ${status} ${text}`);
        });
    } else if (options[3] === undefined || !validate) {
        console.log(links)
    }
}).catch(error => {
    console.error('Error:', error);
});