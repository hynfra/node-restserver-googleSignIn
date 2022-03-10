const { validationResult } = require('express-validator');


const validarCampos = ( req, res, next ) => {

    const errors = validationResult(req);// valida los errores producidos por campos mal escritos a traves del coidog de usuarios.js de routes
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }

    next(); // next permite que avance de un middleware a otro 
}



module.exports = {
    validarCampos
}
