import jwebt from 'jsonwebtoken'
const generarJWT = datos => jwebt.sign({id: datos.id, nombre: datos.nombre}, process.env.Word_JWT,{expiresIn: '1d'})
// Genera el tokenID
const generarId = () => Date.now().toString(32) + Math.random().toString(32).substring(2);

export{
    generarId,
    generarJWT
}