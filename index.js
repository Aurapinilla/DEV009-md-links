const { log } = require('console');
const fs = require('fs');
const path = require('path');
const links = require('markdown-link-extractor');
const axios = require('axios');

// La función debe retornar una promesa que resuelva a un arreglo de objetos
const mdLinks = (filePath) => {
  return new Promise((resolve, reject) => {
    //Si la ruta existe
    if (fs.existsSync(filePath)) {
      //Convertir la ruta relativa a absoluta
      const absPath = path.resolve(filePath)
      resolve(absPath);
      //La ruta absoluta es un directorio o archivo?
      //Si es directorio extraer el archivo sólo si es extensión md
    } else {
      //Si la ruta no existe rechaza la promesa
      reject('Error: La ruta no existe');
    }
  })
  //Leer el archivo encontrado
  .then((absPath) => {
    return fs.promises.readFile(absPath, 'utf8');
  })
  //Extraer los links encontrados
  .then((data) => {
    return links(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

};

//Leer el archivo encontrado
/*mdLinks
  .then((result) => {
    fs.readFile(absPath, 'utf8', (err, data) => {
      if (err) {
        console.error('No se pudo leer el archivo');
      }
      else {
        return data;
      }
    });
  });*/


  mdLinks("Librerias.md")
  .then((result) => {
    log(result);
  });

module.exports = {
  mdLinks
};
