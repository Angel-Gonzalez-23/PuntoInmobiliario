import {Categoria, Precio, Usuario} from "../models/index.js"
import categorias from "./categorias.js";
import precios from "./precios.js"
import usuarios from "./usuarios.js";
import db from "../config/db.js";


const importarDatos= async()=>{
    try {
        //autenticar en Base de datos
        await db.authenticate()
        //generar columnas
        await db.sync()
        //insertar en Base de Datos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])
        console.log("datos importados correctamente");
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
const eiminarDatos= async()=>{
    try {
        //La diferencia de este codigo con el force, es que en este se usa un truncate y en caso de ser un proyecto grande serian mas lineas.
        // await Promise.all([
        //     Categoria.destroy({where: {}, truncate: true}),
        //     Precio.destroy({where: {}, truncate: true})
        // ])
        await db.sync({force: true})
        console.log("Datos eliminados")
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
//Se leen los argumentos que se tienen en Package.json en "db:importar" y si se encuentra en la posición el argumento "-i, se ejcuta lo siguiente:"
if (process.argv[2]=== "-i"){
    importarDatos();
}
if (process.argv[2] === "-e") {
    eiminarDatos();
}