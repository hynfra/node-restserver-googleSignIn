const { response } = require('express')


const esAdminRole = ( req, res = response, next ) => {

    if ( !req.usuario ) {// esto valida que se ejecuto este middleware sin validar el token en ejecutar el validar-jwt
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario;
    
    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede hacer esto`
        });
    }

    next();
}


const tieneRole = ( ...roles  ) => {// recibe todos los roles escritos en routes
    return (req, res = response, next) => {
        
        if ( !req.usuario ) {// esto valida que se ejecuto este middleware sin validar el token en ejecutar el validar-jwt
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        if ( !roles.includes( req.usuario.rol ) ) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }


        next();
    }
}



module.exports = {
    esAdminRole,
    tieneRole
}