'use strict'

const express = require('express');
const usuarioControlador = require('../controladores/usuario.controlador');
const md_autentication = require('../middlewares/authenticated');


const api = express.Router();

api.post('/loginUsuario', usuarioControlador.loginUsuario );



module.exports = api;