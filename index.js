const { pathExists, readMdFile, extractLinks } = require('./functions.js');

// La función debe retornar una promesa que resuelva a un arreglo de objetos
const mdLinks = (filePath, validate) => {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      reject(new Error('Please provide a file path'));
    } else {
      const absPath = pathExists(filePath);
      if (!absPath) {
        reject(new Error('Path does not exist'));
      } else {
        readMdFile(filePath)
.then((data) => {
    resolve(extractLinks(data, filePath));
})
.then((links) => {
    console.log(links);
})
          .catch((error) => {
            reject(error);
          });
      }
    }
  });
};




module.exports = {
  mdLinks
};
