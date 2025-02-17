import  { DataTypes }  from "sequelize";
import db from "../config/db.js"

const Propiedad = db.define('propiedades',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    habitaciones: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estacionamiento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    calle: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    lat: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    lng:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    publicado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, function(require, factory) {
    'use strict';
    
});
export default Propiedad;