// Import the 'express' module, which is a popular Node.js web framework.
const express = require('express'); // Import the 'express' framework
// Create an instance of the Express application.
const app = express();
// Import the 'mongo' module from the '../database/mongodb' file.
const mongo = require('../database/mongodb');
// Assign the 'mongo' module to the 'db' variable, which is used to interact with the database.
const db = mongo;
// Import the 'body-parser' middleware, which helps parse incoming request data.
const bodyParser = require("body-parser");
// Use 'bodyParser' to parse incoming JSON and URL-encoded data with a specified limit.
app.use(bodyParser.json({ limit: "50mb" })); // Parse JSON data with a limit of 50MB
// Parse URL-encoded data with a limit of 50MB
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); 

module.exports={
///////////////////////////Fetch API////////////////////////////
getTemplateData: async (selectedtemplate) => {
    return new Promise(async(resolve, reject) => {
        try{
      const parameter = selectedtemplate.replace(/\s+/g, '');
      const data = await db.collection('Sakeesoft_'+parameter+'_Templates').find({}).toArray();
        resolve({ status: 200, message: 'Data sent to slides', data: data });
    } catch (error) {
      reject({ status: 500, message: 'Server error' });
    }
      });
  },

  getSelectedImages: async (customerEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
          // Find all documents in the "cart" collection with a matching customerEmail and sort by timestamp in descending order
          const cartData = await db.collection('cart').find({ customerEmail })
            .sort({ timestamp: -1 }) // Sort by timestamp in descending order (most recent first)
            .limit(1) // Limit the result to one document (the most recent)
            .toArray();
    
          resolve(cartData.length > 0 ? cartData[0] : null);
        } catch (error) {
          console.error('Error retrieving data from MongoDB:', error);
          reject(error);
        }
      });
  },

  getCartData: async (customerEmail) => {
        try {
          const cartData = await db.collection('DDM_public_cartdata')
            .find({ customerEmail })
            .sort({ timestamp: -1 })
            .limit(1)
            .toArray();
    
          return cartData.length > 0 ? cartData[0] : null;
        } catch (error) {
          console.error('Error retrieving data from MongoDB:', error);
          throw new Error('Internal server error');
        }
  },


///////////////////////// Insert Dao /////////////////////////////

insertImage: async (event, image, imageprice) => {
    return new Promise(async (resolve, reject) => {
        try {
          const parameter = event.replace(/\s+/g, '');
          const data = {
            event: parameter,
            image: image,
            imageprice: imageprice
          };
          const cartData = await db.collection('Sakeesoft_' + parameter + '_Templates').insertOne(data);
          resolve({ status: 200, message: 'Data sent to slides', data: cartData });
        } catch (error) {
          // Reject with error message
          reject({ status: 500, message: 'Server error' });
        }
      });
  },

  insertSelectedImages: async ( customerEmail, customerName, customerPhone, selectedImages, Toatlprice,Currentaddress) => {
    return new Promise(async (resolve, reject) => {
        try {
          // Get the current timestamp
          const currentTime = new Date();
      
          // Define the data object to be inserted into the "cart" collection
          const data = {
            customerEmail, customerName, customerPhone, selectedImages, Toatlprice,Currentaddress,
            timestamp: currentTime, // Add a 'timestamp' field with the current time
          };
      
          const info = await db.collection('cart').insertOne(data);
          resolve({ status: 200, message: 'Data inserted into the cart collection successfully',data:info });
        } catch (error) {
          reject({ status: 500, message: 'Error inserting data into the cart collection',error });
        }
      });
  },

  addToCart: async (customerEmail, customerName, customerPhone, selectedImages, totalPrice, tax, totalAmountWithTax, currentAddress) => {
    return new Promise(async (resolve, reject) => {
        try {
          // Get the current timestamp
          const currentTime = new Date();
      
          // Define the data object to be inserted into the "DDM_public_cartdata" collection
          const data = {
            customerEmail,
            customerName,
            customerPhone,
            selectedImages,
            totalPrice,
            tax,
            totalAmountWithTax,
            currentAddress,
            timestamp: currentTime, // Add a 'timestamp' field with the current time
          };
      
          const info = await db.collection('DDM_public_cartdata').insertOne(data);
          resolve({ status: 200, message: 'Data inserted into the cart collection successfully', data: info });
        } catch (error) {
          reject({ status: 500, message: 'Error inserting data into the cart collection', error });
        }
      });
      
  },

  insertPaymentDetails: async (paymentDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
          const result = await db.collection('payment_ddmpublic').insertOne(paymentDetails);
          resolve({ status: 200, message: 'Data inserted into the cart collection successfully', data: result });
        } catch (error) {
          reject({ status: 500, message: 'Error inserting data into the cart collection', error });
        }
      });

},

//Inserting the successful payment data
captureData: (cartData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.collection('payment_ddmpublic').insertOne(cartData);
        resolve({ status: 200, message:"Products Added to Inventory"});
      } catch (error) {
        reject({ message: 'Error adding data to Cart'});
      }
    });
  },

}