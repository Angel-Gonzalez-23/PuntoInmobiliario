import  express  from "express";
import { formularioLogin, formularioRegistro, formularioResetpsswd, confirmar, registrar, ressetPassword, comprobarToken, nuevaPswd, autenticar, cerrarSesion } from "../controllers/usuarioController.js";
const router = express.Router();


router.get('/login', formularioLogin )
router.post('/login', autenticar )
//Cerrar sesión
router.post('/cerrar-sesion', cerrarSesion )
router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/confirmar/:token', confirmar)

//nueva contarseña
router.get('/password-reset', formularioResetpsswd)
router.post('/password-reset', ressetPassword)

router.get('/password-reset/:token',comprobarToken)
router.post('/password-reset/:token',nuevaPswd)
export default router;