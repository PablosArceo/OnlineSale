'use strict'

const express = require('express');
const usuarioControlador = require('../controladores/usuario.controlador');
const md_autentication = require('../middlewares/authenticated');


const api = express.Router();

api.post('/loginAdmin', usuarioControlador.loginAdmin );
api.post('/registrarCliente',usuarioControlador.registrarCliente );
api.post('/loginCliente',usuarioControlador.loginCliente);

module.exports = api;