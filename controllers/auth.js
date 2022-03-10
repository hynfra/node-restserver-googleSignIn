const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

// esta clase genera los token y autentica al usuario
const login = async(req, res = response) => {

    const { correo, password } = req.body; // se extrae el correo y pass  

    try {
      
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo }); // findone es un metodo de mongoose que permite encontrar un documento y devuelve una query
        if ( !usuario ) {
            // devuelve un error con status 400
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // SI el usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        // bcryptjs es una libreria que incripta contraseñas
        const validPassword = bcryptjs.compareSync( password, usuario.password );// compara la pass del usuario con la que fue ingresado y devuelve un boolean
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        // solo puede haber 1 metodo res.json 
        res.json({
            usuario, // entrega el usuario ingresado y su token 
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   

}

// metodo que usa la libreria google verify para ingresar con un correo de google 
const googleSignin = async(req, res = response) => {

    const { id_token } = req.body; // extrae el token del usuario
    
    try {
        const { correo, nombre, img } = await googleVerify( id_token ); // saca el correo, nombre y imagen del usuario ingresado

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) { // si no existe el usuario se crea 
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );// usa la clase usuario con la data ingresada 
            await usuario.save(); // guarda la clase creada en la bd
        }

        // Si el usuario en DB
        if ( !usuario.estado ) { // verifica que el usuario ingresado no este bloqueado
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {

        res.status(400).json({
            msg: 'Token de Google no es válido'
        })

    }



}



module.exports = {
    login,
    googleSignin
}
