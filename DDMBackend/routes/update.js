const config = require('../config/config')
const PDFDocument = require('pdfkit');
//Razorpay Keys for the process
const RazorePay = require('razorpay');
//Razorpay keys for the intitation of the process
const instance = new RazorePay({key_id:config.KeyId,key_secret:config.KeySecret});
//Stripe keys for the initiation of the payment
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);
const dao = require('../dao/dao')
//Path for the file accessing from the file loaction
const path = require('path');
// Import the 'fs' module for working with the file system.
const fs = require('fs');
const RobotoFont = path.join(__dirname, './Roboto/Roboto-Bold.ttf');
module.exports = {
  // strip payment
  strippayment: async (req, res, next) => {
    // getting the request token 
    const token = req.body.token;
    console.log('token', token);
    const tokenname = req.body.token.card.name;
    console.log('token', tokenname);
    const amount = req.body.amount
    console.log(amount)
    try {
      // creating the strip paymentmethod
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          // with the token id
          token: token.id,
        },
      });

      console.log('paymentMethod', paymentMethod);

      const customer = await stripe.customers.create({
        name: tokenname,
        payment_method: paymentMethod.id,
      });

      console.log('customer', customer);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount * 100,
        currency: 'inr',
        description: 'Image Price',
        payment_method_types: ['card'],
        customer: customer.id,
      });

      console.log('paymentIntent', paymentIntent);

      const paymentConfirm = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        { payment_method: "pm_card_visa" }
      );

      console.log('paymentConfirm', paymentConfirm);

      // Call the handlePaymentIntent function (without 'this')
      handlePaymentIntent(paymentConfirm, res);

    } catch (error) {
      console.error('Error creating Payment Intent:', error);
    }
  },

  // Define handlePaymentIntent as a function within an object
  const: handlePaymentIntent = function (paymentConfirm, res) {
    if (paymentConfirm.status === 'requires_action') {
      const nextAction = paymentConfirm.next_action;

      if (nextAction && nextAction.type === 'use_stripe_sdk') {
        const sourceRedirectURL = nextAction.use_stripe_sdk.stripe_js;
        console.log('Redirect the customer to: ' + sourceRedirectURL);
        res.status(200).json(sourceRedirectURL);
      }
    } else {
      console.log('Payment status: ' + paymentConfirm.status);
      res.status(200).json({ status: paymentConfirm.status });
    }
  },
  // for the imvoice num
  const: generateUniqueInvoiceNumber = function (paymentConfirm, res) {
    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const additionalNumber = Math.floor(Math.random() * 100);
    return `${month}${day}${additionalNumber}`;
  },


  makeRazorPayment: async (req, res) => {
    try {
        const amount = req.body.amount;
        console.log(amount)
      const order = await instance.orders.create({
        amount:amount,
        currency:"INR",
        receipt: "1",
        notes:{}
      });
      console.log(order.id)

      res.status(200).json(order.id);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  //
  capturePayment:async(req,res)=>{
    try{
    const {paymentId,amount,currency,data}= req.body;
    const payment = await instance.payments.capture(paymentId, amount, currency);
    
    const payment_method=payment.method;
    const email = payment.email;
    console.log(data);
    const name = data.name;
    if(payment.captured === true){
      const cartData = {
        name: data.name,
        email: data.email,
        contact: data.contact,
        imagedeatils: data.selectedimages,
        totalprice: data.totalamount,
        status: 'Succeeded',
        paymentmethod:payment_method ,
        date: new Date(),
        Tax:data.tax,
        Totalamountwithtax: data.Totalamountwithtax,
        CurrentAddress:data.CurrentAddress
      }

      // console.log(cartData);
      await dao.captureData(cartData);
      await generateInvoice(data);
      await sendPaymentTransactionNotification(email,name);    
      res.json({status:200 ,message:"Payment Captured"});
    }
    else{
      res.json({message:'Payment Failed',status:400})
    }
    
    }
    catch(error)
    {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  //This api is used to generate invoice/bill in the pdf format
genratepdf: async (req, res) => {
  const {
    name,
    email,
    contact,
    imagename,
    imageprice,
    paymethod,
    paymentstatus,
    currentdate,
    companyname,
    totalamount,
    selectedimages,
    Totalamountwithtax,
    Tax,
    CurrentAddress

  } = req.body;

console.log('CurrentAddress',CurrentAddress)
  const date = new Date().toISOString();
  const dateParts = date.split('T');
  const onlyDate = dateParts[0];
  const invoiceNum = date.replace(/\D/g, '');

  try {
    const data = {
      generate: date,
      // companyimage: companyimage,
      companyname:companyname,
     
      name:name,
      // fullname: fullname,
      contact:contact,
      // mobileno: mobileno,

      // currentDate: date,
      currentdate:currentdate,
      // subtotal: subtotal,
      totalamount:totalamount,
      // selectedpayment: selectedpayment,
      paymethod:paymethod,
      // cartData: cartData,
   selectedimages:selectedimages,
   Totalamountwithtax:Totalamountwithtax,
   Tax:Tax
      
    };

console.log(' Totalamountwithtax', Totalamountwithtax,Tax)
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');
    doc.pipe(res);

    doc.fontSize(10);
    const companyaddress='Btm 2nd stage Bengaluru, Karnataka 560076'
   const textArray = companyaddress.split(',');

    const yPosition = doc.page.margins.top - 25;

    const fontSize = 30;
    doc.font('Helvetica')
    // Set up the header dimensions
    const headerHeight = 100; // Adjust this value based on your header height

    // Measure the width of the text
    const textWidth = doc.widthOfString('Sakeesoft Pvt Lstd', { fontSize });
    const value = textWidth / 2;
    // Calculate the center position within the header for the text
    const textX = (doc.page.width - 2 * textWidth) / 2;
    const centerY = headerHeight / 2;

    // Add text to the header
     doc.fontSize(fontSize).text('Sakeesoft pvt ltd', textX - value, centerY + 20, { align: 'left' });

    doc.fontSize(20); // Set the larger font size
    doc.text("INVOICE", 50, 20, { align: 'right' });

    doc.font('Helvetica').fontSize(12);

    textArray.forEach((line, index) => {
      const textWidth = doc.widthOfString(line);
      const xPosition = doc.page.width - doc.page.margins.right - textWidth;

      doc.text(line.trim(), xPosition, yPosition + index * 15, {
        lineBreak: false, // Disable automatic line breaking
        continued: false, // Do not continue text on the next line
      });
    });
    doc.font('Helvetica').fontSize(12); // Switch back to regular font and font size
    // Convert the base64 image to binary data
    const imageBuffer = Buffer.from(companyname, 'base64');
    doc.image(imageBuffer, 55, 40, { width: 50 });

    // Save the image as a PNG file
    fs.writeFileSync('companyImage.png', imageBuffer);
    doc.moveDown();
    doc.moveDown();
     const currentaddress = 'Swapna PG,9th main 7th cross,BTM 2nd Stage,Banglore.'
    const UserAddress = CurrentAddress.split(',');
    const formattedUserAddress = UserAddress.join('\n');

    doc.moveTo(55, 135).lineTo(540, 135).stroke();
    doc.moveDown();

    doc
      .font('Helvetica-Bold')
      .text(`Bill to:`, 60, 150, { align: 'left' });
    doc.moveDown();

    doc
      .font('Helvetica').text(`${name}`, 60, 170, { align: 'left' });
    doc.moveDown();
    doc.text(`${contact}`, 60, 190, { align: 'left' });
    doc.moveDown();
    doc.text(`${formattedUserAddress}`, 60, 210, { align: 'left' });
    doc.moveDown();

    doc.font('Helvetica-Bold').text(`Invoice No:`, 355, 150,
      { align: 'left' }).font('Helvetica').text(`${invoiceNum}`, 420, 150, { align: 'left' })
    doc.moveDown();
    doc.font('Helvetica-Bold').text(`Invoice Date:`, 355, 170, { align: 'left' }).
      font('Helvetica').text(`${onlyDate}`, 430, 170, { align: 'left' })
    doc.moveDown();
    doc.moveDown();


    const descWidth = 200;
    const priceWidth = 120;
    const qtyWidth = 120;
    const totalWidth = 100;
    const lineSpacing = 20; // Adjust this value for the vertical space between products
    let currentY = 320 + lineSpacing; // Adjust the starting Y-coordinate
    let currentX = 15;

    doc.fillColor('#f5b976')  // Set the fill color for the rectangle
      .strokeColor('#000000') // Set the border color to black
      .lineWidth(1) // Set the border width (adjust as needed)
      .rect(55, currentY - 25, 485, 23)  // Create a rectangle with the specified dimensions
      .fillAndStroke();

    doc.moveTo(200, currentY - 25)
      .lineTo(200, currentY - 5)
      .stroke();

    doc.moveTo(320, currentY - 25)
      .lineTo(320, currentY - 5)
      .stroke();

    doc.moveTo(450, currentY - 25)
      .lineTo(450, currentY - 5)
      .stroke();
    doc.fillColor('black')
      .font('Helvetica-Bold')
      .text('Product', 98, currentY - 18, { width: descWidth, align: 'left' })
      .text('Price', 45 + descWidth, currentY - 18, { width: priceWidth, align: 'left' })
      .text('Quantity', 45 + descWidth + priceWidth, currentY - 18, { width: qtyWidth, align: 'left' })
      .text('Total', 44 + descWidth + priceWidth + qtyWidth, currentY - 18, { width: totalWidth, align: 'left' });


    // Iterate through your products
    const products = selectedimages;
    console.log("Data to print", products)
    for (const product of products) {
      doc.moveDown();
      const price=parseInt(product.imagePrice)
      // const item = parseInt(product.imagename)
      const prodlen = 30;
      const value = prodlen / 2;
      doc.font('Helvetica');
      doc.text(product.event, 80, currentY + 3, { height: 30, width: 130, align: 'left' });
       doc.text(price.toFixed(2), 45 + totalWidth + 10, currentY + 3, { width: priceWidth, align: 'right' });
      doc.text('---', 70 + descWidth, currentY + 3, { width: qtyWidth, align: 'right' });
       doc.text(price.toFixed(2), 58 + descWidth + priceWidth, currentY + 3,
         { width: qtyWidth + 20, align: 'right' });
      doc.moveDown();


      //This lines for the middle of the table
      doc.moveTo(200, currentY + currentX + 15)
        .lineTo(200, currentY - 5)
        .stroke();

      doc.moveTo(320, currentY + currentX + 15)
        .lineTo(320, currentY - 5)
        .stroke();

      doc.moveTo(450, currentY + currentX + 15)
        .lineTo(450, currentY - 5)
        .stroke();

      //This lines for the edges of the table
      doc.moveTo(55, currentY + currentX + 15)//Left line 
        .lineTo(55, currentY - 5)
        .stroke();

      doc.moveTo(540, currentY + currentX + 15)//Right line
        .lineTo(540, currentY - 5)
        .stroke();

      doc.moveTo(55, currentY + lineSpacing + value - 4)
        .lineTo(descWidth + priceWidth + qtyWidth + totalWidth, currentY + lineSpacing + value - 4)
        .stroke();
      currentY += lineSpacing + value; // Move to the next line for the next product

      if (currentY >= 650) {
        // Add a new page
        doc.addPage();
        doc.image('companyImage.png', 55, 50, { width: 40 });
        currentY = 120; // You can adjust the starting Y-coordinate for the new page
        doc.moveTo(55, currentY - 5)
          .lineTo(descWidth + priceWidth + qtyWidth + totalWidth, currentY - 5)
          .stroke();

      }
      doc.moveDown();
    }

    const price=Totalamountwithtax.toFixed(2)
    const tax = Tax.toFixed(2);
    const grandTotal = (tax+parseFloat(price)); 
    console.log(Tax,Totalamountwithtax)
    const Totalprice=totalamount.toFixed(2)

    const lineY = currentY + lineSpacing;

    doc.fillColor('#f5b976');

    // Set stroke (border) color for the rectangle
    doc.strokeColor('black');

    // Draw and fill the rectangle
    doc.rect(320, lineY + 20, 220, 1 * lineSpacing).fillAndStroke();

    // Reset fill and stroke colors to their defaults (optional)
    doc.fillColor('black');
    doc.strokeColor('black');

    doc.moveTo(320, lineY).lineTo(540, lineY).stroke();
    doc.moveTo(320, lineY + lineSpacing).lineTo(540, lineY + lineSpacing).stroke();
    doc.moveTo(320, lineY + 2 * lineSpacing).lineTo(540, lineY + 2 * lineSpacing).stroke();

    // Vertical Lines edges of the table
    doc.moveTo(540, lineY + 2 * lineSpacing - 65).lineTo(540, lineY + 2 * lineSpacing).stroke();

    // Table division Lines
    doc.moveTo(320, lineY + 2 * lineSpacing - 65).lineTo(320, lineY + 2 * lineSpacing).stroke();
    doc.moveTo(450, lineY + 2 * lineSpacing - 65).lineTo(450, lineY + 2 * lineSpacing).stroke();

    // Write Subtotal, Tax, and Grand Total values
    //I need to change below lines to align
    doc.registerFont('Roboto-Bold',RobotoFont);
    doc.font('Roboto-Bold')
      .fontSize(12)
      .text("\u20B9", 460, currentY + 3, { width: 5, align: 'center' });
    doc.moveDown();

    doc.font('Helvetica-Bold')
    doc.text("Item Total", 365, currentY + 5);
    
    doc.font('Helvetica');
   
    doc.text(Totalprice, 459, currentY + 5, { width: 60, align: 'right' });

    doc.font('Roboto-Bold')
      .fontSize(12)
      .text("\u20B9", 460, currentY + 3 + lineSpacing, { width: 5, align: 'center' });
    doc.moveDown();
    doc.font('Helvetica-Bold')
    doc.text("Tax (10%)", 365, currentY + 5 + lineSpacing);
    doc.font('Helvetica');
    doc.text(tax, 459, currentY + 5 + lineSpacing, { width: 60, align: 'right' });

    doc.font('Roboto-Bold')
      .fontSize(12)
      .text("\u20B9", 460, currentY + 3 + 2 * lineSpacing, { width: 5, align: 'center' });
    doc.moveDown();
    doc.font('Helvetica-Bold')
    doc.text("To Pay", 365, currentY + 5 + 2 * lineSpacing);
    doc.font('Helvetica');
     doc.text(price, 459, currentY + 5 + 2 * lineSpacing, { width: 60, align: 'right' });

    doc.moveDown();
    doc.strokeColor('black');
    doc.lineWidth(0.5);
    // thank u msg
    doc.fontSize(15); // Set the larger font size
    doc.text("Thank You Visit Again !", 200, currentY + 150);
    doc.fontSize(16);

    const xPosition = 60;  // Set the desired X-coordinate
    const YPosition = 700;  // Set the desired Y-coordinate

    doc.font('Helvetica').fontSize(12);

    textArray.forEach((line, index) => {
      const textWidth = doc.widthOfString(line);
      doc.text(line.trim(), xPosition, YPosition + index * 15, {
        lineBreak: false, // Disable automatic line breaking
        continued: false, // Do not continue text on the next line
      });
    });
    doc.end();
  }
  catch (error) {
    console.log("Error Occurred", error);
    res.status(400).send("Error Occurred");
  }
},
}

const sendPaymentTransactionNotification = async (email,name) => {
  const mailOptions = {
    from: config.email,
    to: email,
    subject: 'Payment Transaction Notification',
    text: `Payment for order is Successful placed.`,
    attachments: [
      {
        filename: `${name}.pdf`,
        path: path.resolve(__dirname+"/Payment_Files",`${name}.pdf`),
      },
    ],
  };
  await config.transporter.sendMail(mailOptions);
};



//Pdf generation function
async function generateInvoice(data)
  {
    const {
      name,
      contact,
      paymethod,
      currentdate,
      companyname,
      totalamount,
      selectedimages,
      Totalamountwithtax,
      CurrentAddress,
      tax

    } = data;
    const date = new Date().toISOString();
    const dateParts = date.split('T');
    const onlyDate = dateParts[0];
    const invoiceNum = date.replace(/\D/g, '');

    try {
      const info = {
        generate: date,
        companyname:companyname,
        name:name,
        contact:contact,
        currentdate:currentdate,
        totalamount:totalamount,
        paymethod:paymethod,
        selectedimages:selectedimages,
        tax:tax,
        Totalamountwithtax:Totalamountwithtax,
        
      };
      const doc = new PDFDocument();
      const filename = path.resolve(__dirname+"/Payment_Files",`${name}.pdf`);
      
      doc.fontSize(10);
      const companyaddress='125,7th cross road,dollar Layout,Bilekahalli,Bengaluru,karnataka.'
     const textArray = companyaddress.split(',');

      const yPosition = doc.page.margins.top - 25;

      const fontSize = 30;
      doc.font('Helvetica')
      // Set up the header dimensions
      const headerHeight = 100; // Adjust this value based on your header height

      // Measure the width of the text
      const textWidth = doc.widthOfString('Sakeesoft Pvt Ltd', { fontSize });
      const value = textWidth / 2;
      // Calculate the center position within the header for the text
      const textX = (doc.page.width - 2 * textWidth) / 2;
      const centerY = headerHeight / 2;

      // Add text to the header
       doc.fontSize(fontSize).text('Sakeesoft Pvt Ltd', textX - value, centerY + 20, { align: 'left' });

      doc.fontSize(20); // Set the larger font size
      doc.text("INVOICE", 50, 20, { align: 'right' });

      doc.font('Helvetica').fontSize(12);

      textArray.forEach((line, index) => {
        const textWidth = doc.widthOfString(line);
        const xPosition = doc.page.width - doc.page.margins.right - textWidth;

        doc.text(line.trim(), xPosition, yPosition + index * 15, {
          lineBreak: false, // Disable automatic line breaking
          continued: false, // Do not continue text on the next line
        });
      });
      doc.font('Helvetica').fontSize(12); // Switch back to regular font and font size
      // Convert the base64 image to binary data
      const imageBuffer = Buffer.from(companyname, 'base64');
      doc.image(imageBuffer, 55, 40, { width: 50 });

      // Save the image as a PNG file
      fs.writeFileSync('companyImage.png', imageBuffer);
      doc.moveDown();
      doc.moveDown();
      const UserAddress = CurrentAddress.split(',');
      const formattedUserAddress = UserAddress.join('\n');

      doc.moveTo(55, 135).lineTo(540, 135).stroke();
      doc.moveDown();

      doc
        .font('Helvetica-Bold')
        .text(`Bill to:`, 60, 150, { align: 'left' });
      doc.moveDown();

      doc
        .font('Helvetica').text(`${name}`, 60, 170, { align: 'left' });
      doc.moveDown();
      doc.text(`${contact}`, 60, 190, { align: 'left' });
      doc.moveDown();
      doc.text(`${formattedUserAddress}`, 60, 210, { align: 'left' });
      doc.moveDown();

      doc.font('Helvetica-Bold').text(`Invoice No:`, 355, 150,
        { align: 'left' }).font('Helvetica').text(`${invoiceNum}`, 420, 150, { align: 'left' })
      doc.moveDown();
      doc.font('Helvetica-Bold').text(`Invoice Date:`, 355, 170, { align: 'left' }).
        font('Helvetica').text(`${onlyDate}`, 430, 170, { align: 'left' })
      doc.moveDown();
      doc.moveDown();


      const descWidth = 200;
      const priceWidth = 120;
      const qtyWidth = 120;
      const totalWidth = 100;
      const lineSpacing = 20; // Adjust this value for the vertical space between products
      let currentY = 320 + lineSpacing; // Adjust the starting Y-coordinate
      let currentX = 15;

      doc.fillColor('#f5b976')  // Set the fill color for the rectangle
        .strokeColor('#000000') // Set the border color to black
        .lineWidth(1) // Set the border width (adjust as needed)
        .rect(55, currentY - 25, 485, 23)  // Create a rectangle with the specified dimensions
        .fillAndStroke();

      doc.moveTo(200, currentY - 25)
        .lineTo(200, currentY - 5)
        .stroke();

      doc.moveTo(320, currentY - 25)
        .lineTo(320, currentY - 5)
        .stroke();

      doc.moveTo(450, currentY - 25)
        .lineTo(450, currentY - 5)
        .stroke();
      doc.fillColor('black')
        .font('Helvetica-Bold')
        .text('Product', 98, currentY - 18, { width: descWidth, align: 'left' })
        .text('Price', 45 + descWidth, currentY - 18, { width: priceWidth, align: 'left' })
        .text('Quantity', 45 + descWidth + priceWidth, currentY - 18, { width: qtyWidth, align: 'left' })
        .text('Total', 44 + descWidth + priceWidth + qtyWidth, currentY - 18, { width: totalWidth, align: 'left' });


      // Iterate through your products
      const products = selectedimages;
      for (const product of products) {
        doc.moveDown();
        const cost= product.imagePrice;
        const price = cost.toFixed(2)
        // const item = parseInt(product.imagename)
        const prodlen = 30;
        const value = prodlen / 2;
        doc.font('Helvetica');
        doc.text(product.event, 80, currentY + 3, { height: 30, width: 130, align: 'left' });
         doc.text(price, 45 + totalWidth + 10, currentY + 3, { width: priceWidth, align: 'right' });
        doc.text('---', 70 + descWidth, currentY + 3, { width: qtyWidth, align: 'right' });
         doc.text(price, 58 + descWidth + priceWidth, currentY + 3,
           { width: qtyWidth + 20, align: 'right' });
        doc.moveDown();


        //This lines for the middle of the table
        doc.moveTo(200, currentY + currentX + 15)
          .lineTo(200, currentY - 5)
          .stroke();

        doc.moveTo(320, currentY + currentX + 15)
          .lineTo(320, currentY - 5)
          .stroke();

        doc.moveTo(450, currentY + currentX + 15)
          .lineTo(450, currentY - 5)
          .stroke();

        //This lines for the edges of the table
        doc.moveTo(55, currentY + currentX + 15)//Left line 
          .lineTo(55, currentY - 5)
          .stroke();

        doc.moveTo(540, currentY + currentX + 15)//Right line
          .lineTo(540, currentY - 5)
          .stroke();

        doc.moveTo(55, currentY + lineSpacing + value - 4)
          .lineTo(descWidth + priceWidth + qtyWidth + totalWidth, currentY + lineSpacing + value - 4)
          .stroke();
        currentY += lineSpacing + value; // Move to the next line for the next product

        if (currentY >= 650) {
          // Add a new page
          doc.addPage();
          doc.image('companyImage.png', 55, 50, { width: 40 });
          currentY = 120; // You can adjust the starting Y-coordinate for the new page
          doc.moveTo(55, currentY - 5)
            .lineTo(descWidth + priceWidth + qtyWidth + totalWidth, currentY - 5)
            .stroke();

        }
        doc.moveDown();
      }

      //Total cost
      const Totalprice= totalamount.toFixed(2);
      //Tax in percentage
      const Tax = tax.toFixed(2);
      console.log(Tax,Totalamountwithtax)
      //Total with tax
      const intTaxwith = (totalamount+tax);
      const price=intTaxwith.toFixed(2);
      

      const lineY = currentY + lineSpacing;

      doc.fillColor('#f5b976');

      // Set stroke (border) color for the rectangle
      doc.strokeColor('black');

      // Draw and fill the rectangle
      doc.rect(320, lineY + 20, 220, 1 * lineSpacing).fillAndStroke();

      // Reset fill and stroke colors to their defaults (optional)
      doc.fillColor('black');
      doc.strokeColor('black');

      doc.moveTo(320, lineY).lineTo(540, lineY).stroke();
      doc.moveTo(320, lineY + lineSpacing).lineTo(540, lineY + lineSpacing).stroke();
      doc.moveTo(320, lineY + 2 * lineSpacing).lineTo(540, lineY + 2 * lineSpacing).stroke();

      // Vertical Lines edges of the table
      doc.moveTo(540, lineY + 2 * lineSpacing - 65).lineTo(540, lineY + 2 * lineSpacing).stroke();

      // Table division Lines
      doc.moveTo(320, lineY + 2 * lineSpacing - 65).lineTo(320, lineY + 2 * lineSpacing).stroke();
      doc.moveTo(450, lineY + 2 * lineSpacing - 65).lineTo(450, lineY + 2 * lineSpacing).stroke();

      // Write Subtotal, Tax, and Grand Total values
      //I need to change below lines to align
      doc.registerFont('Roboto-Bold',RobotoFont);
      doc.font('Roboto-Bold')
        .fontSize(12)
        .text("\u20B9", 455, currentY + 3, { width: 5, align: 'center' });
      doc.moveDown();

      doc.font('Helvetica-Bold')
      doc.text("Item Total", 365, currentY + 5);
      
      doc.font('Helvetica');
     
      doc.text(Totalprice, 459, currentY + 5, { width: 60, align: 'right' });

      doc.font('Roboto-Bold')
        .fontSize(12)
        .text("\u20B9", 455, currentY + 3 + lineSpacing, { width: 5, align: 'center' });
      doc.moveDown();
      doc.font('Helvetica-Bold')
      doc.text("Tax (10%)", 365, currentY + 5 + lineSpacing);
      doc.font('Helvetica');
      doc.text(Tax, 459, currentY + 5 + lineSpacing, { width: 60, align: 'right' });

      doc.font('Roboto-Bold')
        .fontSize(12)
        .text("\u20B9", 455, currentY + 3 + 2 * lineSpacing, { width: 5, align: 'center' });
      doc.moveDown();
      doc.font('Helvetica-Bold')
      doc.text("To Pay", 365, currentY + 5 + 2 * lineSpacing);
      doc.font('Helvetica');
       doc.text(price, 459, currentY + 5 + 2 * lineSpacing, { width: 60, align: 'right' });

      doc.moveDown();
      doc.strokeColor('black');
      doc.lineWidth(0.5);
      // thank u msg
      doc.fontSize(15); // Set the larger font size
      doc.text("Thank You Visit Again !", 200, currentY + 150);
      doc.fontSize(16);

      const xPosition = 60;  // Set the desired X-coordinate
      const YPosition = 700;  // Set the desired Y-coordinate

      doc.font('Helvetica').fontSize(12);

      textArray.forEach((line, index) => {
        const textWidth = doc.widthOfString(line);
        doc.text(line.trim(), xPosition, YPosition + index * 15, {
          lineBreak: false, // Disable automatic line breaking
          continued: false, // Do not continue text on the next line
        });
      });

doc.pipe(fs.createWriteStream(filename))

doc.end();
}
catch (error) {
console.log("Error Occurred", error);
}
}
