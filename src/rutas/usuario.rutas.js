'use strict'

const express = require('express');
const usuarioControlador = require('../controladores/usuario.controlador');
const md_autentication = require('../middlewares/authenticated');


const api = express.Router();

//     === Login  General ===
api.post('/login', usuarioControlador.login );


//      === Administrador ===
api.post('/registrarNuevoUsuario',md_autentication.ensureAuth,usuarioControlador. registrarNuevoUsuario);
api.put('/editarUser/:idUser',md_autentication.ensureAuth,usuarioControlador.editarUser);
api.delete('/eliminarUser/:idUser', md_autentication.ensureAuth, usuarioControlador.eliminarUser);
api.put('/editarRoles/:idUser', md_autentication.ensureAuth,usuarioControlador.editarRoles);


//      === Cliente ===
api.post('/registrarCliente',usuarioControlador.registrarCliente );
api.put('/editarCliente',md_autentication.ensureAuth, usuarioControlador.editarCliente);
api.delete('/eliminarCliente',md_autentication.ensureAuth,usuarioControlador.eliminarCliente);
api.put('/agregarAlCarrito/:idUser/:idProducto',md_autentication.ensureAuth, usuarioControlador.agregarAlCarrito);

module.exports = api;