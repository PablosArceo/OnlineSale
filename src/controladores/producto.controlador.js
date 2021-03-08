'use strict'
const Producto = require('../modelos/producto.model');
var Categoria = require('../modelos/categoria.model');



function registrarProducto(req, res){
    var producto = new Producto();
    var params = req.body;
    var idCategoria = req.params.idCategoria;
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden registrar Categorias'})

    
    if(params.nombreProducto && params.stock && params.precio){
        Producto.findOne({'nombre': params.nombre}, (err, ProductoEncontrado)=>{
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
                            res.send({message:'El precio unitario y la cantidad deben ser positivos.'});
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

function listaProductos(req, res){
    Producto.find({}, (err, productos)=>{
        if(err){
            res.status(500).send({mensaje: 'Error general'});
        }else if(productos){
            if(productos.length>0){
                res.send({productos:productos});
            }else{
                res.send({message:'No se encontraron productos.'});
            }
        }else{
            res.status(404).send({message: 'No se encontraron productos.'});
        }
	});
}



module.exports={
registrarProducto,
listaProductos
}