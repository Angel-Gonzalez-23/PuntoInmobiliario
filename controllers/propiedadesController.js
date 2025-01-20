import {Precio, Categoria, Propiedad, Mensaje, Usuario } from '../models/index.js'
import {validationResult} from 'express-validator'
import{unlink} from 'node:fs/promises'
import { esVendedor, formatearFecha } from '../helpers/index.js';

const admin = async (req, res) => {
    //Paginador Querystring
    const {pagina: paginaActual}= req.query;
    const expresionRegular = /^[1-9]$/
    if (!expresionRegular.test(paginaActual)) {
        return res.redirect('/mis-propiedades?pagina=1')
    }

    try {
            //Extraer el id del usuario autenticado
        const {id} = req.usuario
        //limimtes  offser para el paginador
        const limit = 10;
        const offset = ((paginaActual * limit)-limit)


        const [propiedades, total] = await Promise.all([
                Propiedad.findAll({
                    limit,
                    offset,
                    where: {
                        usuarioId: id
                    },
                    include: [{
                        model: Categoria, as: 'categoria',
                    },
                    {
                        model: Precio, as: 'precio'
                    },
                    {
                        model: Mensaje, as: 'mensajes'
                    }
                ], 
                }),
                Propiedad.count({
                    where: {
                        usuarioId: id
                    }
                })
        ]);
        res.render('propiedades/admin',{
            pagina: 'Mis propiedades',
            propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit
        });
    } catch (error) {
        console.log(error)
    }

};


    //Formulario para crear propiedades
    const crear = async ( req, res) => {
        //Consultar datos de la BD
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos : {}
    });   
    };


    const guardar = async(req, res) => {
            //resultado de validación
        let resultado =  validationResult(req)
        if (!resultado.isEmpty()) {
            //Consultar datos de la BD
            const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
            ]);
            
                return res.render('propiedades/crear',{
                    pagina: 'Crear propiedad',
                    csrfToken: req.csrfToken(),
                    categorias,
                    precios,
                    errores: resultado.array(),
                    datos: req.body
            });
        };
        //Crear registro / G = Guardada ejemplo: propiedadG significa es el valor que se almacenará en BD lat: 20.4554, lng: -97.737, calle: Calle Miguel Alemán
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body;
        const { id: usuarioId } = req.usuario

        try {   
            const propiedadG = await Propiedad.create({
                titulo,
                descripcion,
                habitaciones,
                estacionamiento, 
                wc, 
                calle,
                lat, 
                lng, 
                precioId, 
                categoriaId, 
                usuarioId,
                imagen: ''
            });
            const {id} = propiedadG
            res.redirect(`/propiedades/agregar-imagen/${id}`)
        } catch (error) {
            console.log(error);
        }
    };


    const agregarImagen = async (req, res) => {
        const {id} = req.params

        //Validar existencia de propiedad
        const propiedad = await Propiedad.findByPk(id)

        if(!propiedad){
            return res.redirect('/mis-propiedades')
        }

        //Validar si la propiedad ya fue publicada
        if(propiedad.publicado){
            return res.redirect('/mis-propiedades')
        }

        //Validar propiedad pertenece al visitante de la pagina
        if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
            return res.redirect('/mis-propiedades')
        }
        res.render('propiedades/agregar-imagen', {
            pagina: `Agregar imagen de ${propiedad.titulo}`,
            csrfToken: req.csrfToken(),
            propiedad
        })
    }


    const guardarImagen = async (req, res, next) => {
        const {id} = req.params

        //Validar existencia de propiedad
        const propiedad = await Propiedad.findByPk(id)

        if(!propiedad){
            return res.redirect('/mis-propiedades')
        }

        //Validar si la propiedad ya fue publicada
        if(propiedad.publicado){
            return res.redirect('/mis-propiedades')
        }

        try {
            //Almacenar imagen y publicar la propiedad 
            // Crear un array de nombres de archivos
            // const filenames = req.files.map(file => file.filename);
            // console.log('filesnames:',filenames); 
            // Guardar los nombres de los archivos y marcar la propiedad como publicada
            // console.log(filenames.toString())
            // propiedad.imagen = filenames.toString()
            propiedad.imagen = req.file.filename
            propiedad.publicado = 1;
            await propiedad.save();
            next();

        } catch (error) {
            console.log(error);
        }
    };


    const editar = async (req, res) => {
        const {id} = req.params
        const propiedad = await Propiedad.findByPk(id);

        if (!propiedad) {
            console.log('no existe propiedad')
            return res.redirect('/mis-propiedades')
        }

        //validar que el visitante de la url es el creador de la propiedad
        if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
            console.log('no creaste esta propiedad')
            return res.redirect('/mis-propiedades')
        }
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);
        
        res.render('propiedades/editar', {
            pagina: 'Editar propiedad: '+ propiedad.titulo,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            datos : propiedad
        });   
    };


    const guardarCambios = async(req, res) =>{
        //verificar la validación
        let resultado =  validationResult(req)
        if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
        ]);
            return res.render('propiedades/editar',{
                pagina: 'Editar propiedad ',
                csrfToken: req.csrfToken(),
                categorias,
                precios,
                errores: resultado.array(),
                datos: req.body
        });
        };

        const {id} = req.params
        const propiedad = await Propiedad.findByPk(id);

        if (!propiedad) {
            console.log('no existe propiedad')
            return res.redirect('/mis-propiedades')
        }

        // reescribir el objeto y actualizar en BD
        try {
            const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body;
            propiedad.set({
                titulo,
                descripcion,
                habitaciones,
                estacionamiento,
                wc,
                calle,
                lat,
                lng,
                precioId,
                categoriaId,
            });
            await propiedad.save()

            res.redirect('/mis-propiedades')
        } catch (error) {
            console.log(error)
        }
    };


    const eliminar = async(req, res) =>{
        const {id} = req.params
        const propiedad = await Propiedad.findByPk(id);

        if (!propiedad) {
            console.log('no existe propiedad')
            return res.redirect('/mis-propiedades')
        }

        //validar que el visitante de la url es el creador de la propiedad
        if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
            console.log('no creaste esta propiedad')
            return res.redirect('/mis-propiedades')
        }
        //eliminar imagen del servidor
        await unlink(`public/uploads/${propiedad.imagen}`)
        //Eliminar registro de la DB
        await propiedad.destroy();  
        res.redirect('/mis-propiedades')
    };


        //Cambiar estado de una propiedad
    const cambiarEstado = async(req, res) => {
        const {id} = req.params
        const propiedad = await Propiedad.findByPk(id);

        if (!propiedad) {
            console.log('no existe propiedad')
            return res.redirect('/mis-propiedades')
        }
        //Actualizar estado
        propiedad.publicado = !propiedad.publicado
        
        await propiedad.save()
        res.json({
            resultado: true
        })
    }

    const mostrarPropiedad = async(req, res) => {
        const {id} = req.params;
        console.log(req.usuario)
        //compreoar que la propiedad exista
        const propiedad = await Propiedad.findByPk(id,
            {
            include: [{
                model: Categoria, as: 'categoria',
            },
            {
                model: Precio, as: 'precio'
            }
        ], 
        })
        if(!propiedad || !propiedad.publicado){
            return res.redirect('/404')
        }
        res.render('propiedades/mostrar',{
            propiedad,
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
            
        })
    }


    const enviarMensaje = async (req, res) => {
        const {id} = req.params;
        const propiedad = await Propiedad.findByPk(id,
            {
            include: [{
                model: Categoria, as: 'categoria',
            },
            {
                model: Precio, as: 'precio'
            }
        ], 
        })

        if(!propiedad){
            return res.redirect('/404')
        }
        //Renderizar Errores
        const resultado =  validationResult(req)
        
        if (!resultado.isEmpty()) {
            return res.render('propiedades/mostrar',{
                propiedad,
                pagina: propiedad.titulo,
                csrfToken: req.csrfToken(),
                usuario: req.usuario,
                esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
                errores: resultado.array()
            })
        };

        const mensaje = req.body.mensaje;
        const { id: propiedadId }  = req.params;
        const { id: usuarioId} = req.usuario

        await Mensaje.create({
            mensaje,
            propiedadId,
            usuarioId
        })
        res.redirect('/')
    }

        
    //Ver mensajes recibidos
    const verMensajes = async(req, res) => {
        const {id} = req.params
        const propiedad = await Propiedad.findByPk(id, {
                include: [
                {
                    model: Mensaje, as: 'mensajes', 
                        include:[ {model: Usuario.scope('ocultarDatos'), as: 'usuario'}]
                }
        ], }
        );
        //Validar que la propiedad exista
        if (!propiedad) {
            console.log('no existe propiedad')
            return res.redirect('/mis-propiedades')
        }

        //validar que el visitante de la url es el creador de la propiedad
        if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
            console.log('no creaste esta propiedad')
            return res.redirect('/mis-propiedades')
        }
        res.render('propiedades/mensajes',{
            pagina: 'Mensjaes recibidos de '+propiedad.titulo,
            mensajes: propiedad.mensajes,
            formatearFecha
        })
    }

export { admin, crear, guardar,agregarImagen ,guardarImagen, editar, guardarCambios, eliminar, cambiarEstado, mostrarPropiedad, enviarMensaje, verMensajes}