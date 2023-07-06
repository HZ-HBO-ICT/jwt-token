import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express from "express";

import indexRouter from './routes/validate.js';

const port = process.env.VALIDATE_SERVER_PORT  //We will run this server on a different port i.e. port 5000
const app = express()

app.use(express.json())

app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Validation server running on ${port}...`)
})


