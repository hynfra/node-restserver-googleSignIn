const { Schema, model } = require('mongoose');

//esquema de la clase role 
const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});


module.exports = model( 'Role', RoleSchema );
