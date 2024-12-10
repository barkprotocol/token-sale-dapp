import winston from 'winston';

// Define log formats for different environments
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),  // Adds color to the logs
    logFormat
  ),
  transports: [
    // Console transport for development (always enabled)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        logFormat
      ),
    }),
    // You can add more transports here (e.g., file logging) if needed
  ],
});

// Add file transport for production environment
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ filename: 'logs/app.log' }));
}

export default logger;
