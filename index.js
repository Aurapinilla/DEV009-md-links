const { log } = require('console');
const fs = require('fs');
const path = require('path');
const linksExtract = require('markdown-link-extractor');
const axios = require('axios');
const { pathExists } = require('./functions.js')
// La función debe retornar una promesa que resuelva a un arreglo de objetos
const mdLinks = (filePath, validate) => {
  let absPath;
  return new Promise((resolve, reject) => {
    //Si la ruta existe
    if (fs.existsSync(filePath)) {
      //Convertir la ruta relativa a absoluta
      absPath = path.resolve(filePath)
      resolve(absPath);
      //La ruta pertenece a una carpeta o archivo?
      //Si es una carpeta extraer el archivo sólo si es extensión md
    } else {
      //Si la ruta no existe rechaza la promesa
      reject(new Error ('Error: Path does not exist'));
    }
  })
  //Leer el archivo encontrado
  .then((absPath) => {
    return fs.promises.readFile(absPath, 'utf8');
  })
  //Extraer los links encontrados
  .then((data) => {
    const regex = /\[(.+?)\]\((https?:\/\/[^\s]+)\)/g;
    const linksObj = [];
    let match;
  
    while ((match = regex.exec(data))) {
      const href = match[2];
      const text = match[1];
      linksObj.push({ href, text, file: absPath });
    }
  
    return linksObj;

    //return linksExtract(data).links;
  })
  //Validar los links
  //Si es válido devuelve el objeto específicado
  //Si no es válido devuelve el objeto especificado
  //La promesa devuelve el array con los objetos anteriores
  .catch((error) => {
    console.error('Error:', error);
  });

};



  mdLinks("Librerias.md")
  .then((result) => {
    log(result);
  });

module.exports = {
  mdLinks
};
