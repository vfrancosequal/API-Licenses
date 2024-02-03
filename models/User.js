import mongoose from "mongoose";
const userSchema = mongoose.Schema({

  _id: String,
  idLicense: {
    type: Object,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const User = mongoose.model("user", userSchema);
export default User;