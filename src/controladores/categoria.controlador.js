'use strict'
const Categoria = require('../modelos/categoria.model');
const { param } = require('../rutas/usuario.rutas'); // DUDA

 

                  //=== Funciones De Administrador ===\\ 

// Nueva Categoria
function registrarCategoria(req,res) {
    var categoria = new Categoria;
    var params = req.body;
    
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden registrar Categorias'})
    
    if(params.nombreCategoria){
        Categoria.findOne({nombre:params.nombreCategoria},(err, categoriaEncontrada)=>{
            if(err){
                return  res.status(500).send({mensaje:'Error en la petición'});
            }else if(categoriaEncontrada){
                return  res.send({mensaje:'Categoria ya existente'});
            }else{
                categoria.nombreCategoria = params.nombreCategoria;

                categoria.save((err, CategoriaGuardada)=>{
                    if(err){
                        return  res.status(500).send({mensaje:'Error al guardar categoria.'});
                    }else if(CategoriaGuardada){
                        return  res.send({CategoriaGuardada});
                    }else{
                        return   res.status(404).send({mensaje:'Categoria no guardada.'});
                    }
                });
            }
        });
    }else{
        return res.send({mensaje:'Por favor ingrese un nombre para la categoria.'});
    }
}

// Editar Categorias

function editarCategoria(req, res){
    var idCategoria = req.params.idCategoria;
    var params = req.body;

    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden editart Categorias'})


    Categoria.findOne({'_id':idCategoria, nombreCategoria:'default'}, (err, CategoriaEncontrada)=>{
    if(err){
        return   res.status(500).send({mensaje:'Error en la petición'});
        }else if(CategoriaEncontrada){
            return res.send({mensaje:'No puede actualizar la categoria por default.'});
        }else{
        Categoria.findOne({'_id':idCategoria}, (err, CategoriaEncontrada)=>{
            if(err){
                return  res.status(500).send({mensaje:'Error en la peticion'});
            }else if(CategoriaEncontrada){
                    var nombreCategoria;

                    if(!params.nombreCategoria){
                        nombreCategoria = '';
                    }else if(params.nombreCategoria){
                        if(params.nombreCategoria == CategoriaEncontrada.nombreCategoria){
                            nombreCategoria = '';
                        }else if(params.nombreCategoria == 'default'){
                            return res.send({mensaje:'No puede utilizar default como  nombre de Una Categoria.'});
                        }else{
                            nombreCategoria = params.nombreCategoria;
                        }
                    }

                    if(params.productos){
                        return res.send({mensaje:'Error en actualizar los productos de la categoria'});
                    }

                    Categoria.findOne({$or:[{'nombreCategoria':nombreCategoria}]},(err, CategoriaEncontrada)=>{
                        if(err){
                          return  res.status(500).send({mensaje:'Error en la peticion.'});
                        }else if(CategoriaEncontrada){
                            return  res.send({mensaje:'Nombre de categoria ya utilizado.'});
                        }else{
                            Categoria.findByIdAndUpdate(idCategoria, params, {new:true}, (err, CategoriaActualizada)=>{
                                if(err){
                                    return  res.status(500).send({mensaje:'Error en la peticion'});
                                }else if(CategoriaActualizada){
                                    return res.send({CategoriaActualizada});
                                }else{
                                    return  res.status(404).send({mensaje: 'Error categoria no actualizada.'});
                                }
                            });
                        }
                    });
            }else{
                return res.status(404).send({mensaje:'Categoria inexistente.'});
            }
        });
        }
    });
}


function listarCategorias(req,res) {
    var idCategoria = req.user.sub;
  
    Categoria.find().populate('Productos','nombreProducto').exec((er, CategoriasEncontrados)=>{
       if(er) return res.status(500).send({mensaje: 'Error al listar Productos Encontrados'});
       if(!CategoriasEncontrados) return res.status(500).send({mensaje: 'Erro al obtener Productos'});
       return res.status(200).send({CategoriasEncontrados});
    })
 
}



// Eliminar Categoria 
/* function eliminarCategoria(req, res){
    var idCategoria = req.params.idCategoria;
    
    Categoria.findOne({'_id':idCategoria, nombre:'default'}, (err, CategoriaEncontrada)=>{
        if(err){
            return   res.status(500).send({mensaje:'Error en la petición'});        
        }else if(CategoriaEncontrada){
            return   res.status(500).send({mensaje:'No puede eliminar la categoria por defecto.'});
        }else{
          Categoria.findByIdAndRemove(idCategoria, (err, CategoriaEliminada)=>{
              if(err){
                                      return  res.status(500).send({mensaje: 'Error en la peticionBB'});
                    }else if(CategoriaEliminada){
                        
                        Categoria.findByIdAndUpdate({nombre:'default'}, {$push:{productos:CategoriaEliminada.productos}}, (err, CategoriaEncontrada)=>{
                            if(err){
                                return console.log(err)
                                 res.status(500).send({mensaje:'Error en la peticionAA'});
                            }else if(CategoriaEncontrada){
                                return res.send({CategoriaEncontrada});
                            }else{
                                return  res.status(404).send({mensaje: 'Error categoria no Eliminada.'});
                            }
                        });
                    }else{
                        return   res.status(404).send({mensaje: 'Categoria inexistente.'});  
                    }
                });
        }
    });
}
  
 */



module.exports={
    registrarCategoria,
    editarCategoria,
    listarCategorias
  //  eliminarCategoria
}
