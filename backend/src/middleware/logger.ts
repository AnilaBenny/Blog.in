import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';


const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
);


const logger = createLogger({
  level: 'info', 
  format: logFormat,
  transports: [
    new transports.Console(), 
    new DailyRotateFile({
      filename: 'logs/%DATE%-app.log', 
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d', 
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' }) 
  ],
});

export default logger;
