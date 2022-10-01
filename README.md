# Authentication Service

RESTful APi system, and developed using Node.js and follows the standard file structure to maintain the code. 
Koa framework has been used to create the server and is backed by the MongoDB for which the schema has been modelled using the Mongoose library.

## Functionality
<li> User Account Registeration. </li>
<li> Account Login with comparing the credentials with the passwords stored in hased format. </li>
<li> Implemented option to OAuth authenticate using Facebook accounts. </li>
<li> Support for two factor authentication by sending the email message to the registered email. </li>
<li> Support for the recaptcha for verify the human interaction </li>
<li> Functionality to maintain the detailed access log of the account login history. </li>
<li> View the logged details such as IP Address, browser detials, OS and device type of the clients. </li>
<li> Supports the multi-factor authentication option to increase the account security.</li>
<li> Allows the users to modify the details </li>

## Running the project. 
This project is developed using Node version 14.20.0 and might not run in the different enviorment because of which the docker file is prepared to provide the isolated enviorment. 
Consider running - so ensure docker and docker-compose is installed on the local machine.

```
    docker-compose up --build
```
The command will use the specification in the docker-compose file and call be modified as per the convenience and requirements of the projects. 

## Contact Information. 
If you want to report any  issues or problem with this project feel free to contact me at contact@sareenv.com OR fork this repository to make the changes.
