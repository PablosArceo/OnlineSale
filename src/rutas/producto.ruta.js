'use strict'

const express = require('express');
const productoControlador = require('../controladores/producto.controlador');
const md_autentication = require('../middlewares/authenticated');

const api = express.Router();

api.post('/registrarProducto/:idCategoria',md_autentication.ensureAuth,productoControlador.registrarProducto);
api.get('/listaProducto',md_autentication.ensureAuth,productoControlador.listaProductos);


module.exports = api;