import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import cors from 'cors';

//Swagger
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';

//Importacion de rutas
import usersRoutes  from "./routes/usersRoutes.js"

import licensesRoutes  from "./routes/licensesRoutes.js"


//Iniciamos el servidor express
const app =express();

// para leer los datos en formato json 
app.use(express.json());

app.use(cors())

//Iniciamos variables del entorno
dotenv.config();


//Conectar a db mongo
conectarDB();

//Routing del API
app.use("/api/users", usersRoutes);
app.use("/licenses", licensesRoutes);

//Ruta para la documentación
app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerSpec))


//Obtenemos una variable de entorno
const PORT = process.env.PORT || 3000

//Lanzando el api
app.listen(PORT, ()=>{
  console.log(`Api ejecutandose en el puerto ${PORT}`)
})

export default app


