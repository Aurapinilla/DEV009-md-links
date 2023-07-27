const pathImpt = require('path');
const fs = require('fs');
const axios = require('axios');

//Función para retornar el path absoluto
function pathAbs(filePath) {
    return pathImpt.isAbsolute(filePath) ? filePath : pathImpt.resolve(filePath);
}

//Función que verifica si el path existe
function pathExists(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err) => {
            if (err) {
                reject(new Error('Path does not exist'));
            } else {
                resolve(filePath);
            }
        });
    });
}

//Función que verifica si el path es de un archivo o directorio
function pathType(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
            if (err) {
                reject(new Error('Not able to read the path'));
            } else {
                resolve(stats.isFile() ? filePath : readDir(filePath));
            }
        });
    });
}

//Función que lee el contenido de un directorio y devuelve arr con los archivos encontrados
function readDir(path, filesArr = []) {
    const files = fs.readdirSync(path);
    files.forEach((file) => {
        const filePath = pathImpt.join(path, file),//Obtener el path completo
            stat = fs.statSync(filePath);

        (stat.isDirectory())
            ? readDir(filePath, filesArr)
            : filesArr.push(filePath)
    })
    return filesArr;
}

//Función que verifica que la extensión del/los archivos sea .md
function checkMd(filePaths) {
    const fileArr = Array.isArray(filePaths) ? filePaths : [filePaths];//Asegurar que sea Array
    const mdPaths = fileArr.filter(path => pathImpt.extname(path) === '.md');

    return new Promise((resolve, reject) => {
        (mdPaths.length > 0)
            ? resolve(mdPaths)
            : reject(new Error('No markdown files were found'));
    });
}

//Función que lee el contenido del archivo .md
function readFile(files) {
    const fileArray = Array.isArray(files) ? files : [files];//Asegurar que sea Array
    const promises = fileArray.map(file => {
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf-8', (err, data) => {
                if (!err) {
                    extractLinks(file, data)
                        .then(links => resolve(links))
                        .catch(error => reject(error));
                }
            });
        });
    });
    return Promise.all(promises);//Promise.all para esperar a que se ejecuten todas las promesas
}

//Función que devuelve un array con los links encontrados
function extractLinks(path, data) {
    const regex = /\[(.*?)\]\((https?:\/\/.*?)\)/g;
    let matches;
    const linksFound = [];

    while ((matches = regex.exec(data))) {
        linksFound.push({
            href: matches[2],
            text: matches[1],
            file: path,
        });
    }
    return Promise.resolve(linksFound);
}

//Función que valida el estatus de los links con axios
function validateLinks(links) {
    const fileArr = Array.isArray(links) ? links : [links];//Asegurar que sea Array
    const promises = fileArr.map(link => {
        return axios.head(link.href)//axios.head me trae solo el encabezado de la respuesta
            .then((response) => {
                const validation = { status: response.status, message: response.statusText }
                Object.assign(link, validation);
                return link
            })
            .catch((error) => {
                const validation = { status: error.response ? error.response.status : 'no response', message: 'fail' };
                Object.assign(link, validation);
                return link;
            });
    });
    return Promise.all(promises);
}

//Funciones que genera las estadísticas de los links
function statsLinks(links) {
    return {
        'Total': links.length,
        'Unique': new Set(links.map((link) => link.href)).size
        //new Set crea una colección de valores únicos
    }
}

function statsValidate(links) {
    return {
        'Total': links.length,
        'Unique': new Set(links.map((link) => link.href)).size,
        'Broken': links.filter((link) => link.message === 'fail').length,
    }
}

module.exports = {
    pathAbs,
    pathExists,
    pathType,
    checkMd,
    readDir,
    readFile,
    extractLinks,
    validateLinks,
    statsLinks,
    statsValidate
};