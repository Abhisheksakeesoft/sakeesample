const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const fetch = require('./routes/fetch');
const insert = require('./routes/insert');
const update = require('./routes/update');
const app = express();
app.use(cors());
const fs = require('fs');
const https = require('https');
const port = 4100
// Import custom logger and response logger utilities.
const { logger, responseLogger } = require('./utils/logger');
// Use the 'responseLogger' middleware to log responses in the Express application.
app.use(responseLogger);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.get('', (req, res) => {
    res.send({ "Message": "Welcome to DDM proj" })
})
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
//app.listen(port, () => {
//      logger.info(`Application is running on PORT:${port} | PID:${process.pid}`);
//	console.log('Server in port', port);

//})
const keyPath = '/home/ubuntu/sakeesample/api.ddmpublic/private.key';
const certPath = '/home/ubuntu/sakeesample/api.ddmpublic/certificate.crt';

const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};
const httpServer = https.createServer(options,app);

// Create an HTTPS server with the configured options
https.createServer(options, app).listen(port, () => {
    console.log('Server is running on port', port);
    logger.info(`Application is running on PORT:${port} | PID:${process.pid}`);
});

