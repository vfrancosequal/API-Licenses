# API REST- Pruebas unitarias e integración

_Este proyecto permite realizar pruebas unitarias y de integración consumiendo una API REST._

## Comenzando 🚀

_Para clonar este proyecto bastará con hacer una copia de la url del repositorio y dirigirse a la consola de git y a traves del comando git clone podrá contribuir al proyecto._


### Pre-requisitos 📋

Instalar
- [Instalación de dependencias npm](https://www.npmjs.com/)
- [Extenciones para Visual Studio](https://github.com/microsoft/vscode-azurefunctions)

### Instalación 🔧

Para ejecutar en local

```
npm run dev
```

## Ejecutando las pruebas ⚙️

_Para la ejecución de las pruebas, es importante hacerlo por archivos a través del comando npm test nombreArchivo, de lo contrario se podrían presentar errores en la ejecución._


### Y las pruebas de estilo de codificación ⌨️

_Estas pruebas permiten validar que el CRUD en la API se realice de manera adecuada._

```
    describe('GET /api/users', ()=>{

        let response
        beforeEach(async() =>{
            response = await request(app).get('/api/users').send()
        })

        it('The route works', async() => {            
            expect(response.status).toBe(200)
            expect(response.headers['content-type']).toContain('json')
        })

        it('Get all users', async() => {
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Array)
        })

        it('If the route is wrong', async() => {
            const response = await request(app).get('/api/user')
            expect(response.status).toBe(404)
        })
    })
```

## Construido con 🛠️

* [Node.js](https://nodejs.org/en) 
* [MongoDB](https://www.mongodb.com/es)
* [Express](https://expressjs.com/)

## Contribuyendo 🖇️

Por favor lee el [CONTRIBUTING.md](https://gist.github.com/villanuevand/xxxxxx) para detalles de nuestro código de conducta, y el proceso para enviarnos pull requests.

## Wiki 📖

Puedes encontrar mucho más de cómo utilizar este proyecto en nuestra [Wiki](https://github.com/tu/proyecto/wiki)

## Versionado 📌

Usamos [SemVer](http://semver.org/) para el versionado. Para todas las versiones disponibles, mira los [tags en este repositorio](https://github.com/tu/proyecto/tags).

## Autores ✒️


* **Tatiana Londoño** - *Trabajo Inicial* - [LinkenId](https://github.com/villanuevand)
* **Sergio Muñoz** - *Trabajo Inicial* - [LinkenId](https://github.com/villanuevand)
## Licencia 📄

Este proyecto está bajo la Licencia (Tu Licencia) - mira el archivo [LICENSE.md](LICENSE.md) para detalles

## Expresiones de Gratitud 🎁

* Comenta a otros sobre este proyecto 📢
* Invita una cerveza 🍺 o un café ☕ a alguien del equipo. 
* Da las gracias públicamente 🤓.
* etc.
