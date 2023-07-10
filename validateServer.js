//this will allow us to pull params from .env file
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express from 'express';
const app = express();
const port = process.env.VALIDATE_SERVER_PORT  //We will run this server on a different port i.e. port 5000
import indexRouter from './routes/validate.js';

app.use(express.json());
app.use('/', indexRouter);
app.listen(port, () => {
    console.log(`Validation server running on ${port}...`)
})


