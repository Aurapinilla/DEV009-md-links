const fs = require('fs');
const path = require('path');
const axios = require('axios');

//If the path exists, rturn the absolute path
const pathExists = (filePath) => {
    if (fs.existsSync(filePath)) {
        return path.resolve(filePath)
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
            linksObj.push({ href, text, file: filePath, status: null, message: null });
            foundLinks = true;
        }
        if (foundLinks) {
            resolve(linksObj); //Devuelve el array con los links encontrados
        } else {
            reject(new Error('No links were found'));
        }
    });
};



//Option to validate links: yes/no

//Status of links is validated with axios
const validateLinks = (arrLinks) => {
    const linkValidation = arrLinks.map((linkObj) =>
        axios
            .get(linkObj.href)
            .then((response) => {
                linkObj.status = response.status;
                return linkObj;
            })
            .catch((error) => {
                linkObj.status = error.response.status;
                return linkObj;
            })
    );
    //Promise.all para esperar a que aplique la validación a todos los links encontrados
    return Promise.all(linkValidation)
    .then((linkValidation) => {
        const validMessage = linkValidation.map((linkObj) => {
            if (linkObj.status >= 200 && linkObj.status < 400) {
                linkObj.message = 'ok'
                return linkObj;
            } else {
                linkObj.message = 'fail'
                return linkObj;
            }
        });
        return validMessage;
    })
};

/*const message = (arrValidation) => {
    const validMessage = arrValidation.map((linkObj) => {
        if (linkObj.status >= 200 && linkObj.status < 400) {
            linkObj.message = 'ok'
            return linkObj;
        } else {
            linkObj.message = 'fail'
            return linkObj;
        }
    });
    return validMessage;
}*/

readMdFile('./README.md')
    .then((data) => extractLinks(data, './README.md'))
    .then((links) => validateLinks(links))
    .then((addStatus) => {
        console.log(addStatus);
    })
    .catch((error) => {
        console.error(error);
    });



module.exports = {
    pathExists, readMdFile, extractLinks
};