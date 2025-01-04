import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./Routes/usuarioRoute.js";
import propiedadesRoutes from "./Routes/propiedadesRoutes.js";
import db from './config/db.js'

//Crear el app
const app = express()

//Habilitar lectura de datos de formulario
app.use(express.urlencoded({extended: true}))

//Habilidar cookieparser
app.use(cookieParser())
//Habilitar csrf
app.use(csrf({cookie:true}))

//Conexión a la Bd
try {
    await db.authenticate();
    db.sync()
    console.log('Conexion a la bd');
} catch (error) {
    console.log(error)
}


//habilitar pug
app.set('view engine', 'pug')
//indicar ubicacion de las views
app.set('views', './views')
//Carpeta publica
app.use( express.static('public'))

//Routing
app.use('/auth', usuarioRoutes);
app.use('/', propiedadesRoutes)

//Definir puerto y arrancar el proyecto
const port = process.env.port || 3000

app.listen(port, () => {
    console.log('Aplicacion corriendo en puerto', port)
})