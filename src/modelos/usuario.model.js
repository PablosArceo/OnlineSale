'use strict'
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
user: String,
password: String,
rol: String



})

module.exports = mongoose.model('Usuarios', UsuarioSchema)