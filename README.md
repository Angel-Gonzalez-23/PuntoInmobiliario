Proyecto de Bienes Raices con Node JS, Tailwind CSS, Pug y MySQL.

Este proyecto incluye la creación y autenticación de usuarios a través de correo electrónico, además de un perfil de administrador que permite gestionar propiedades en venta, con opciones para crear, editar y eliminar registros. También incorpora el envío y visualización de mensajes dentro de la aplicación, junto con el manejo de sesiones mediante cookies.

Dependencias de desarrollo:
    autoprefixer
    concurrently
    nodemon
    postcss
    postcss-cli
    tailwindcss
    webpack
    webpack-cli

Dependencias: 
    mantine/dropzone
    bcryptjs
    cookie-parser
    csurf
    dotenv
    dropzone
    express
    express-validator
    jsonwebtoken
    multer
    mysql2
    nodemailer
    pug
    sequelize
    tedious

Para su ejecución es necesario tener instalado MySQL con el puerto 3306 (se puede cambiar en las variables de entorno en caso de que este ocupado) e instalar las dependencias con npm i.
Será necesario cambiar las variables de acceso a la Base de Datos en el archivo .env
Conexión a Base de datos:
    Bd_nombre 
    Bd_Usuario
    Bd_Psswd
    Bd_host
Conexión a servidor de correo:
    Email_Host
    Email_Port
    Email_User
    Email_Pass
Variables para uso en envio de correos y creación de JWT
    Backend_URL
    Word_JWT
