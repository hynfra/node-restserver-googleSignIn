const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.usuariosPath = '/api/usuarios';
        this.authPath     = '/api/auth'; // path para la autenticacion
        

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
        
        this.app.use( this.authPath, require('../routes/auth'));
        this.app.use( this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
