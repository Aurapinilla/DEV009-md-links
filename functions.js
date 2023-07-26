const pathImpt = require('path');
const fs = require('fs');
const axios = require('axios');

function pathAbs(filePath) {
    return pathImpt.isAbsolute(filePath) ? filePath : pathImpt.resolve(filePath)
}

function pathExists(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err) => {
            (err)
                ? reject(new Error('Path does not exist')) : resolve(true);
        });
    });
}

function pathType(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
            if (err) {
                reject(err);
            } else {
                resolve(stats.isFile() ? filePath : readDir(filePath));
            }
        });
    });
}

function readDir(path, arrayOfFiles = []) {
    const files = fs.readdirSync(path);
    files.forEach((file) => {
        const filePath = pathImpt.join(path, file),
            stat = fs.statSync(filePath);

        (stat.isDirectory())
            ? readDir(filePath, arrayOfFiles)
            : arrayOfFiles.push(filePath)
    })
    return arrayOfFiles
}

function checkMd(filePaths) {
    const fileArr = Array.isArray(filePaths) ? filePaths : [filePaths];
    const mdPaths = fileArr.filter(path => pathImpt.extname(path) === '.md');

    return new Promise((resolve, reject) => {
        (mdPaths.length > 0)
            ? resolve(mdPaths)
            : reject(new Error('No markdown files were found'));
    });
}

function readFile(files) {
    const fileArray = Array.isArray(files) ? files : [files];
    const promises = fileArray.map(file => {
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf-8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    extractLinks(file, data)
                        .then(links => resolve(links))
                        .catch(error => reject(error));
                }
            });
        });
    });
    return Promise.all(promises);
}

function extractLinks(path, data) {
    const regex = /\[(.*?)\]\((https?:\/\/.*?)\)/g;
    let matches;
    const infoLinks = [];

    while ((matches = regex.exec(data))) {
        infoLinks.push({
            href: matches[2],
            text: matches[1],
            file: path,
        });
    }
    return Promise.resolve(infoLinks);
}

function validateLinks(links) {
    const fileArr = Array.isArray(links) ? links : [links];
    const promises = fileArr.map(link => {
        return axios.head(link.href)
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

function statsLinks(links) {
    return {
        'Total': links.length,
        'Unique': new Set(links.map((link) => link.href)).size
    }
  }
  
  function statsValidate(links) {
    const broken = links.filter((link) => link.message === 'fail').length;
    return {
        'Total': links.length,
        'Unique': new Set(links.map((link) => link.href)).size,
        'Broken': broken,
    }
  }

module.exports =
{
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
}