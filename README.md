# Authentication Service

The Authentication APi system, the system is written in Node.js and follows the standard file structure to maintain the code. 
Koa framework has been used to create the server and is backed by the MongoDB for which the schema has been modelled using the Mongoose library.

## Functionality
<li> User Account Registeration. </li>
<li> Account Login with comparing the credentials with the passwords stored in hased format. </li>
<li> Implemented option to authenticate using Facebook accounts. </li>
<li> Support for two factor authentication by sending the email message to the registered email. </li>
<li> Support for the recaptcha </li>
<li> Functionality to maintain the detailed access log of the account login history. </li>
<li> View the logged details such as IP Address, browser detials, OS and device type of the clients to derive client insights </li>
<li> Allows the users to modify the details </li>
