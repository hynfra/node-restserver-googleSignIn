const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');


// en este archivo se crea todos los metodos usados por la clase usuario, que incluye los get, post , delete , update
const usuariosGet = async(req = request, res = response) => {

    // req es = a request para recibir varios parametros
    // req.query recibira todos los parametros 
    //se puede usar desestructuracion para recibir las variables que uno quiera y asignar valores por defecto
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };// se extrae solo los de estado : true 
//la variable estado define si el usuario existe o no en el sistema
// se guarda en una promesa ya que si se coloca 2 await para cada linea va a hacer que demore mas en compilar, ya que tiene que esperar a que finalice una linea para continuar a la siguiente
// con el promise se puede hacer que las 2 lineas funcionen a la vez, ya que no dependen una de otra para usarse
// se aplica desestructuracion del arreglo, ya que cada metodo guardado en el Promise.all es un indice de arreglo, donde el primer metodo se coloca en el total y el segundo en la variable usuarios
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)// se pone estado: true para mostrar los usuarios existentes
            .skip( Number( desde ) )// skip se salta los datos segun el argumento entregado
            .limit(Number( limite ))// se transforma a numero porque al sacarlo de query viene en string
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {
    
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    // se extrae el _id para que no se modifique el id 
    const { _id, password, google, correo, ...resto } = req.body;// extraer todo lo que no necesito que se cambie o actualice

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();//metodo del paquete bcryptjs, encripta 10 veces por defecto, se puede poner un numero mayor en los atributos
        resto.password = bcryptjs.hashSync( password, salt );// hashSync encripta en una sola via, recibe la clave y el metodo de escriptacion
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );// busca id y la actualiza

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {
    
    //fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    
    res.json(usuario);
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}