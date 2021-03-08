'use strict'

const express = require('express');
const productoControlador = require('../controladores/producto.controlador');
const md_autentication = require('../middlewares/authenticated');

const api = express.Router();

api.post('/registrarProducto/:idCategoria',md_autentication.ensureAuth,productoControlador.registrarProducto);
api.get('/listaProducto',md_autentication.ensureAuth,productoControlador.listaProductos);
api.get('/listaProductosId/:idProducto',md_autentication.ensureAuth,productoControlador.listaProductosId);

api.put('/editarProducto/:idProducto', md_autentication.ensureAuth,productoControlador.editarProducto);
api.delete('/eliminarProducto/:id', md_autentication.ensureAuth,productoControlador.eliminarProducto);

module.exports = api;