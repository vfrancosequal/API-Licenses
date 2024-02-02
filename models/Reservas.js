import mongoose from "mongoose";
const reservaSchema = mongoose.Schema({
  descripcion:{
    type: String,
    required: true,
    trim: true
  },
  valorReserva: {
    type: Number,
    required: true,
    trim: true
  }
},{
  timestamps:true
});

const Usuario = mongoose.model("Usuarios", userSchema);
export default Usuario;