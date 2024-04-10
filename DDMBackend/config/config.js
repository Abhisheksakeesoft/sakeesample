const nodemailer = require('nodemailer');

module.exports = {
//mongodb database url
	URL: 'mongodb+srv://sakeesoft:Join12345@cluster0.opdkczb.mongodb.net/?retryWrites=true&w=majority',
// strip secret key
  STRIPE_SECRET_KEY:"sk_test_51NpS3BSEjQI60rCl6KmzKC78HhhdXtohB6FaLYQMVVE2AGs9AEaHpHFTkqKAa9aP4lIGPMUyCv0iCtBpZXoLYcP200jPUL2x97",

    // RazorPay Keys for mail:kalyan@sakeesoft.com
    Mid:'N8B9nD6J8dBsq5',
    KeyId:'rzp_test_rh1sVK6w0pFVHD',
    KeySecret:'A46muATiNrJiDpeweAandHwv',
    
  // Create a transporter for sending emails
 transporter :nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'sakeesoft.testemail@gmail.com',
    pass: 'kklmmpooqwmkmhsc\r\n'
  },
})


};

