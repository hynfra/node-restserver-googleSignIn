const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto,
    obtenerProductos, 
    obtenerProductoPorId,
    actualizarProducto,
    borrarProducto} = require('../controllers/productos');
const { existeProductoPorId, existeCategoria } = require('../helpers/db-validators');

const { validarCampos,validarJWT,esAdminRole } = require('../middlewares/');


const router = Router();

//{{url}}/api/categorias
// obtener todas las categorias
router.get('/', obtenerProductos );
// obtener una categoria por id
router.get('/:id',[
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],obtenerProductoPorId);

// crear categoria - privado - cualquier persona con un token valido
// en postman, el token se saca desde un usuario ya creado y se manda desde headers, en key poner x-token y copiar dicho token
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'no es una id de mongo ').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto );

//actualizar - privador- cualquiera con token valido
router.put('/:id',[
    validarJWT,
    //check('categoria', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],actualizarProducto );

// borrar una categoria - admin
router.delete('/:id',[ 
 validarJWT,
esAdminRole,
check('id', 'No es un ID válido').isMongoId(),
check('id').custom( existeProductoPorId ),
validarCampos
],borrarProducto );

module.exports = router;