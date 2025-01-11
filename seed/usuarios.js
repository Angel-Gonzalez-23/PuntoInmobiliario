import  bcryptjs from 'bcryptjs';
const usuarios = [
    {
       nombre: "Angel Enrique Cruz Gonzalez",
       email: "ac61887@gmail.com",
       confirmado: 1,
       password:  bcryptjs.hashSync('Ian2018-21', 10)
    }
]
export default usuarios;