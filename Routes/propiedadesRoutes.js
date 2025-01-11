import  express  from "express";
import {body} from 'express-validator'
import {admin, crear, guardar, agregarImagen, guardarImagen, editar, guardarCambios, eliminar} from '../controllers/propiedadesController.js'
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";

const router =  express.Router()

router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta, crear)
router.post('/propiedades/crear', protegerRuta,
    body('titulo').notEmpty().withMessage('El campo Titulo no puede ser vacio'),
    body('descripcion').notEmpty().withMessage('El campo Descripcion no puede ser vacio').isLength({Max: 40}).withMessage("Descripción debe tener maximo 40 caracteres"),
    body('categoria').isNumeric().withMessage("Seleccione una Categoria"),
    body("precio").isNumeric().withMessage("Seleccione un rango de Precio"),
    body("habitaciones").isNumeric().withMessage("Selecciones la cantidad de Habitaciones"),
    body("estacionamiento").isNumeric().withMessage("Seleccione la cantidad de Estacionamientos"),
    body("wc").isNumeric().withMessage("Seleccione la cantidad de Baños"),
    body("lat").notEmpty().withMessage("Posiciona la uicación en el Mapa"),
    guardar
)
router.get('/propiedades/agregar-imagen/:id',protegerRuta, agregarImagen)
router.post('/propiedades/agregar-imagen/:id', protegerRuta,
    upload.single('imagen'),
    guardarImagen
)
router.get('/propiedades/editar/:id', protegerRuta, editar)
router.post('/propiedades/editar/:id', protegerRuta,
    body('titulo').notEmpty().withMessage('El campo Titulo no puede ser vacio'),
    body('descripcion').notEmpty().withMessage('El campo Descripcion no puede ser vacio').isLength({Max: 40}).withMessage("Descripción debe tener maximo 40 caracteres"),
    body('categoria').isNumeric().withMessage("Seleccione una Categoria"),
    body("precio").isNumeric().withMessage("Seleccione un rango de Precio"),
    body("habitaciones").isNumeric().withMessage("Selecciones la cantidad de Habitaciones"),
    body("estacionamiento").isNumeric().withMessage("Seleccione la cantidad de Estacionamientos"),
    body("wc").isNumeric().withMessage("Seleccione la cantidad de Baños"),
    body("lat").notEmpty().withMessage("Posiciona la uicación en el Mapa"),
    guardarCambios
 )
 router.post('/propiedades/eliminar/:id', protegerRuta, eliminar)

export default router;
