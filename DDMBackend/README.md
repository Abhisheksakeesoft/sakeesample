## Project Title

Welcome to the Dynamic Digital Menu

## Installation

 First install node JS latest version and install express to connect frontend.

 Install dependencies as per the modules required using: `npm install`

 Version [ Node-version]- 18.16.0

## Mongodb Connection

 Create connection using mongodb or Mongoose.Current version is 8.1.0
  
## Getting Started

 Start the application: `node index.js`

 Start the application on a specific port  `http://localhost:4100/`

## API Usage

  Here's an explanation of each API :

### Register

 Allows users to register an account.

### Login

 Allows users to log in with their credentials.

### dynamicusertemplate

 The process of taking client data, including company name, imagebase64, and image price, and storing it in MongoDB

### systemTemplate

 In this systemtemplate the data was fetched as per the login details.It fetches the data from collection as per the companyname and it displays all the images in that page.

### CreateUser

 Using the `createUser` API on the client side, a new user account is generated. This data is then sent to the server and stored in MongoDB.

### Users

 By using the `Users` API, new user accounts are established and stored within MongoDB . Additionally, the `Users` API is employed to retrieve this stored data.

### Forgot Password

 Initiates the process of resetting a forgotten password

## NodeMailer
 
 NodeMailer is used to send the mail to the user otp and otp generator is created to send otp
 
###  resetpassword

 Allows users to reset their password.