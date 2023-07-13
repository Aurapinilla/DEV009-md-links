const fs = require('fs');
const path = require('path');

//If the path exists, rturn the absolute path
const pathExists = (filePath) => {
    if (fs.existsSync(filePath)) {
        return path.resolve(filePath)
    }
    else {
        throw new Error("Path does not exist");
    }
};
//console.log(pathExists("README.js"));

//If path belongs to a folder, only extract .md files

//Read File
function readMdFile(absPath) {
    return new Promise((resolve, reject) => {
        fs.readFile(absPath, 'utf8', (err, data) => {
            const fileExt = path.extname(absPath);
            if (fileExt === '.md') {
                resolve(extractLinks(data, absPath));
            }
            else {
                reject(new Error('This is not a Markdown File'));

            }
        });

    });
};
//Extract Links from a file
function extractLinks (data, absPath) {
    const regex = /\[(.+?)\]\((https?:\/\/[^\s]+)\)/g;
    const linksObj = [];
    let match;

    while ((match = regex.exec(data))) {
        const href = match[2];
        const text = match[1];
        linksObj.push({ href, text, file: absPath });
    }

    return linksObj;
};

readMdFile("librerias.md")
  .then((links) => {
    console.log(links); // Aquí se muestra el resultado completo de la promesa
  })
  .catch((error) => {
    console.error(error);
  });


module.exports = {
    pathExists, extractLinks, readFilemd: readMdFile
};