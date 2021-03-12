'use strict'
const Categoria = require('../modelos/categoria.model');

 

                  //=== Funciones De Administrador ===\\ 

// Nueva Categoria
function registrarCategoria(req,res) {
    var categoria = new Categoria;
    var params = req.body;
    
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden registrar Categorias'})
    
    if(params.nombreCategoria){
        Categoria.findOne({nombreCategoria:params.nombreCategoria},(err, categoriaEncontrada)=>{
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

    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden editar Categorias'})
    
       
       delete params.password;
    
        Categoria.findByIdAndUpdate(idCategoria, params, { new: true }, (err, CategoriaActualizada)=>{ 
        if(err) return status(500).send({mensaje: 'Error en la peticion'});
        if(!CategoriaActualizada) return res.status(500).send({ mensaje: 'No se ha podido actualizar la categoria'})
      
        return res.status(200).send({ CategoriaActualizada });
    
        } )
    }
    

// Listar Categorias
function listarCategorias(req,res) {

    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden listar Categorias'})

  
    Categoria.find().exec((er, CategoriasEncontradas)=>{
       if(er) return res.status(500).send({mensaje: 'Error al listar categorias Encontradas'});
       if(!CategoriasEncontradas) return res.status(500).send({mensaje: 'Error al obtener categorias'});
       return res.status(200).send({CategoriasEncontradas});
    })
 
}
// Listar Categorias Por Id
 
function listaCategoriaId(req, res){

    var idCategoria = req.params.idCategoria;
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden lista Categorias por Id'})

    Categoria.find({ '_id': idCategoria}, (err, CategoriaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "Error" });
        if (!CategoriaEncontrada) return res.status(500).send({ mensaje: "Error en la busqueda de Id" });
        return res.status(200).send({ CategoriaEncontrada });
    })
}

// Eliminar Categorias
function eliminarCategoria(req, res){
    var idCategoria = req.params.idCategoria;
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden eliminar categorias'})

         
    Categoria.findOne({'_id':idCategoria, nombreCategoria:'default'}, (err, categoriaEncontrada)=>{
    if(err){
    return res.status(500).send({mensaje: 'Error al encontrar categoria'});
        }else if(categoriaEncontrada){
            res.send({mensaje:'No puede eliminar la categoria por defecto.'});
        }else{
        Categoria.findByIdAndRemove(idCategoria, (err, categoriaEliminada)=>{
            if(err){
            res.status(500).send({mensaje: 'Error general'});
             }else if(categoriaEliminada){
             Categoria.findOneAndUpdate({nombreCategoria:'default'}, {$push:{productos:categoriaEliminada.productos}},{new:true},(err, categoriaEncontrada)=>{
                if(err){
                   res.status(500).send({mensaje: 'Error general'});
                    }else if(categoriaEncontrada){
                    res.send({categoriaEliminada:categoriaEliminada});
                    }else{
                    res.status(404).send({mensaje: 'Error categoria no encontrada.'});
                            }
                        });
                    }else{
                        res.status(404).send({mensaje: 'Categoria inexistente.'});  
                    }
                });
        }
    });
}
function listaNombreCategorias(req, res){
    var nombreCategoria = req.params.nombreCategoria;
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden listasr Categorias por nombre'})
    Categoria.find({ 'nombreCategoria': nombreCategoria}, (err, CategoriaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion" });
        if (!CategoriaEncontrada) return res.status(500).send({ mensaje: "Error en la busqueda de nombre" });
        return res.status(200).send({ CategoriaEncontrada });
    })
}


module.exports={
    registrarCategoria,
    editarCategoria,
    listarCategorias,
    listaCategoriaId,
    eliminarCategoria,
    listaNombreCategorias
}
