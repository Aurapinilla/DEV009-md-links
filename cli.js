const { mdLinks } = require('./index.js')

const testPath = 'test\\Librerias1.md';
const noLinks = 'test\\No_Links.md';
const noMdFile = './package.json';
const invalidmd = 'test\\Invalid.md';

mdLinks(testPath)
  .then((links) => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error);
  });