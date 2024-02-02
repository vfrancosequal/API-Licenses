import mongoose from 'mongoose';
import mongodb from 'mongodb';

const conectarDB = () => {
  const urlConexion = String(process.env.MONGO_URI);

  mongoose.connect(urlConexion) 
    .then((con) => {
      console.log(`Conexion establecida con la base de datos: ${urlConexion}`);
    })
    .catch((error) => {
      console.log(error);
    });
};
export default conectarDB;
