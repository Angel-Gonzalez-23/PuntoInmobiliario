import  Sequelize from "sequelize";
import dotenv from 'dotenv';

dotenv.config({path: '.env'})

const db = new Sequelize(process.env.Bd_nombre, process.env.Bd_Usuario, process.env.Bd_Psswd ?? '' ,{
    host: process.env.Bd_host,
    port: 3306,
    dialect: 'mysql',
    timezone: 'America/Mexico_City',
    define:{
        timestamps: true
    },
    pool:{
        // maximo de conexiones
        max: 5, 
        // minimo de conexiones  
        min: 0,
        // tiempo antes de marcar un error
        acquire:30000,
        // tiempo transucrido para matar una conexion
        idle:10000
    },
})
export default db;