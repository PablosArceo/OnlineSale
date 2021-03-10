'use strict'

const express = require('express');
const facturaControlador = require('../controladores/factura.controlador');
const md_autentication = require('../middlewares/authenticated');

const api = express.Router();

api.post('/crearFactura/:idUser',md_autentication.ensureAuth,facturaControlador.crearFactura);
api.get('/listaFacturas',md_autentication.ensureAuth,facturaControlador.listaFacturas);
api.get('/listaFacturaProductos/:idFactura',md_autentication.ensureAuth,facturaControlador.listaFacturaProductos);

module.exports = api;