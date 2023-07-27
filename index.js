const { pathAbs, pathType, pathExists, checkMd, readFile, validateLinks } = require('./functions.js');

function mdLinks(pathFile, validate) {
  return new Promise((resolve, reject) => {
    if (!pathFile || typeof pathFile !== 'string') {
      reject(new Error('Please provide a valid path'));
      return;
    }
    let absPath = pathAbs(pathFile);
    pathExists(absPath)
      .then((() => pathType(absPath)))
      .then(((files) => checkMd(files)))
      .then((files) => {
        return (validate !== true)
          ? readFile(files)
          : readFile(files)
            .then((links) => Promise.all(links.map(link => validateLinks(link))));
      })
      .then((links) => {
        const linksArr = links.flat();//"aplana" los arrays en un solo array
        return linksArr.length === 0 ? Promise.reject('No links were found') : Promise.resolve(linksArr);
      })
      .then(resolve) // Devolvemos el resultado de los links
      .catch(reject);
    });
}
    


module.exports = { mdLinks }