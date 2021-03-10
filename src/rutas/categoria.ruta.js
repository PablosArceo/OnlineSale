'use strict'

const express = require('express');
const categoriaControlador = require('../controladores/categoria.controlador');
const md_autentication = require('../middlewares/authenticated');

const api = express.Router();


api.post('/registrarCategoria',md_autentication.ensureAuth,categoriaControlador.registrarCategoria);
api.put('/editarCategoria/:idCategoria',md_autentication.ensureAuth,categoriaControlador.editarCategoria);
api.get('/listarCategorias',md_autentication.ensureAuth,categoriaControlador.listarCategorias);
api.get('/listaCategoriaid/:idCategoria',md_autentication.ensureAuth,categoriaControlador.listaCategoriaId);
api.get('/listaNombreCategorias/:nombreCategoria',md_autentication.ensureAuth,categoriaControlador.listaNombreCategorias);

api.delete('/eliminarCategoria/:idCategoria', md_autentication.ensureAuth,categoriaControlador.eliminarCategoria);


module.exports = api;