const fs = require('fs');
const path = require('path');

//If the path exists, rturn the absolute path
const pathExists = (filePath) => {
    if (fs.existsSync(filePath)) {
        return path.resolve(filePath)
    }
    else {
        throw new Error('Path does not exist');
    }
};
//console.log(pathExists("README.js"));



//Read File
const readMdFile = (mdFile) => {
    return new Promise((resolve, reject) => {
        fs.readFile(mdFile, 'utf8', (err, data) => {
            if (err) {
                reject(new Error('Not able to read the file'))
            } else {
                const fileExt = path.extname(mdFile);
                if (fileExt === '.md') {
                    resolve(extractLinks(data, mdFile));
                }
                else {
                    reject(new Error('This is not a Markdown File'));

                }
            }

        });

    });
};
//Extract Links from a file
const extractLinks = (data, mdFile) => {
    const regex = /\[(.+?)\]\((https?:\/\/[^\s]+)\)/g;
    const linksObj = [];
    let match;
    let founLinks;

    while ((match = regex.exec(data))) {
        const href = match[2];
        const text = match[1];
        linksObj.push({ href, text, file: mdFile });
        founLinks = true;
    } //Error si no encuentra links 
    if (!founLinks){
        throw new Error('No links were found');
    }

    return linksObj;
};

/*readMdFile("Librerias1 copy.md")
    .then((links) => {
        console.log(links); // Aquí se muestra el resultado completo de la promesa
    })
    .catch((error) => {
        console.error(error);
    });*/


module.exports = {
    pathExists, readMdFile
};