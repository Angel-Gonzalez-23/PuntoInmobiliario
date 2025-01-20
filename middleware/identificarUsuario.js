import jwebt from 'jsonwebtoken'
import  Usuario from '../models/Usuario.js'

const identificarUsuario = async (req, res, next) => {
    //Identificar si hay un token en las cookies
    const {_token} = req.cookies
    if(!_token){
        req.usuario = null
        console.log('identificrus: '+req.usuario)
        return next()   
    }
    //Comprobar Token
    try {
        const decoded = jwebt.verify(_token, process.env.Word_JWT)
        const usuario =  await Usuario.scope('ocultarDatos').findByPk(decoded.id)
        //almacenar usuario en req
        if(usuario){
            req.usuario = usuario
        }
        return next()
    } catch (error) {
        console.log(error)
        return res.clearCookie('_token').redirect('/auth/login')
    }
}

export default identificarUsuario