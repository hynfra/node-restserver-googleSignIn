const { response } = require('express');
const { Usuario, Categoria , Producto} = require('../models');
const {ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = [// lista de categorias permitidas en el sistema, si se añaden mas en la bd, se deben agregar aqui tambien
    'usuarios',
    'categorias',
    'productos',
    'roles'
]
// se buscara el usuario por el mongoID 
const buscarUsuarios = async( termino = '', res = response) =>{

    // pregunta si el id puesto es valido para mongoID
    const esMongoID = ObjectId.isValid( termino ); // TRUE

    if( esMongoID ){ // si da true es por que es valido
        const usuario = await Usuario.findById( termino ); // busca por la id ingresada el usuario
        return res.json( {
            results: ( usuario ) ?  [ usuario ] : [] // se pregunta si existe el usuario, si existe se envia como arreglo y si no se envia un arreglo vacio
        } );
    }

    const regex = new RegExp(termino, 'i'); // expresion regular que permite buscar incluso poniendo iniciales y no el nombre completo

    // aqui se inteta hacer que al buscar por el nombre del usuario devuelva este con sus datos 
    const usuarios = await Usuario.find({ 
        // aqui se expresa que se busque por el nombre de usuario O el correo
        // y abajo indica que ademas debe ser el estado = true 
        $or: [{ nombre : regex  }, {correo: regex }], // la expresion $or viene de mongo, el cual es como un O que hace que se cumpla alguna de estas condiciones
        $and: [{estado: true }]
    });
    res.json( {
        results: usuarios 
    } );
}

const buscarProductos = async( termino = '', res = response) =>{

    // pregunta si el id puesto es valido para mongoID
    const esMongoID = ObjectId.isValid( termino ); // TRUE

    if( esMongoID ){ // si da true es por que es valido
        const producto = await Producto.findById( termino ).populate('categoria', 'nombre');; // busca por la id ingresada el usuario
        return res.json( {
            results: ( producto ) ?  [ producto ] : [] // se pregunta si existe el usuario, si existe se envia como arreglo y si no se envia un arreglo vacio
        } );
    }

    const regex = new RegExp(termino, 'i'); // expresion regular que permite buscar incluso poniendo iniciales y no el nombre completo

    // aqui se intenta hacer que al buscar por el nombre del usuario devuelva este con sus datos 
    const productos = await Producto.find({ 
        // aqui se expresa que se busque por el nombre de usuario O el correo
        // y abajo indica que ademas debe ser el estado = true 
        $and: [{ nombre : regex  } , {estado: true }]
    })
    .populate('categoria', 'nombre');
    res.json( {
        results: productos 
    } );
}

const buscarCategorias = async( termino = '', res = response) =>{

    // pregunta si el id puesto es valido para mongoID
    const esMongoID = ObjectId.isValid( termino ); // TRUE

    if( esMongoID ){ // si da true es por que es valido
        const categoria = await (await Categoria.findById( termino )); // busca por la id ingresada el usuario
        return res.json( {
            results: ( categoria ) ?  [ categoria ] : [] // se pregunta si existe el usuario, si existe se envia como arreglo y si no se envia un arreglo vacio
        } );
    }

    const regex = new RegExp(termino, 'i'); // expresion regular que permite buscar incluso poniendo iniciales y no el nombre completo

    // aqui se intenta hacer que al buscar por el nombre del usuario devuelva este con sus datos 
    const categorias = await Categoria.find({ 
        // aqui se expresa que se busque por el nombre de usuario O el correo
        // y abajo indica que ademas debe ser el estado = true 
        $and: [{ nombre : regex  } , {estado: true }]
    });
    res.json( {
        results: categorias 
    } );
}



const buscar = (req, res = response ) => {

    const { coleccion, termino } = req.params; // se extraen de la url de routes las variables coleccion y termino
    
    if(!coleccionesPermitidas.includes(coleccion ) ){ // verifica que si NO se encuentra la coleccion ingresada dentro del arreglo de colecciones, arroja el error
        return res.status(400).json ({
            msg: `Las colecciones permitidas son ${ coleccionesPermitidas}`
        })
    }
    switch( coleccion ){
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
       case 'categorias':
            buscarCategorias(termino, res);
           break;
       case  'productos':
        buscarProductos(termino, res);
           break;

        default:

        res.status(500).json({
            msg: 'Se le olvido hacer esta busqueda'
        })
    }
    
}

module.exports = {
    buscar
}