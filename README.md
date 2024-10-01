# JWT Token Project

This project demonstrates the implementation of JSON Web Tokens (JWT) for authentication and authorization in a web application.

It is an implementation of the following article:
https://medium.com/@prashantramnyc/authenticate-rest-apis-in-node-js-using-jwt-json-web-tokens-f0e97669aad3

## Features

- User authentication with JWT
- Token-based authorization
- Secure password storage
- Token expiration and renewal

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/jwt-token.git
    ```
2. Navigate to the project directory:
    ```sh
    cd jwt-token
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the authentication server: 
    ```sh
    npm run authenticateServer
    ```
2. Access the application at `http://localhost:4000`.
3. POST localhost:4000/user ({"name":"name","password":"password"} in Body )
4. POST localhost:4000/login ({"name":"name","password":"password"} in Body )



## License

This project is licensed under the MIT License. 