const config = require('../config/config')
const dao = require('../dao/dao');
const mongo = require('../database/mongodb');
// Assign the 'mongo' module to the 'db' variable, which is used to interact with the database.
const db = mongo;
const transporter = config.transporter

module.exports = {
  // to get the image base64 based on the selected template
  //Dao
  templateData :async (req, res) => {
    try {
      var selectedtemplate = req.body.selectedtemplate;
      const data = await dao.getTemplateData(selectedtemplate);
      res.status(data.status).json({message:data.message, data:data.data});
    } catch (error) {
      console.error(error);
      res.status(error.status).json({ error: error.message });
    }
  },
  // using the nodemailer senind to mail request
  bookourdemo: async (req, res) => {
    // Create a transporter for sending emails
  try {
    const { CustomerName, CompanyName, date, Time,Email } = req.body;
    console.log(CustomerName, CompanyName, date, Time,Email)

    const companyMailOptions = {
      from: 'ammajamma@sakeesoft.com',
      to: 'ammajamma@sakeesoft.com',
      subject: 'Scheduled Demo with Sakeesoft',
      text: `Hello,\n\n${CustomerName} is interested in our ddm app.\n\nPlease be available on this Date: ${date} & Time: ${Time}.\nGoogle Meet link below:\n\nGoogle Meet Link: https://meet.google.com/rtz-htri-sqm?pli=1\n\nThanks,\n${CompanyName}`,
    };

    const outsideMailOptions = {
      from:Email ,
      to: Email,
      subject: 'Scheduled Demo with Sakeesoft',
      text: `Dear ${CustomerName},\n\nOur dynamic digital menu demo is scheduled on this Time: ${Time} & Date: ${date}.\n\nPlease be available at this time.\n\nPlease join the following Google Meet link below:\nGoogle Meet Link: https://meet.google.com/rtz-htri-sqm?pli=1\n\nThanks,\nSakeesoft`,
    };

    await transporter.sendMail(companyMailOptions);
    await transporter.sendMail(outsideMailOptions);

    console.log('Emails sent successfully');
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'An error occurred while sending the emails' });
  }
  },

getSelectedImages: async (req, res) => {
  try {
    // getting the request from client side
    const { customerEmail } = req.body;
    const cartData = await dao.getSelectedImages(customerEmail);

    if (cartData) {
      // Send the most recent cart data back as a response
      res.status(200).json(cartData);
    } else {
      // No matching data found
      res.status(404).json({ message: 'No data found for the customer email' });
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

  getCartData: async (req, res) => {
    const { customerEmail } = req.body;
    try {
      const cartData = await dao.getCartData(customerEmail);
      
      if (cartData) {
        res.status(200).json(cartData);
      } else {
        res.status(404).json({ message: 'No data found for the customer email' });
      }
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ message: error.message });
    }
  },
}











