const fs = require('fs');

// La función debe retornar una promesa que resuelva a un arreglo de objetos
const mdLinks = (path, options) => {
return new Promise((resolve, reject) => {
  //Si la ruta existe
  if (fs.existsSync(path)) {
//Convertir la ruta relativa a absoluta
//La ruta absoluta es un directorio o archivo?
//Si es directorio extraer el archivo md
    resolve();
  } else {
    //Si la ruta no existe rechaza la promesa
    reject('Error: La ruta no existe');
  }
});
};

module.exports = {
  mdLinks
};
