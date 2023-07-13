const fs = require('fs');
const path = require('path');

//If the path exists, rturn the absolute path
const pathExists = (filePath) => {
    if (fs.existsSync(filePath)) {
        return path.resolve(filePath)
    }
};
console.log(pathExists("Librerias.md"));


module.exports = {
    pathExists
  };