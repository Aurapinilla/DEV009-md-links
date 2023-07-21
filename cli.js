const { mdLinks } = require('./index.js')

const testPath = 'test\\Librerias1.md';
const noLinks = 'test\\No_Links.md';
const noMdFile = './package.json';
const emptyFile = 'test\\empty.md';

mdLinks(testPath, testPath)
  .then((links) => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error);
  });