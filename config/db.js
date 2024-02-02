import mongoose from 'mongoose';
import mongodb from 'mongodb';

const conectarDB = () => {
  const urlConexion = String(process.env.MONGO_URI || "mongodb://Sbot_dllo:RmqSfk8admQ8nQxU@cluster0-shard-00-00-bkdec.azure.mongodb.net:27017,cluster0-shard-00-01-bkdec.azure.mongodb.net:27017,cluster0-shard-00-02-bkdec.azure.mongodb.net:27017/X-BOT_DLLO?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority");

  mongoose.connect(urlConexion) 
    .then((con) => {
      console.log(`Conexion establecida con la base de datos: ${urlConexion}`);
    })
    .catch((error) => {
      console.log(error);
    });
};
export default conectarDB;
