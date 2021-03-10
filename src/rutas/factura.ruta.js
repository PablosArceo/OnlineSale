'use strict'

const express = require('express');
const facturaControlador = require('../controladores/factura.controlador');
const md_autentication = require('../middlewares/authenticated');

const api = express.Router();

api.post('/crearFactura/:idUser',md_autentication.ensureAuth,facturaControlador.crearFactura);

module.exports = api;