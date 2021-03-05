'use strict'

var bcrypt  = require('bcrypt-nodejs');
var jwt = require('../servicios/jwt');
var Usuario = require('../modelos/usuario.model');
const { param } = require('../rutas/usuario.rutas');


// Login de Admin

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


    
   // Agregar Clientes - Unicamente para Clientes
function registrarCliente(req,res) {
var usuarioModel = new Usuario;
var params = req.body;

if (params.user && params. password){
    usuarioModel.user=params.user;
    usuarioModel.rol = "ROL_CLIENTE"
    Usuario.find({user:usuarioModel.user}).exec((err, usuarioEncontrado)=>{
    if(err) return res.status(500).send({mensaje: 'Error en la peticion del cliente'})
    if (usuarioEncontrado && usuarioEncontrado.length >=1 ){
       return res.status(500).send({mensaje:'El Cliente ya Existe'})

    }else{
        bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
        usuarioModel.password = passwordEncriptada;
        usuarioModel.save((err, UsuarioGuardado)=>{
            if (err) res.status(500).send({mensaje: 'Error en la peticion del Cliente'})
            if(usuarioEncontrado){
              return res.status(200).send(UsuarioGuardado);

            }else{
                return res.status(500).send({mensaje: 'Error al guardar el Cliente'})
            }

        })


        })
    }

    })


}else{
    return res.status(500).send({mensaje: 'Llene todos los campos para registrar un cliente'})
}
}

// Login de Cliente Unicamente para Clientes 
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
    


     
    /// Agregar Clientes y Administradores -- Unicamente Para Administradores --
    function registrarNuevoUsuario(req,res) {
        var usuarioModel = new Usuario();
        var params = req.body;

        if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Admins pueden realizar dicha accion'})

        if (params.user && params.password && params.rol){
        usuarioModel.user = params.user;
        usuarioModel.rol = params.rol;
       
    
         Usuario.find({user: usuarioModel.user}).exec((err, usuarioEncontrado)=>{
         if (err) return res.status(500).send({mensaje: 'Error en la peticion de Usuario'});
         if (usuarioEncontrado && usuarioEncontrado.length >=1){
             return res.status(500).send({mensaje: 'El Usuario ya se encuentra registrado'})
         }else{
            if(params.rol =='ROL_ADMIN' | params.rol == 'ROL_CLIENTE'  ){
            bcrypt.hash(params.password,null,null,(err, passwordEncriptada)=>{
              usuarioModel.password = passwordEncriptada;
              usuarioModel.save((err, UsuarioGuardado)=>{
              if(err) return res.status(500).send({mensaje:'Error al intentar guardar los datos del Usuario'});
              if(UsuarioGuardado){
                  return res.status(200).send(UsuarioGuardado);
              }else{
                  return res.status(500).send({mensaje: 'Error al guardar la constraseña del usuario'})
              }

              })

            })
             }else{
                return res.status(500).send({mensaje:'Error al ingresar el rol, Unicamente puede ser ROL_ADMIN o ROL_CLIENTE'})

             }
         }           

           
        })    
    
    }else{
     return res.status(500).send({mensaje:'Ingrese todos los datos para crear un nuevo usuario'});
    }
    }

     function editarCliente(req, res) {
           var idCliente = req.params.idCliente;
            var params = req.body;
            
            if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje:'Solo clientes pueden modificar sus datos'})
            
            Usuario.findById(req.user.sub, (err,ClienteEncontrado)=>{
                    if(err) return res.status(500).send({mensaje: 'Error en la busqueda de Cliente'})
                    if(ClienteEncontrado){
                          if (ClienteEncontrado.user == req.user.usuario){
                              Usuario.updateOne(ClienteEncontrado,params, {new: true}, (err,ClienteActualizado)=>{
                              if(err) return res.status(500).send({mensaje:'Error general en la peticion'})
                              if(!ClienteActualizado) return res.status(500).send({mensaje: 'Cliente no actualizado, revise los datos'})
                              return res.status(200).send({mensaje: 'Cliente Actualizado'})
                              })
                          }else{
                              return res.status(500).send({mensaje:'Cliente actualizado ya con aterioridad'})
                          }   
                    }
            })
            }
  
 

module.exports={
loginAdmin,
registrarCliente,
loginCliente,
registrarNuevoUsuario,
editarCliente

    }