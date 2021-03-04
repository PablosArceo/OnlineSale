'use strict'

var bcrypt  = require('bcrypt-nodejs');
var jwt = require('../servicios/jwt');
var Usuario = require('../modelos/usuario.model');


// LOGIN DE USUARIO

function loginUsuario(req, res){
    var params = req.body;
    
    Usuario.findOne({ user: params.user }, (err,  usuarioEncontrado)=>{
    if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
    
    if (usuarioEncontrado){                         
           bcrypt.compare(params.password, usuarioEncontrado.password, (err, passCorrecta)=> {
               if(passCorrecta){
                   if(params.obtenerToken === 'true'){
                       return res.status(200).send({
                       token: jwt.createToken(usuarioEncontrado)
                   });
    
               }else{
                   usuarioEncontrado.password = undefined;
                   return res.status(200).send({ usuarioEncontrado })
               }
           }else{
               return res.status(404).send({ mensaje: 'El Usuario no se ha podedido identificar'})
           }
    })
    }else{
        return res.status(404).send({mensaje: 'EL Usuario no se ha podido ingresar'})
    }
    })
    }
    

module.exports={
loginUsuario

    }