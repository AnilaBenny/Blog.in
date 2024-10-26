import mongoose, { Schema, model } from 'mongoose';


const blogSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String], 
    default: [],
  },
  category: {
    type: String,
    enum: ['Technology', 'Science', 'Business', 'Entertainment', 'Sports', 'Politics', 'Health', 'Travel'], // Enum for category
    required: true,
  },
  image: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


blogSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});


const Blog = model('Blog', blogSchema);

export {
  Blog
};
