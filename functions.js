const fs = require('fs');
const path = require('path');

//If the path exists, rturn the absolute path
const pathExists = (filePath) => {
    if (fs.existsSync(filePath)) {
        return path.resolve(filePath)
    }
};
console.log(pathExists("test\\Librerias1.md"));



//Read File
const readMdFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(new Error('Not able to read the file'))
            } else {
                const fileExt = path.extname(filePath);
                if (fileExt === '.md') {
                    resolve(extractLinks(data, filePath));
                }
                else {
                    reject(new Error('This is not a Markdown File'));

                }
            }

        });

    });
};
//Extract Links from a file
const extractLinks = (data, filePath) => {
    return new Promise((resolve, reject) => {
        const regex = /\[(.+?)\]\((https?:\/\/[^\s]+)\)/g;
        const linksObj = [];
        let match;
        let foundLinks = false;

        while ((match = regex.exec(data))) {
            const href = match[2];
            const text = match[1];
            linksObj.push({ href, text, file: filePath });
            foundLinks = true;
        }
        if (foundLinks) {
            resolve(linksObj); // Resuelve la promesa con los links encontrados
        } else {
            reject(new Error('No links were found')); // Rechaza la promesa con un error si no hay links
        }
    });
};


module.exports = {
    pathExists, readMdFile, extractLinks
};