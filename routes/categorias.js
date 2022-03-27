const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria,
    obtenerCategorias, 
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria} = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const { validarCampos,validarJWT,esAdminRole } = require('../middlewares/');


const router = Router();

//{{url}}/api/categorias
// obtener todas las categorias
router.get('/', obtenerCategorias );
// obtener una categoria por id
router.get('/:id',[
    // se deben hacer validaciones antes de obtener la categoria, sino dara error
    //el orden de las validaciones importa 
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
],obtenerCategoria);

// crear categoria - privado - cualquier persona con un token valido
// en postman, el token se saca desde un usuario ya creado y se manda desde headers, en key poner x-token y copiar dicho token
router.post('/', [ 
    validarJWT,
    // para probar el check de nombre desde postman, se debe ir a body y en formato json enviar la variable nombre
    /*{
        nombre:"algun nombre"
    }
     */
    check('nombre', 'El nombre es obligatorio ').not().isEmpty(),// se debe asegurar que se envie el nombre 
    validarCampos
 ], crearCategoria);

//actualizar - privador- cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio ').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], actualizarCategoria);

// borrar una categoria - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], borrarCategoria);

module.exports = router;