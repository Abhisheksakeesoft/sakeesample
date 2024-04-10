// installing the logger with required formats
const { createLogger, transports, format } = require('winston');
//For user customization 
const customFormat = format.printf(({message, timestamp }) => {
    return `${timestamp} ${message} `;
  });
  //Creating a logger
  const logger = createLogger({
    transports: [ //This is used to transport the data where we want to Ex.log file/console.
      new transports.File({//This is used to create a file 
        filename: 'customer.log',//File name
        level: 'info',//log level
        format: format.combine(  
          format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSS Z' }),//Which formate we want to print the date....
          customFormat, //Here we are accessing user customization
        ),
      }),
    ],
  });
  
  //This is a function which is used as a middleware
  const responseLogger = (req, res, next) => {
    //This i to get the api url
    const originalSend = res.send;
  
    // Store the start time for response time calculation
    const startTime = new Date();
  
    // Replace the res.send function to intercept the response
    res.send = function (body) {
      // Calculate the response time
      const responseTime = new Date() - startTime;
      // Determine the log level based on the response status code
      const logLevel = res.statusCode >= 400 ? 'error' : 'info';
      //This line will send the whole response with message to the client/UI
      originalSend.call(this, body);
      //It prints that if error occurs print error log and it is not error it prints info log 
      if (logLevel === 'info') {
        logger.info(`Remote Address: ${req.ip} - HTTP Method: ${req.method} - Request URL: ${req.originalUrl} - API Response: ${body} - Status Code: ${res.statusCode} - Response Time: ${responseTime} ms`);
      } else {
        logger.error(`Request URL: ${req.originalUrl} - Status Code: ${res.statusCode} - Error:${body} - Remote Address: ${req.ip} - Method: ${req.method} - Response Time: ${responseTime} ms`);
      }
     
    };
    next();
  };

module.exports = {logger,responseLogger}