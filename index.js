const { pathExists, readMdFile } = require('./functions.js');

// La función debe retornar una promesa que resuelva a un arreglo de objetos
const mdLinks = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      reject(new Error('Please provide a file path'));
    } else {
      const absPath = pathExists(filePath);
      if (!absPath) {
        reject(new Error('Path does not exist'));
      } else {
        readMdFile(absPath)
          .then((links) => {
            resolve(links);
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
