'use strict'

var bcrypt  = require('bcrypt-nodejs');
var jwt = require('../servicios/jwt');
var Usuario = require('../modelos/usuario.model');


// LOGIN DE USUARIO

function loginAdmin(req, res){
    var params = req.body;
    
    Usuario.findOne({ user: params.user }, (err,  usuarioEncontrado)=>{
    if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
    
    if (usuarioEncontrado){                         
           bcrypt.compare(params.password, usuarioEncontrado.password, (err, passwordCorrect)=> {
               if(passwordCorrect){
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


    // Agregar nuevo Usuario
   
function registrarCliente(req,res) {
    var usuarioModel = new Usuario();
    var params = req.body;
    
    if (params.user  && params.password ) {
        usuarioModel.user = params.user;
        usuarioModel.rol=params.rol;

        Usuario.find({ $or: [
            {user: usuarioModel.user},
            {rol: usuarioModel.rol}
        ]}).exec((err, UsuariosEncontrados)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion del Cliente' })  
            
            if (UsuariosEncontrados 
                && UsuariosEncontrados.length >=1) {
                return res.status(500).send({mensaje: 'El Cliente ya se encuentra registrado'})
            }else{
                bcrypt.hash(params.password,null,null,(err, passwordEncriptada)=>{
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err,UsuarioGuardado)=>{
                        if (err) return res.status(500).send({mensaje: 'Error al guardar el  Cliente'}) 
                            
                        if (UsuarioGuardado) {
                            res.status(200).send(UsuarioGuardado)    
                        }else{
                            res.status(404).send({mensaje: 'No se ha podido registrar el Cliente'})
                        }
                    })
                })
            }
        })
    }    
}


function loginCliente (req,res){
    var params = req.body;

    Usuario.findOne({ user: params.user }, (err,  ClienteEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        
        if (ClienteEncontrado){                         
               bcrypt.compare(params.password, ClienteEncontrado.password, (err, passwordCorrect)=> {
                   if(passwordCorrect){
                       if(params.obtenerToken === 'true'){
                           return res.status(200).send({
                           token: jwt.createToken(ClienteEncontrado)
                       });
        
                   }else{
                       ClienteEncontrado.password = undefined;
                       return res.status(200).send({ ClienteEncontrado })
                   }
               }else{
                   return res.status(404).send({ mensaje: 'El Cliente no se ha podedido identificar'})
               }
        })
        }else{
            return res.status(404).send({mensaje: 'EL Cliente no se ha podido ingresar'})
        }
        })
        }

module.exports={
loginAdmin,
registrarCliente,
loginCliente

    }