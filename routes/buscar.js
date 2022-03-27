
const { Router } = require('express');
const { buscar } = require('../controllers/buscar')

const router = Router();

router.get('/:coleccion/:termino', buscar ); // se recibe 2 variables la coleccion y termino que indican la funcion y categoria  a buscar 
// la url deberia ser como url/api/buscar/productos/oreo donde buscar es coleccion y termino es productos, la variable buscar va en oreo


module.exports = router;