import { check, validationResult } from "express-validator"
import Usuario from "../models/Usuario.js"
import { generarId, generarJWT } from "../helpers/tokens.js"
import  bcryptjs from 'bcryptjs';
import jswebt from 'jsonwebtoken'
import { emailRegistro, emailRessetPswd } from "../helpers/emails.js"
import { render } from "pug";

const formularioLogin = async (req, res) => {
    
    res.render('auth/login', {
        pagina: 'Iniciar sesión',
        csrfToken: req.csrfToken()
        
    })
}

const autenticar = async (req, res) => {
    //validación
    await check('email').isEmail().withMessage('Email requerido').run(req)
    await check('password').notEmpty().withMessage('La contraseña debe tener al menos 6 caracteres').run(req)
    let resultado = validationResult(req)
    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
        })
    }
    //Comprobar la existencia del usuario
    const {email, password} = req.body;
    const usuario = await Usuario.findOne({where: {email} })
    if (!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}],
        })
    }
    // comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'tu cuenta no esta confirmada'}]
        })
    }
    //Revisar la contraseña
    if (!usuario.verificarpasswd(password)) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'La contraseña es incorrecta'}],
        })
    }
    //Autenticar usuario 
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre})
    console.log(token)
    //Almacenar token en cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        // secure: true, activar en prod, cuando se tenga certificado ssl
        // sameSite: true
    }).redirect('/mis-propiedades')
}

const cerrarSesion = async(req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}
const formularioRegistro =  (req, res) => {
    res.render('auth/registro.pug', {
        pagina: 'Resgistrarse ahora ',
        csrfToken : req.csrfToken()
    })
}

//Insertar datos a la bd
const registrar = async (req, res) => {
    //Validacion
    await check('nombre').notEmpty().withMessage('El campo nombre no debe de estar vacio').run(req)
    await check('email').isEmail().withMessage('Email no valido').run(req)
    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req)
    await check('password').equals(req.body.repetirpassword).withMessage('Contraseñas no coinciden').run(req)

    let resultado = validationResult(req)
    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
            //Autocompletado
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }
    const {nombre, email, password} = req.body;
    //Validar usuarios duplicados
    const usuarioExiste = await Usuario.findOne( { where: {email }})
    if (usuarioExiste) {
        return res.render('auth/registro',{
            pagina: 'Crear cuenta',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'El correo '+ req.body.email+ ' ya esta registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }
    //Crear usuario
    const usuario = await Usuario.create({
        nombre,
        email, 
        password,
        token: generarId()
    })

    //Enviar confirmaciòn mediante email
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // Mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada satisfactoriamente',
        mensaje: 'Se ha enviado un correo de confirmación a ' +email+ ' presiona en el enlace'
    })
}

//Comprobar cuenta
const confirmar = async (req, res) => {
    const {token }= req.params
    const usuario = await Usuario.findOne({where:{token}});
    console.log(usuario)
    if (!usuario) {
        return res.render('auth/confirmar-cuenta',{
            pagina:'Error al realizar la confirmación de su cuenta',    
            mensaje: 'Uppss... al parecer hubo un error al confirmar su cuenta, intente nuevamente por favor.',
            error: true
        })
    }
    console.log(usuario)
    //Confirmar cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save()
    res.render('auth/confirmar-cuenta',{
        pagina:'Cuenta confirmada',    
        mensaje: 'La cuenta ha sido confirmada correctamente'
    })
}

const formularioResetpsswd =  (req, res) => {
    res.render('auth/psswdReset', {
        pagina: 'Olvide mi contraseña',
        csrfToken : req.csrfToken()
    })
}
const ressetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('Email no valido').run(req)
    let resultado = validationResult(req)
    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        //Mostrar Errores
        return res.render('auth/psswdReset', {
            pagina: 'Recupera el acceso a tu cuenta',
            csrfToken : req.csrfToken(),
            errores : resultado.array()  
        })
    }
    //Buscar usuario
    const email = req.body.email;
    const usuario = await Usuario.findOne({where: {email}})
    console.log(usuario)    
    if (!usuario) {
        return res.render('auth/psswdReset', {
            pagina: 'Recupera el acceso a tu cuenta',
            csrfToken : req.csrfToken(),
            errores : [{msg:"Email no registrado"}]
        })
    }
    //Generar token y mandar Email
    usuario.token = generarId();
    await usuario.save();
    //Enviar Email
    emailRessetPswd({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })
    //Renderizar email
    res.render('templates/mensaje', {
        pagina: 'Restablece tu contraseña',
        mensaje: "Se ha enviado un Email para el restablecimiento de su contraseña"
    })
}
    
    const comprobarToken = async (req, res) => {
        const {token} = req.params;
        const usuario = await Usuario.findOne({ where: { token}});
        console.log
        if (!usuario) {
            return res.render('auth/confirmar-cuenta',{
                pagina:'Restablecer contarseña',    
                mensaje: 'Uppss... al parecer hubo un error al confirmar su informarcion, intente nuevamente por favor.',
                error: true
            })
        }
        //Mostraer formulario para modificar cntraseña
        res.render('auth/reset-password', {
            pagina: 'Modifica tu contraseña',
            csrfToken: req.csrfToken()
        })
    }
    
    const nuevaPswd = async (req, res) => {
        //Validar contraseña
        await check('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req)
        let resultado = validationResult(req);
        if (!resultado.isEmpty()) {
            return res.render('auth/reset-password', {
                pagina: 'Restablecer contraseña',
                csrfToken : req.csrfToken(),
                errores: resultado.array(),
            })
        }
        //Identificar quien es el usuario
        const { token } = req.params;
        const {password} = req.body;
        const usuario = await  Usuario.findOne({where: {token}})
        //HAshear
        const salt = 10
        usuario.password = await bcryptjs.hash(password, salt);
        //matar yoken
        usuario.token = null;
        await usuario.save();
        res.render('auth/confirmar-cuenta',{
            pagina: 'Contarseña restablecida',
            mensaje: 'La nueva contraseña se guardo correctamente'
        })
    }
export {
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    formularioResetpsswd,
    ressetPassword,
    confirmar,
    registrar,
    comprobarToken,
    nuevaPswd
}

// Se esta usando bcryptjs
// https://masteringjs.io/tutorials/node/bcrypt#:~:text=bcrypt's%20hash()%20function%20is,passwords%20harder%20to%20brute%20force.