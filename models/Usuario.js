import  { DataTypes }  from "sequelize";
import  bcryptjs from 'bcryptjs';
import db from "../config/db.js"

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
}, { // Hashear psswd
    hooks: {
        beforeCreate: async  function(usuario){
            const salt = 10
            usuario.password = await bcryptjs.hash(usuario.password, salt);
        }
    },
    scopes:{
        ocultarDatos:{
            attributes:{ 
                exclude: ['password', 'token', 'confirmado', 'createdAt','updatedAt']
            }
        }
    }
})

//Metodo personalizado
Usuario.prototype.verificarpasswd = function (password) {
    return bcryptjs.compareSync(password, this.password);
}

export default Usuario;