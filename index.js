const { log } = require('console');
const fs = require('fs');
const path = require('path');

// La función debe retornar una promesa que resuelva a un arreglo de objetos
const mdLinks = (filePath) => {
return new Promise((resolve, reject) => {
  //Si la ruta existe
  if (fs.existsSync(filePath)) {   
//Convertir la ruta relativa a absoluta
    resolve(path.resolve(filePath));
//La ruta absoluta es un directorio o archivo?
//Si es directorio extraer el archivo md
  } else {
    //Si la ruta no existe rechaza la promesa
    reject('Error: La ruta no existe');
  }
});
};
console.log(mdLinks("Librerias.md"));

module.exports = {
  mdLinks
};
