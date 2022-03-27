const { Schema, model } = require('mongoose');

//esquema de la clase role 
const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique:true
    },
    estado: {
        type: Boolean,
        default:true,
        required:true // siempre se pone el required
    },
    //aqui se pone el usuario que esta usando la categoria, por ello se pone otro tipo de dato, el schema
    usuario: {
        type: Schema.Types.ObjectId,// esto indica que el dato a ingresar sea de tipo schema, y se validara con la id del objeto
        ref: 'Usuario', // hace referencia al schema con nombre Usuario, el nombre se define con lo que se escribio al exportar el modelo de la clase
        required: true
    }
});

// esto permite extraer lo que no vamos a ocupar de nuestra categoria, como la version (__v) y el estado
CategoriaSchema.methods.toJSON = function() { // extrae la informacion cuando se usa JSON
    const { __v, estado, ...data  } = this.toObject(); // el ...usuario almacena en usuario todas las variables que no se separaron con la desestructuracion
    return data;
}


module.exports = model( 'Categoria', CategoriaSchema );