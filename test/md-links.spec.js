const { mdLinks } = require('../index.js');


describe('mdLinks', () => {

  it('should...', () => {
    console.log('FIX ME!');
  });
  it('Debe rechazar la promesa si la ruta no existe', () => {
    return mdLinks('./estelink/noexiste.md').catch((error) => {
      expect(error).toBe('Path does not exist');
    });
  });
});
