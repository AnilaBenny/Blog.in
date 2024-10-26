import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const databaseURI = "mongodb+srv://anilacbenny810:YQKaS1wYCrEscHsV@blogin.pbman.mongodb.net/";

export async function connectToDatabase() {
   try {    
      if (!databaseURI) {
         console.log('not found');
         
         throw new Error('MONGODB_URI is not defined in the environment variables.');
      }

      await mongoose.connect(databaseURI);
      console.log('MongoDB Connected');
   } catch (err:any) {
      console.error('Error connecting to MongoDB: ' + err.message);
      throw err;
   }
}






