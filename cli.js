const { mdLinks } = require('./index');

const testPath = 'test\\Librerias1.md';
const noLinks = 'test\\No_Links.md';
const noMdFile = './package.json';
const emptyFile = 'test\\empty.md';
const folderPath = './test_mdLinks';

console.log("Calling mdLinks...");
mdLinks(folderPath, true)
  .then((links) => {
    console.log("mdLinks resolved:");
    console.log(links);
  })
  .catch((error) => {
    console.error("mdLinks rejected:");
    console.error(error);
  });
