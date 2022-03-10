const jwt = require('jsonwebtoken');



const generarJWT = ( uid = '' ) => { // genera un token con la libreria jsonwebtoken

    return new Promise( (resolve, reject) => {

        const payload = { uid };// extrae la uid del usuario ingresado

        // recibe la uid, la key privada del archivo .env, el tiempo de expiracion y el metodo que gestiona el token
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, ( err, token ) => { // si sale error caera en reject y sino devolvera el token correcto

            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token );
            }
        })

    })
}




module.exports = {
    generarJWT
}

