const { pathAbs, pathType, pathExists, checkMd, readFile, validateLinks } = require('./functions.js');

function mdLinks(pathFile, options) {
  return new Promise((resolve, reject) => {
    if (!pathFile || typeof pathFile !== 'string') reject('Please provide a valid path');
  
    let absPath = pathAbs(pathFile);
    pathExists(absPath)
      .then((() => pathType(absPath)))
      .then(((files) => checkMd(files)))
      .then((files) => {
        return (options !== true)
        ? readFile(files)
        : readFile(files)
          .then((links) => Promise.all(links.map(link => validateLinks(link))));
      })
      .then((links) => {
        const linksArr = links.flat()
        linksArr.length === 0 ? reject('No links were found') : resolve(linksArr);
      })
      .catch(error => {
        reject(error);
      });
  });
}

module.exports = { mdLinks }