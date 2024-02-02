import mongoose from "mongoose";
const licensesSchema = mongoose.Schema({

  customerMail: {
    type: String,
    required: true,
    trim: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  initialDate: {
    type: String,
    required: true,
    trim: true
  },
  expirationDate: {
    type: String,
    required: true,
    trim: true
  },
  purchaseDate: {
    type: String,
    required: true,
    trim: true
  },
  licenseType: {
    type: String,
    required: true,
    trim: true
  },
  usersNumber: {
    type: Number,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Licenses = mongoose.model("Licenses", licensesSchema);
export default Licenses;