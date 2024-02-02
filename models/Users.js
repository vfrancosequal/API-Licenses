import mongoose from "mongoose";
const userSchema = mongoose.Schema({

  nombreUsuario: {
    type: String,
    required: true,
    trim: true
  },
  celularUsuario: {
    type: Number,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Usuario = mongoose.model("Usuarios", userSchema);
export default Usuario;