const { response } = require("express");
const {   Producto} = require('../models');// se extrae el schema categoria de los models


//obtener categorias - paginado - total - populate

const obtenerProductos = async(req,res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };// se extrae solo los de estado : true ;
    
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)// se pone estado: true para mostrar los usuarios existentes
        //populate solo aplica cuando en el schema se tiene un objeto 
            .populate('usuario','nombre')// este metodo permite buscar un objeto, que en este caso es el usuario y como segundo argumento se pone la informacion que se quiere de dicho objeto, en este caso el nombre
            .populate('Categoria','nombre')
            .skip( Number( desde ) )// skip se salta los datos segun el argumento entregado
            .limit(Number( limite )),// se transforma a numero porque al sacarlo de query viene en string
      
    ]);
   
    res.json({
         total,
         productos,
        
         
    });
   


}
// obtener Categoria - populate {}
const obtenerProductoPorId = async(req = require,res = response) => {
    const {  id } = req.params; // la informacion viene de params por eso se pone alli
    const producto  = await Producto.findById( id ).populate('usuario','nombre')
    .populate('categoria','nombre');// populate extrae del objeto usuario el nombre

    res.json(
        producto);
    
}




const crearProducto = async(req, res = response) => {
    
    const {estado, usuario, ...body } = req.body;
    
   const productoDB = await Producto.findOne( { nombre: req.body.nombre } );
    if( productoDB ){// si existe el producto salta este error
        return res.status(400).json({
            msg: `el producto con la ID ${ productoDB._id }, ya existe`
        });
    }

    //generar la data a guardar

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario:req.usuario._id, // se usa la id del JWT, la cual se llama _id por que lo pone el server de mongo
        
    }

    const producto = new Producto ( data ); // usa el schema de categoria con la data de arriba

    //guardar DB
    await producto.save();

    res.status(201).json( producto );
    
}

const actualizarProducto = async(req, res = response) => {

    const { id } = req.params;
    // se extrae el _id para que no se modifique el id 
    const { estado, usuario, ...resto } = req.body;// extraer todo lo que no necesito que se cambie o actualice
    
    if (resto.nombre){
        resto.nombre = resto.nombre.toUpperCase();// aca solo se cambia la variable nombre dentro de data, no todo el conjunto de datos
    
    }
   resto.usuario = req.usuario._id; // se recibe el id del usuario dueño del token que esta haciendo el cambio


   //{new : true} hace que se muestre el documento actualizado en postman
    const producto = await Producto.findByIdAndUpdate( id, resto,{new : true} );// busca id y la actualiza

    res.json(producto);
}

//actualizar categoria 

//borrarCategoria - estado: false

const borrarProducto = async(req, res = response) => {
    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false },{new : true} );// marca el estado en false

    
    res.json(productoBorrado);
   
}

module.exports = {
    crearProducto,
     obtenerProductos,
     obtenerProductoPorId,
     actualizarProducto,
     borrarProducto
}