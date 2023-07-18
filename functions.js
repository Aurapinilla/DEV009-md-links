const fs = require('fs');
const path = require('path');
const axios = require('axios');

//If the path exists, rturn the absolute path
const pathExists = (filePath) => {
    if (fs.existsSync(filePath)) {
        return path.resolve(filePath)
    }
    else {
        throw new Error('Path does not exist');
    }
};
//console.log(pathExists('test\\Libreras1.md'));


//Read File
const readMdFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const fileExt = path.extname(filePath);
        if (fileExt === '.md') {

            fs.readFile(filePath, 'utf8', (err, data) => {
                if (data === '') {
                    reject(new Error('This .md file is empty'));
                } else if (!err) {
                    resolve(data);
                }
            });

        } else {
            reject(new Error('This is not a Markdown File'));
        }
    })
};
//console.log(readMdFile('test\\empty.md'));


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
            resolve(linksObj); //Devuelve el array con los links encontrados
        } else {
            reject(new Error('No links were found'));
        }
    });
};

/*readMdFile('test\\Librerias1.md')
.then((data) => {
    return extractLinks(data, 'test\\Librerias1.md')
})
.then((links) => {
    console.log(links);
})
.catch((error) => {
    console.error(error);
})*/



//Option to validate links: yes/no

//Status of links is validated with axios
const validateLinks = (link) => {
    return new Promise((resolve, reject) => {
        //const linksArr = extractLinks(data, filePath);
        axios.get(link)
            .then((result) => {
                resolve(result.status);

            })
            .catch((error) => {
                reject(error);
            })
    })
};
/*validateLinks('https://nodejs.dev/learn/build-an-express-app')
    .then((status) => {
        console.log('Estado: ', status);
    })
    .catch((error) => {
        console.error(error);
    });*/


module.exports = {
    pathExists, readMdFile, extractLinks
};