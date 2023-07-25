const { pathAbs, pathType, pathExists, checkMd, readFile, validateLinks } = require('./functions.js');

function mdLinks(path, options) {
  return new Promise((resolve, reject) => {
    if (!path || typeof path !== 'string') reject('Please enter a valid path');
  
    let absolutePath = pathAbs(path);
    pathExists(absolutePath)
      .then((() => pathType(absolutePath)))
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