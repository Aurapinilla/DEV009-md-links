const { mdLinks } = require('../index.js');

const testPath = 'test\\Librerias1.md';
const noLinks = 'test\\No_Links.md';
const noMdFile = './package.json';
const invalidmd = 'test\\Invalid.md';


describe('mdLinks', () => {
  it('should return a promise', () => {
    const result = mdLinks('test\\Librerias1.md');
    expect(result).toBeInstanceOf(Promise);
  })
  it('Should throw error if no path is given in the function', () => {
    return expect(mdLinks()).rejects.toThrowError('Please provide a file path')
  })
  it('Should reject Promise if the path does not exist', () => {
    return expect(mdLinks('./ruta/noexiste.md')).rejects.toThrowError('Path does not exist');
  })
  it('Should return error if the function cannot read the .md file', () => {
    return expect(mdLinks(invalidmd)).rejects.toThrowError('Not able to read the file');
  })
  it('Should return error if the file is not .md extension', () => {
    return expect(mdLinks(noMdFile)).rejects.toThrowError('This is not a Markdown File');
  })
  it('Should return error if there are no links in the .md file', () => {
    return mdLinks(noLinks).catch((error) => {
      expect(error).toEqual(new Error('No links were found'));
    })
  })
  it('Should resolve an array with the links found (href, text, file path)', () => {
    return expect(mdLinks(testPath)).resolves.toEqual(expect.arrayContaining([expect.objectContaining({
      href: expect.any(String),
      text: expect.any(String),
      file: expect.any(String)
    })]))
  })
});