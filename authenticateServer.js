//this will allow us to pull params from .env file
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express from 'express';
const app = express();
const port = process.env.TOKEN_SERVER_PORT     //get the port number from .env file
import indexRouter from './routes/authenticate.js';


app.use(express.json());
app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Authorization Server running on ${port}...`)
})

