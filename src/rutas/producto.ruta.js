'use strict'

const express = require('express');
const productoControlador = require('../controladores/producto.controlador');
const md_autentication = require('../middlewares/authenticated');

const api = express.Router();

//      === Administrador ===

api.post('/registrarProducto/:idCategoria',md_autentication.ensureAuth,productoControlador.registrarProducto);
api.get('/listaProducto',md_autentication.ensureAuth,productoControlador.listaProductos);
api.get('/listaProductosId/:idProducto',md_autentication.ensureAuth,productoControlador.listaProductosId);
api.get ('/listaNombreProductoAd/:nombreProducto',md_autentication.ensureAuth,productoControlador.listaNombreProductoAd);


api.put('/editarProducto/:idProducto', md_autentication.ensureAuth,productoControlador.editarProducto);
api.delete('/eliminarProducto/:idProducto', md_autentication.ensureAuth,productoControlador.eliminarProducto);
api.get('/productosMasVendidos', md_autentication.ensureAuth,productoControlador.productosMasVendidos);
api.get('/agotadoProducto', md_autentication.ensureAuth,productoControlador.AgotadoProducto);


//      === Cliente ===
api.get ('/listaCatalogoCategoria/:idCategoria',md_autentication.ensureAuth,productoControlador.listaCatalogoCategoria);
api.get ('/listaNombreProducto/:nombreProducto',md_autentication.ensureAuth,productoControlador.listaNombreProducto);

api.get('/productosAgotados', md_autentication.ensureAuth,productoControlador.productosAgotados);
api.get('/productosMasDemanda', md_autentication.ensureAuth,productoControlador.productosMasDemanda);
module.exports = api;