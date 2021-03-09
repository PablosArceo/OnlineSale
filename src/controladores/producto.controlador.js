'use strict'
const Producto = require('../modelos/producto.model');
var Categoria = require('../modelos/categoria.model');

                  //=== Funciones De Administrador ===\\ 


// Registrar Nuevo Producto
function registrarProducto(req, res){
    var producto = new Producto();
    var params = req.body;
    var idCategoria = req.params.idCategoria;
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden registrar Categorias'})

    
    if(params.nombreProducto && params.stock && params.precio){
        Producto.findOne({'nombreProducto': params.nombreProducto}, (err, ProductoEncontrado)=>{
            if(err){
               return res.status(500).send({mensaje:'Error en la peticion.'});
            }else if(ProductoEncontrado){
              return  res.status(500).send({mensaje:'Nombre de producto ya utilizado.'});
            }else{
                Categoria.findOne({'_id':idCategoria},(err, CategoriaEncontrada)=>{
                    if(err){
                        res.status(500).send({message:'Error en la peticion.'});
                    }else if(CategoriaEncontrada){

                        if(params.stock>=0 && params.precio>0){
                            producto.nombreProducto = params.nombreProducto;
                            producto.stock = params.stock;
                            producto.precio = params.precio;
                            producto.ventas = 0;
            
                            producto.save((err, ProductoGuardado)=>{
                                if(err){
                                    res.status(500).send({mensaje:'Error en la peticion al guardar producto.'});
                                }else if(ProductoGuardado){
                                    
                                    Categoria.findByIdAndUpdate(idCategoria,{$push:{productos:producto._id}},
                                        {new:true},(err, CategoriaActualizada)=>{
                                            if(err){
                                                res.status(500).send({message:'Error en la peticion al guardar producto.'});
                                            }else if(CategoriaActualizada){
                                                res.send({'Producto Agregado':ProductoGuardado});
                                            }else{
                                                res.status(404).send({message:'Producto no guardado.'});
                                            }
                                        });
                                }else{
                                    res.status(404).send({message:'Producto no guardado.'});
                                }
                            });
                        }else{
                            res.send({message:'El precio debe ser positivo .'});
                        }
                    }else{
                        res.status(404).send({message:'Categoria no encontrada.'});
                    }
                });
            }
        });
    }else{
        res.send({message:'Ingresa todos los datos.'});
    }

}


// Editar Productos
function editarProducto(req, res){
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden registrar Categorias'})

    var idProducto = req.params.idProducto;
    var params = req.body;

   delete params.password;

    Producto.findByIdAndUpdate(idProducto, params, { new: true }, (err, ProductoActualizado)=>{ 
    if(err) return status(500).send({mensaje: 'Error en la peticion'});
    if(!ProductoActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar el producto'})
  
    return res.status(200).send({ ProductoActualizado });

    } )
}



// Lista los Productos
function listaProductos(req,res) {
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden listar Productos'})

    Producto.find().exec((er, ProductosEncontrados)=>{
       if(er) return res.status(500).send({mensaje: 'Error al listar Productos Encontrados'});
       if(!ProductosEncontrados) return res.status(500).send({mensaje: 'Erro al obtener Productos'});
       return res.status(200).send({ProductosEncontrados});
    })
}

// Lista Por ID de Productos
function listaProductosId(req, res){

    var idProducto = req.params.idProducto;
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden listar Productos por Nombre'})

    Producto.find({ '_id': idProducto}, (err, ProductoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion" });
        if (!ProductoEncontrado) return res.status(500).send({ mensaje: "Error en la busqueda de Id de Productos" });
        return res.status(200).send({ ProductoEncontrado });
    })
}

// Lista Por Nombre de Productos
function listaNombreProducto(req, res){
    var nombreProducto = req.params.nombreProducto;

    Producto.find({ 'nombreProducto': nombreProducto}, (err, ProductoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion" });
        if (!ProductoEncontrado) return res.status(500).send({ mensaje: "Error en la busqueda de nombre" });
        return res.status(200).send({ ProductoEncontrado });
    })
}


function listaNombreCategorias(req, res){
    var nombreCategoria = req.params.nombreCategoria;

    Categoria.find({ 'nombreCategoria': nombreCategoria}, (err, CategoriaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion" });
        if (!CategoriaEncontrada) return res.status(500).send({ mensaje: "Error en la busqueda de nombre" });
        return res.status(200).send({ CategoriaEncontrada });
    })
}



// Eliminar Producto
function eliminarProducto(req, res){
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden eliminar Categorias'})

    var id = req.params.id;

    Producto.findByIdAndRemove(id, (err, ProductoEliminado)=>{
        
        if(err){
            
            res.status(500).send({mensaje: 'Error en la peticion'});
        }else if(ProductoEliminado){
            Categoria.findOneAndUpdate({'productos':id}, {$pull:{productos:id}},{new:true},(err, CategoriaActualizada)=>{
                if(err){
                    res.status(500).send({mensaje: 'Error en la peticion'});
                }else if(CategoriaActualizada){
                    res.send({mensaje:'Producto eliminado.', producto:ProductoEliminado});
                
                }else{
                    res.send({mensaje:'No se elimino el producto.'});
                }
            });
        }else{
            res.status(404).send({mensaje: 'Producto Ya eliminado.'});  
            
        }
    });
}

// Productos agotados.
function productosAgotados(req,res){
    Producto.find({ stock: 0}, (err,ProductosEncontrados)=>{
        if(err){
          return  res.status(500).send({mensaje : 'Error en la peticion'});
        } else if (ProductosEncontrados){
            
            if(ProductosEncontrados.length > 0){
                return res.send({mensaje:'Productos agotados','productos': ProductosEncontrados});
            } else {
                res.send({mensaje : 'Por el momento no hay productos agotados.'});
            }
        } else {
            return res.status(404).send({mensaje : 'Error no hay productos que mostrar.'});
        }   
    })
}

// Productos Más vendidos
function productosMasDemanda(req,res){

    Producto.find({ventas: {$gt: 0}},(err,ProductosMasVendidos)=>{
        if(err){
            res.status(500).send({mensaje : 'Error general en el servidor'});
        } else if (ProductosMasVendidos){
            res.send({ProductosMasVendidos});
        } else {
            res.status(404).send({ mensaje : 'No hay productos que mostrar.'});
        }
    }).sort({ventas:-1}).limit(10);
}





module.exports={
registrarProducto,
listaProductos,
listaProductosId,
editarProducto,
eliminarProducto,
listaNombreProducto,
productosAgotados,
productosMasDemanda,
listaNombreCategorias

}