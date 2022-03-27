const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.paths = { // aqui se almacenan todas las rutas
            usuarios : '/api/usuarios',
            buscar   : '/api/buscar',
            auth     : '/api/auth' ,// path para la autenticacion
            categorias: '/api/categorias',
            productos : '/api/productos',
        };

        

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();
        //middlewares: funciones que añaden mas funciones al webserver, se ejecutan continuamente
        // Rutas de mi aplicación
        this.routes();
    }
    // se debe colocar la ip en mongodb.com para que funcione 
//middleware es una funcion que se ejecuta antes de una peticion 

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        // permite recibir un tipo de informacion, en este caso JSON
        this.app.use( express.json() );

       //directorio public
        //use() indica que es un middleware
        this.app.use( express.static('public') );// aqui indica la carpeta que se mostrara que se llama public, esto se sobrepone a la ruta puesta 

    }

    routes() {
         // aqui se indican hacia donde iran los archivos
        
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.buscar, require('../routes/buscar'));
        this.app.use( this.paths.usuarios, require('../routes/usuarios'));
        this.app.use( this.paths.categorias, require('../routes/categorias'));
        this.app.use( this.paths.productos, require('../routes/productos'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
