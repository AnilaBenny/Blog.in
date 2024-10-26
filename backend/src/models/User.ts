const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: null,
    password: '',
    confirmPassword: '',
  };


  import mongoose, { Schema, model } from 'mongoose';

const userSchema = new Schema({
    firstName: {
    type: String,
    
  },    lastName: {
    type: String,
    
  },
  password: {
    type: String,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String,
 
  },
  phone: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



const User = model('User', userSchema);

export {
  User
};