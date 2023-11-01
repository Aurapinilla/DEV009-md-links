# Markdown Links

## Índice

* [1. Preámbulo](#1-preámbulo)
* [2. Resumen del proyecto](#2-resumen-del-proyecto)
* [3. Cómo usar](#3-cómo-usar)
* [4. Paquete NPM](#4-paquete-npm)
***

## 1. Preámbulo

[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado
ligero muy popular entre developers. Es usado en muchísimas plataformas que
manejan texto plano (GitHub, foros, blogs, ...) y es muy común
encontrar varios archivos en ese formato en cualquier tipo de repositorio
(empezando por el tradicional `README.md`).

Estos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de
la información que se quiere compartir.

Dentro de una comunidad de código abierto, nos han propuesto crear una
herramienta usando [Node.js](https://nodejs.org/), que lea y analice archivos
en formato `Markdown`, para verificar los links que contengan y reportar
algunas estadísticas.

![md-links](https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg)

## 2. Resumen del proyecto

El proyecto de md-links es una herramienta de línea de comandos que permite extraer y analizar enlaces contenidos en archivos Markdown (archivos con extensión .md). La función principal de md-links es encontrar todos los enlaces presentes en los archivos Markdown de un directorio o archivo específico y mostrar información relevante sobre cada enlace, como la URL, el texto asociado, y el estado de la solicitud HTTP (válido o roto) cuando se realiza una validación.

El proyecto consta de varias funciones y módulos que realizan las siguientes tareas:

**Verificación de la existencia y tipo de ruta:** Verifica si la ruta proporcionada como entrada existe y determina si es un archivo o un directorio.

**Lectura y filtrado de archivos Markdown:** Lee los archivos Markdown del directorio especificado y filtra aquellos que son archivos válidos.

**Extracción de enlaces:** Busca en los archivos Markdown los enlaces que están dentro de la sintaxis Markdown y los extrae junto con el texto asociado y la ruta del archivo donde se encuentran.

**Validación de enlaces (opcional):** Si el usuario elige la opción de validación, realiza solicitudes HTTP a cada enlace para determinar si son enlaces válidos (con respuesta HTTP 200) o rotos (con otras respuestas HTTP).

**Presentación de resultados:** Muestra en la consola la información de cada enlace encontrado, incluyendo la URL, el texto asociado, el archivo en el que se encuentra y, en caso de validación, el estado de la solicitud HTTP.

En resumen, md-links es una herramienta que facilita el análisis y validación de enlaces en archivos Markdown, proporcionando información útil para verificar la integridad de los enlaces y ayudando a los usuarios a mantener actualizada la documentación y los enlaces en sus proyectos.


## 3. Cómo usar

**Uso básico:** El usuario puede utilizar md-links para analizar archivos Markdown y extraer los enlaces que contienen. El comando básico que deberá poner en su terminal es:

  `md-links <path-to-file-or-directory>`

  Donde `<path-to-file-or-directory>` es la ruta del archivo o directorio que el usuario desea analizar. Por ejemplo:

   `md-links ./docs/file.md`

   Al ejecutar de esta manera la función md-links, retornará los links encontrados en el archivo, carpeta y/o subcarpetas, con la siguiente estructura:

* `href`: URL encontrada.
* `text`: Texto que aparecía dentro del link (`<a>`).
* `file`: Ruta del archivo donde se encontró el link.

**Opciones Disponibles:** 

- **--validate:** Si pasamos la opción `--validate`, el módulo debe hacer una petición HTTP para
averiguar si el link funciona o no. Si el link resulta en una redirección a una
URL que responde ok, entonces consideraremos el link como ok.

Por ejemplo:

```sh
$ md-links ./some/example.md --validate
./some/example.md http://algo.com/2/3/ ok 200 Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html fail 404 algún doc
./some/example.md http://google.com/ ok 301 Google
```

- **--stats:** Si pasamos la opción `--stats` el output (salida) será un texto con estadísticas
básicas sobre los links.

```sh
$ md-links ./some/example.md --stats
Total: 3
Unique: 3
```

- **--validate y --stats combinadas:** También podemos combinar `--stats` y `--validate` para obtener estadísticas que
necesiten de los resultados de la validación.

```sh
$ md-links ./some/example.md --stats --validate
Total: 3
Unique: 3
Broken: 1
```

**Resultados en la consola:** Al ejecutar el comando con las opciones deseadas, md-links mostrará en la consola los resultados del análisis. Dependiendo de las opciones utilizadas, el usuario obtendrá una lista de enlaces encontrados con sus detalles, estadísticas sobre los enlaces o ambas cosas.


Encuentra el paquete listo para descargar en npm en el siguiente [Link](https://www.npmjs.com/package/mdlinks-aurapinilla)