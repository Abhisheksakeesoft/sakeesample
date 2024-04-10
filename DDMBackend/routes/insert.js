const dao = require('../dao/dao');
module.exports =
{
  image : async (req, res) => {
    try {
      const { event, image, imageprice } = req.body;
  
      await dao.insertImage(event, image, imageprice);
  
      res.status(200).send("Data inserted successfully");
    } catch (error) {
      console.error('Failed to insert data:', error);
      res.status(500).send("Failed to insert data");
    }
  },
selectedImages: async (req, res) => {
  try {
    const {
      customerEmail, customerName, customerPhone, selectedImages, Toatlprice,currentAddress
    } = req.body;

    await dao.insertSelectedImages( customerEmail, customerName, customerPhone, selectedImages, Toatlprice,currentAddress);

    res.status(200).json({ success: true, message: 'Data added successfully' });
  } catch (error) {
    console.error('Error inserting data into the cart collection:', error);
    res.status(500).json({ success: false, message: 'Error inserting data into the cart collection' });
  }
},

addToCart: async (req, res) => {
  try {
    const {
             customerEmail, customerName, customerPhone, selectedImages, Toatlprice,Tax, 
        Totalamountwithtax,currentAddress

    } = req.body;

    await dao.addToCart(customerEmail, customerName, customerPhone, selectedImages, Toatlprice,Tax,Totalamountwithtax,currentAddress);

    res.status(200).json({ success: true, message: 'Data added successfully' });
  } catch (error) {
    console.error('Error inserting data into the DDM_public_cartdata collection:', error);
    res.status(500).json({ success: false, message: 'Error inserting data into the DDM_public_cartdata collection' });
  }
},

paymentDetails : async (req, res) => {
  try {
    const customerdetails = req.body;
    console.log('Customer details:', customerdetails);

    await dao.insertPaymentDetails(customerdetails);

    res.status(200).json({ success: true, message: 'Payment details added successfully' });
  } catch (error) {
    console.error('Error inserting payment details:', error);
    res.status(500).json({ success: false, message: 'Error inserting payment details' });
  }
},
}