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
                ? reject('Path does not exist', err) : resolve(true)
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

function checkMd(filePath) {
    return new Promise((resolve, reject) => {
        const fileArray = Array.isArray(filePath) ? filePath : [filePath];
        const markdownPaths = fileArray.filter(path => pathImpt.extname(path) === '.md');

        (markdownPaths.length > 0)
            ? resolve(markdownPaths)
            : reject(('No markdown files were found'));
    })
}

function readFile(files) {
    const fileArray = Array.isArray(files) ? files : [files];
    const promises = fileArray.map(file => {
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf-8', (err, data) => {
                (err)
                    ? reject(err)
                    : resolve(extractLinks(file, data))
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
    return infoLinks
}

function validateLinks(links) {
    const fileArr = Array.isArray(links) ? links : [links];
    const promises = fileArr.map(link => {
        return axios.head(link.href)
            .then((response) => {
                const validation = { status: response.status, statusText: response.statusText }
                Object.assign(link, validation);
                return link
            })
            .catch((error) => {
                const validation = { status: error.response ? error.response.status : 'no response', statusText: 'fail' };
                Object.assign(link, validation);
                return link;
            });
    });
    return Promise.all(promises);
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
    validateLinks
}