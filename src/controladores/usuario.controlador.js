'use strict'

const bcrypt  = require('bcrypt-nodejs');
const jwt = require('../servicios/jwt');
const Usuario = require('../modelos/usuario.model');
const Producto = require('../modelos/producto.model');
const { param } = require('../rutas/usuario.rutas');


// Login General

function login(req, res){
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


    
   // Registrarse Como Cliente Nuevo
function registrarCliente(req,res) {
var usuarioModel = new Usuario;
var params = req.body;
var idCliente = req.params.idCliente;


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



    
    // Editar Perfil De Cliente
        function editarCliente(req, res) {
             var params = req.body;
             
             if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje:'Solo clientes pueden modificar sus datos'})
             
            
              Usuario.findByIdAndUpdate(req.user.sub, params, { new: true }, (err, ClienteActualizado)=>{ 
               if(err) return status(500).send({mensaje: 'Error en la peticion'});
               if(!ClienteActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar el cliente'})
  
              return res.status(200).send({ ClienteActualizado });

              } )
            }

    // Eliminar Perfil Para Clientes

   function eliminarCliente(req, res) {
             var params = req.body;
             
             if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje:'Solo clientes pueden borrar su perfil'})
             
             Usuario.findByIdAndDelete(req.user.sub, (err, ClienteEliminado)=>{
                if(err) return res.status(500).send({ mensaje: 'Error en la peticion de Eliminar'});
                if(!ClienteEliminado) return res.status(500).send({mensaje: 'Cliente eliminado con anterioridad'});
           
                return res.status(200).send({ ClienteEliminado});
            })
            }
        


                                            //=== Funciones De Administrador ===\\ 

     /// Agregar Clientes y Administradores -- Unicamente Para Administradores --
    function registrarNuevoUsuario(req,res) {
        var usuarioModel = new Usuario();
        var params = req.body;

        if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden realizar dicha accion'})

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




   //  Modificar Roles  --- Unicamente para Administradores ---  
   function editarRoles(req,res){
   var idUser = req.params.idUser
   var params = req.body

   if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden realizar dicha accion'})
   
   Usuario.findByIdAndUpdate({_id: idUser, rol: 'ROL_CLIENTE'}, {rol: params.rol}, {new: true, useFindAndModify: false}, (err, RolActualizado)=>{
   if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
   if(!RolActualizado) return res.status(500).send({mensaje: 'Usuario no encontrado o es un usuario tipo Administrador'});
   return res.status(500).send({ 'Cliente con nuevo Rol': RolActualizado});
   });

}



   // Editar clientes Logeado como Admin

   function editarUser(req, res) {
   var idUser = req.params.idUser
   var params = req.body;
    
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden realizar dicha accion'})
    
    Usuario.findByIdAndUpdate({_id: idUser, rol: 'ROL_CLIENTE'}, {user: params.user},{new: true, useFindAndModify: false}, (err,ClienteActualizado)=>{
    if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
    if(!ClienteActualizado) return res.status(500).send({mensaje: 'Cliente no encontrado o es un usuario tipo Administrador'});
    return res.status(500).send({'Cliente con Nuevo Nombre': ClienteActualizado});
  
    });
     
   }


   // Eliminar Clientes Logeado como Admin 
   function eliminarUser(req,res){
   var idUser = req.params.idUser;
   var params = req.body;

   if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje: 'Solo Administradores pueden realizar dicha accion'})

   Usuario.findByIdAndDelete({_id: idUser, rol: 'ROL_CLIENTE'}, (err, ClienteEliminado)=>{

   if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
   if(!ClienteEliminado) return res.status(500).send({mensaje: 'Cliente no encontrado o es un usuario tipo Administrador, '});
   return res.status(500).send({'Cliente Eliminado': ClienteEliminado});   
   });

   }

   // Agregar Productos al Carrito
   function agregarAlCarrito(req, res){
    var idUser = req.params.idUser;
    var idProducto = req.params.idProducto;
    var params = req.body;

    if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje: 'Funcion disponible para clientes'})

    if(params.stock){
        Usuario.findOne({'_id': idUser, 'carrito._id':idProducto}, (err, UsuarioEncontrado)=>{
            if(err){
               return res.status(500).send({mensaje:'Error en la peticion.'});
            }else if(UsuarioEncontrado){
                res.send({mensaje:'Producto ya añadido anteriormente.'});
            }else{
                Producto.findOne({'_id':idProducto},(err, ProductoEncontrado)=>{
                    if(err){
                     return   res.status(500).send({mensaje:'Error en la peticion.'});
                    }else if(ProductoEncontrado){
                        if(ProductoEncontrado.stock>=params.stock){
                            ProductoEncontrado.stock = params.stock;
            
                            Usuario.findOneAndUpdate({'_id':idUser},
                            {$push:{carrito:ProductoEncontrado}},{new:true},(err, UsuarioActualizado)=>{
                                if(err){
                                    res.status(500).send({mensaje:'Error en la peticion'});
                                }else {(UsuarioEncontrado)}{
                                    res.send({mensaje:'Producto Añadido a su Carrito.', carrito:UsuarioActualizado.carrito});
                                }
                            });
                            }else{
                                res.send({mensaje:'Error la cantidad supera la existencia de los productos.'});
                            }
                    }else{
                        res.status(404).send({message:'Producto inexistente.'});
                    }
                });

            }
        });
       }else{
        res.send({message:'Ingresa la cantidad del producto que desea.'});
       }
   }



    
module.exports={
login,
registrarCliente,
registrarNuevoUsuario,
editarCliente,
eliminarCliente,
editarUser,
eliminarUser,
editarRoles,
agregarAlCarrito


    }