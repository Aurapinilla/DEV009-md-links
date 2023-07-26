const path = require('path');
const { mdLinks } = require('../index.js');
const { pathExists, pathAbs, pathType, checkMd, readDir, readFile, extractLinks, validateLinks, statsLinks, statsValidate } = require('../functions.js');


const testPath = 'test_mdLinks\\Librerias.md';
const noLinks = 'test_mdLinks\\No_Links.md';
const noMdFile = './package.json';
const folderPath = './test_mdLinks';


describe('mdLinks', () => {
  it('should reject with an error if no path is provided', () => {
    expect(() => mdLinks()).rejects.toThrowError('Please provide a valid path');
  });

  it('should reject with an error if the provided path is not a string', () => {
    expect(() => mdLinks(123)).rejects.toThrowError('Please provide a valid path');
  });
  it('should reject with an error if the provided path does not exist', () => {
    expect(() => mdLinks('./ruta/noexiste.md')).rejects.toThrowError('Path does not exist');
  });

  it('should reject with an error if no markdown files are found', () => {
    expect(() => mdLinks(noMdFile)).rejects.toThrowError('This is not a Markdown File');
  });

  it('Should return error if there are no links in the .md file', () => {
    expect(() => mdLinks(noLinks)).rejects.toThrowError('No links were found');
  });

  test('should return the links that are in the path', () => {
    expect(() => mdLinks(testPath)).resolves.toContainEqual(
      expect.arrayContaining([
        expect.objectContaining({
          href: expect.any(String),
          text: expect.any(String),
          file: expect.any(String),
        }),
      ])
    );
  });
});


describe('pathAbs', () => {
  it('should return an absolute path if given an absolute path', () => {
    const absolutePath = pathAbs('C:\\Users\\aurap\\Desktop\\Laboratoria\\DEV009-md-links\\test_mdLinks\\Librerias.md');
    expect(path.isAbsolute(absolutePath)).toBe(true);
  });

  it('should return an absolute path if given a relative path', () => {
    const absolutePath = pathAbs('test_mdLinks\\Librerias.md');
    expect(path.isAbsolute(absolutePath)).toBe(true);
  });
});

describe('pathExists', () => {
  it('should resolve with true if the path exists', () => {
    return pathExists(folderPath).then(exists => {
      expect(exists).toBe(true);
    });
  });

  it('should reject with an error if the path does not exist', () => {
    return expect(pathExists('./nonexistent.md')).rejects.toThrowError(Error('Path does not exist'));
  });
});

describe('pathType', () => {
  it('should resolve with the path is a file', () => {
    return pathType(testPath).then(file => {
      expect(file).toBe(testPath);
    });
  });
  it('should return an array of file paths if the path is a directory', () => {
    return pathType(folderPath).then(files => {
      expect(Array.isArray(files)).toBe(true);
      expect(files).toContain(testPath);
    });
  });
});

describe('readDir', () => {
  it('should return an array of file paths from the directory', () => {
    const files = readDir(folderPath);
    expect(Array.isArray(files)).toBe(true);
    expect(files).toContain(testPath);
  });
});

describe('checkMd', () => {
  it('should resolve with an array of markdown file paths', () => {
    return checkMd([testPath, noMdFile]).then(markdownFiles => {
      expect(Array.isArray(markdownFiles)).toBe(true);
      expect(markdownFiles).toContain(testPath);
      expect(markdownFiles).not.toContain(noMdFile);
    });
  });

  it('should reject with an error if no markdown files are found', () => {
    return expect(checkMd([noMdFile])).rejects.toThrowError('No markdown files were found');
  });
});


describe('readFile', () => {
  it('should return an array of links for a valid file', () => {
    return readFile(testPath).then(links => {
      expect(Array.isArray(links)).toBe(true);
      expect(links.length).toBeGreaterThan(0);
    });
  });

it('should reject with an error if the file is not a markdown file', () => {
  return expect(readFile(noMdFile)).rejects.toThrowError(Error('No markdown files were found'));
});
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
    return extractLinks(testPath, data).then(links => {
      expect(links).toEqual(expect.arrayContaining([
        expect.objectContaining({
          href: 'https://github.com/axios/axios',
          text: 'Repositorio Oficial Axios',
          file: testPath,
        }),
      ]));
    });
  });
});


describe('validateLinks', () => {
  const data = [{
    href: 'https://jestjs.io/docs/en/configurationnn',
    text: 'Configuración Jest - INVALIDO',
    file: 'test\\Librerias1.md'
  }];
  it('Should return an array', () => {
    return validateLinks(data).then(result => {
      expect(Array.isArray(result)).toBe(true);
    })
  });
  it('Should return an array including href, text, file, status and message', () => {
    return expect(validateLinks(data)).resolves.toEqual(expect.arrayContaining([expect.objectContaining
      ({
        href: expect.any(String),
        text: expect.any(String),
        file: expect.any(String),
        status: expect.any(Number),
        message: expect.stringMatching(/^(ok|fail)$/),
      })
    ]))
  })
});
