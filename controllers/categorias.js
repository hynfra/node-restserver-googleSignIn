const { response } = require("express");
const { Categoria, Usuario } = require('../models');// se extrae el schema categoria de los models

//obtener categorias - paginado - total - populate

const obtenerCategorias = async(req,res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };// se extrae solo los de estado : true ;
    
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)// se pone estado: true para mostrar los usuarios existentes
        //populate solo aplica cuando en el schema se tiene un objeto 
            .populate('usuario','nombre')// este metodo permite buscar un objeto, que en este caso es el usuario y como segundo argumento se pone la informacion que se quiere de dicho objeto, en este caso el nombre
            .skip( Number( desde ) )// skip se salta los datos segun el argumento entregado
            .limit(Number( limite )),// se transforma a numero porque al sacarlo de query viene en string
      
    ]);
   
    res.json({
         total,
         categorias,
        
         
    });


}
// obtener Categoria - populate {}
const obtenerCategoria = async(req = require,res = response) => {

    const {  id } = req.params; // la informacion viene de params por eso se pone alli
    const categoria  = await Categoria.findById( id ).populate('usuario','nombre');// populate extrae del objeto usuario el nombre

    res.json(
        categoria);
}




const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase(); // recibe el dato de la variable nombre en mayusculas

    const categoriaDB = await Categoria.findOne ({ nombre });

    if( categoriaDB ){// si existe la categoria salta este error
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    //generar la data a guardar

    const data = {
        nombre,
        usuario:req.usuario._id // se usa la id del JWT, la cual se llama _id por que lo pone el server de mongo
    }

    const categoria = new Categoria ( data ); // usa el schema de categoria con la data de arriba

    //guardar DB
    await categoria.save();

    res.status(201).json( categoria );
}

const actualizarCategoria = async(req, res = response) => {

    const { id } = req.params;
    // se extrae el _id para que no se modifique el id 
    const { estado, usuario, ...resto } = req.body;// extraer todo lo que no necesito que se cambie o actualice
    
    resto.nombre = resto.nombre.toUpperCase();// aca solo se cambia la variable nombre dentro de data, no todo el conjunto de datos
    resto.usuario = req.usuario._id; // se recibe el id del usuario dueño del token que esta haciendo el cambio


   //{new : true} hace que se muestre el documento actualizado en postman
    const categoria = await Categoria.findByIdAndUpdate( id, resto,{new : true} );// busca id y la actualiza

    res.json(categoria);
}

//actualizar categoria 

//borrarCategoria - estado: false

const borrarCategoria = async(req, res = response) => {
    
    //fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false },{new : true} );// marca el estado en false

    
    res.json(categoria);
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}