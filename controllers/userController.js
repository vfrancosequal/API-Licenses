import Usuario from "../models/User.js";

/**
 * Agrega un nuevo usuario a la base de datos.
 *
 * @async
 * @function
 * @param {Object} req - Objeto de solicitud express.
 * @param {Object} res - Objeto de respuesta express.
 * @throws {Error} Si hay un error al guardar el usuario en la base de datos.
 */
const agregar = async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    const usuarioGuardado = await usuario.save();
    res.json({ body: usuarioGuardado, ok: "SI", msg: "Registro creado correctamente." });
  } catch (error) {
    console.log(error);
  }
}

//Leer
const listar = async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
}
// Eliminar

const eliminar = async (req, res) => {
  //recibir los parametros por la url
  const { id } = req.params;
  //console.log(id);

  //validar si exsite el regsitro
  const usuario = await Usuario.findById(id);
  console.log(usuario);
  if (!usuario) {
    const error = new error("Registro no encontrado");
    return res.status(404).json({ msg: error.message, ok: "SI" });
  }
  try {
    await usuario.deleteOne();
    res.json({ msg: "Registro eliminado correctamente.", ok: "SI" });
  } catch (error) {
    console.log(error);
  }
}

const editar = async (req, res) => {
  //recibir los parametros por la url
  const { id } = req.params;
  //console.log(id);

  //Validar si existe el registro 
  const usuario = await Usuario.findById(id);

  if (!usuario) {
    const error = new error("Registro no encontrado");
    return res.status(404).json({ msg: error.message, ok: "SI" });
  }

  //Capturar los datos del formulario
  usuario.nombreUsuario = req.body.nombreUsuario || usuario.nombreUsuario;
  usuario.celularUsuario = req.body.celularUsuario || usuario.celularUsuario;

  try {
    const usuarioGuardado = await usuario.save();
    res.json({ body: usuarioGuardado, msg: "Registro actualizado correctamente.", ok: "SI" });

  } catch (error) {
    console.log(error);
  }

}

const listarUno = async (req, res) => {
  //recibir los parametros por la url
  const { id } = req.params;

  // validar si existe registro 
  const usuario = await Usuario.findById(id);

  if (!usuario) {
    const error = new error("Registro no encontrado");
    return res.status(404).json({ msg: error.message, ok: "SI" });
  }

  res.json(usuario);


}

export {
  agregar,
  listar,
  eliminar,
  editar,
  listarUno
}