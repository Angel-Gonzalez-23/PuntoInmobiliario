import Propiedad from "./Propiedad.js"
import Precio from "./Precio.js"
import Categoria from "./Categoria.js"
import Usuario from "./Usuario.js"

//relacionaes
// Precio.hasOne(Propiedad) Hace lo mismo que belongsto pero se lee mas natural
Propiedad.belongsTo(Precio, { foreingkey: "precioId"})
Propiedad.belongsTo(Categoria, {foreingkey: "categoriaId"})
Propiedad.belongsTo(Usuario, {foreingkey: "usuarioId"})

export{
    Propiedad,
    Precio,
    Categoria,
    Usuario
}