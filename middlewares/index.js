

const validaCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
// este archivo exporta todos los middlewares para un mejor control de estos 
module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
}