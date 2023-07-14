const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { pathExists, readMdFile } = require('./functions.js')
// La función debe retornar una promesa que resuelva a un arreglo de objetos
const mdLinks = (filePath) => {
  const absPath = pathExists(filePath);
  //const mdFile = obtainMdFiles(absPath);
  return readMdFile(absPath)
    /*.then(function (result) {
      return extractLinks(result, mdFile)
    })
    .then(function (links) {
      if (links.length === 0) {
        throw new Error('No links found :(')
      } else {
        return links;
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      throw error;
    });*/

};



mdLinks("Librerias1.md")
  .then((links) => {
    console.log(links); // Aquí se muestra el resultado completo de la promesa
  })
  .catch((error) => {
    console.error(error);
  });

module.exports = {
  mdLinks
};
