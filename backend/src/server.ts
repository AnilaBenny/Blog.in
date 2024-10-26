import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import logger from './middleware/logger';
import authRoute from './routes/authRoute';
import { connectToDatabase } from './config/database';
import path from 'path';
 dotenv.config();
 
const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true, 
}));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});


app.use('/', authRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((err: any, req: any, res: any, next: any) => {
  logger.error(`${err.status || 500} - ${err.message}`);
  res.status(err.status || 500).send('Something went wrong!');
});

const PORT=8080;

console.log('App is starting...');

connectToDatabase().then(() => {
  console.log('Connected to the database');
  app.listen(8080, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  
}).catch((error) => {
  console.error('Failed to connect to the database:', error);
  process.exit(1); 
});


