import jwebt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'
const protegerRuta = async (req, res, next) => {
    //Verificar si existe un token
    const {_token} = req.cookies
    if(!_token){
        return res.redirect('/auth/login')
    }
    //Comprobar Token await Usuario.scope('eliminarPassword').findByPk(decoded.id)
    try {
        const decoded = jwebt.verify(_token, process.env.Word_JWT)
        const usuario =  await Usuario.scope('ocultarDatos').findByPk(decoded.id)
        //almacenar usuario en req
        if(usuario){
            req.usuario = usuario
        }else{
            return res.redirect('/auth/login')
        }
        return next();
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }
}

export default protegerRuta;