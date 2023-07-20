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
            linksObj.push({ href, text, file: filePath, status: null });
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

    return Promise.all(linkValidation);
};

readMdFile('test\\Librerias1.md')
    .then((data) => extractLinks(data, 'test\\Librerias1.md'))
    .then((links) => validateLinks(links))
    .then((addStatus) => {
        console.log(addStatus); // Verás los enlaces con las propiedades status actualizadas
    })
    .catch((error) => {
        console.error(error);
    });


/*return Promise.all(linkStatusPromises)
        .then((statuses) => {
            // Aquí puedes trabajar con los resultados de la validación
            console.log(statuses); // Un array con los códigos de estado de cada link
            return statuses;
        })
        .catch((error) => {
            console.error(error);
            return [];
        });
};*/


/*validateLinks('https://axios-http.com/docs/introd')
    .then((status) => {
        console.log('Status: ', status);
    })
    .catch((error) => {
        console.error('Status: ', error);
    });*/

module.exports = {
    pathExists, readMdFile, extractLinks
};