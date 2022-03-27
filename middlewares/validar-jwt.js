const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

//los middleware reciben 3 argumentos normalmente, la request, response y el next que permite continuar con otro middlware
const validarJWT = async( req = request, res = response, next ) => { // este metodo valida el token y ademas entrega el usuario ingresado

    const token = req.header('x-token');// se recibe el valor del token desde una variable que se llama x-token desde el header 

    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
         // metodo que recibe los token y la variable de entorno que verifica los token el cual esta en el archivo .env
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );

        if( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }

        // Verificar si el uid tiene estado true
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            })
        }
        
        
        req.usuario = usuario;
        next();// permite continuar con el siguiente middleware si es que es requerido

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}




module.exports = {
    validarJWT
}