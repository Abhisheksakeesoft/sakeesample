
const express = require("express");
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
const winston = require('winston');
const expressWinston = require('express-winston');
const fetch = require('./DDMBackend/routes/fetch');
const insert = require('./DDMBackend/routes/insert');
const update = require('./DDMBackend/routes/update');

const port = 4100
// Import custom logger and response logger utilities.
const { logger, responseLogger } = require('./DDMBackend/utils/logger');
// Use the 'responseLogger' middleware to log responses in the Express application.
app.use(responseLogger);

// Simulate an example route that throws an error
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

// using this api inserting the image in mongodb
app.post('/image', insert.image);

// using this api based on the template getting the data in mongodb
app.post('/templateData', fetch.templateData);

// using this api sending the node mailer
app.post('/bookourdemo', fetch.bookourdemo);

// strip payment api
app.post('/strippayment', update.strippayment);

// storing the payment details in mongodb
app.post('/paymentdeatils', insert.paymentDetails)

// using this api generatepdf for the payment receipt
 app.post('/genratepdf', update.genratepdf);

// addtocart selecting the images storing to mongodb
app.post('/selectedimages', insert.selectedImages);

// using this api getting the images to send frontend
app.post('/getselectedimages', fetch.getSelectedImages);

//  using this api final cart images storing to mongodb
app.post('/addtocart', insert.addToCart)
// getting the cart images
app.post('/getcartdata', fetch.getCartData)

//This is RazorePayment api 
app.post('/makeRazorPayment',update.makeRazorPayment);

//This api is used to capture the payment
app.post('/capturePayment',update.capturePayment);

// Start the server on port 4100 and log a message to indicate the server is running
app.listen(port, () => { 
  console.log('Server in port', port);
  logger.info(`Application is running on PORT:${port} | PID:${process.pid}`);
})






