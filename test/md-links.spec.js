const path = require('path');
const { mdLinks } = require('../index.js');
const { pathExists, readMdFile, extractLinks } = require('../functions.js');


const testPath = 'test\\Librerias1.md';
const noLinks = 'test\\No_Links.md';
const noMdFile = './package.json';
const emptyFile = 'test\\empty.md';


describe('mdLinks', () => {
  it('should return a promise', () => {
    const result = mdLinks(testPath);
    expect(result).toBeInstanceOf(Promise);
  })
  it('Should throw error if no path is given in the function', () => {
    expect(() => mdLinks()).rejects.toThrowError('Please provide a file path')
  })
  it('Should reject Promise if the path does not exist', () => {
    expect(() => mdLinks('./ruta/noexiste.md')).rejects.toThrowError('Path does not exist');
  })
  it('Should return error if the .md file is empty', () => {
    expect(() => mdLinks(emptyFile)).rejects.toThrowError('This .md file is empty');
  })
  it('Should return error if the file is not .md extension', () => {
    expect(() => mdLinks(noMdFile)).rejects.toThrowError('This is not a Markdown File');
  })
  it('Should return error if there are no links in the .md file', () => {
    expect(() => mdLinks(noLinks)).rejects.toThrowError('No links were found');
  })
  it('Should resolve an array with the links found (href, text, file path)', () => {
    return expect(mdLinks(testPath)).resolves.toEqual(expect.arrayContaining([expect.objectContaining({
      href: expect.any(String),
      text: expect.any(String),
      file: expect.any(String)
    })]))
  })
});


describe('pathExists', () => {
  it('Should return the absolute path', () => {
    expect(pathExists(testPath)).toEqual(path.resolve(testPath))
  })
});


describe('readMdFile', () => {
  it('should return a promise', () => {
    const result = readMdFile(testPath);
    expect(result).toBeInstanceOf(Promise);
  })
  it('Should throw error if the file is empty', () => {
    expect(() => readMdFile(emptyFile)).rejects.toThrowError('This .md file is empty');
  })
  it('Should throw error if it is not a Markdown file', () => {
    expect(() => readMdFile(noMdFile)).rejects.toThrowError('This is not a Markdown File');
  })
  it('Should read the content of the .md file', () => {
    return readMdFile(testPath).then((data) => {
      expect(data).toEqual(expect.any(String));
      expect(data.length).toBeGreaterThan(0);
    });
  })
});

describe('extractLinks', () => {
  it('should return a promise', () => {
    const data = '[Repositorio Oficial Axios](https://github.com/axios/axios)';
    const result = extractLinks(data, testPath);
    expect(result).toBeInstanceOf(Promise);
  })
  it('should reject with an error if there are no links in the data', () => {
    const data = 'This has no links.';
    return expect(extractLinks(data, noLinks)).rejects.toThrowError('No links were found');
  })
  it('should resolve an array with the links found (href, text, file path)', () => {
    const data = '[Repositorio Oficial Axios](https://github.com/axios/axios)';
    return expect(extractLinks(data, testPath)).resolves.toEqual(expect.arrayContaining([expect.objectContaining
      ({
        href: 'https://github.com/axios/axios',
        text: 'Repositorio Oficial Axios',
        file: 'test\\Librerias1.md',
      }),
    ])
    );
  });
});