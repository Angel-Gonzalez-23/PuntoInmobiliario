import  express  from "express";
import { formularioLogin, formularioRegistro, formularioResetpsswd, confirmar, registrar, ressetPassword, comprobarToken, nuevaPswd, autenticar } from "../controllers/usuarioController.js";
const router = express.Router();


router.get('/login', formularioLogin )
router.post('/login', autenticar )
router.get('/registro', formularioRegistro)
router.post('/registro', registrar)
router.get('/confirmar/:token', confirmar)
router.get('/password-reset', formularioResetpsswd)
router.post('/password-reset', ressetPassword)
//nueva contarseña
router.get('/password-reset/:token',comprobarToken)
router.post('/password-reset/:token',nuevaPswd)
export default router;