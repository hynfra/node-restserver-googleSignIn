
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');


const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios');

const router = Router();


router.get('/', usuariosGet );// no se coloca () porque se pone la referencia al metodo en vez de ejecutarlo desde aca. Esto es para que cuando se envien los datos de req y res se envien al controller y no se envien a este metodo

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ), 
    validarCampos// se debe poner esto cada vez que se aplique un check 
],usuariosPut );// recibe la id con la variable id

router.post('/',[// arreglo que recibe los nombre de las variables enviadas y revisa que esten bien escritas, se hace en arreglo cuando son muchos
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),// paquete express-validator, donde se coloca el nombre de la variable, el mensaje que quieres que diga si la variable no dice lo que se quiere que se diga y por ultimo el metodo que define el tipo de dato que se quiere recibir
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido ),  // esto es lo mismo que (rol) => esRoleValido(rol), ya que cuando recibe solo 1 argumento, el primer argumento que se envie al metodo se enviara al que esta dentro
    validarCampos
], usuariosPost );

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAR_ROLE','OTRO_ROLE'),// se recibe estos argumentos en el middlware
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;