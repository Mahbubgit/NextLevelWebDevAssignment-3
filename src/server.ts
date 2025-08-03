import {Server} from 'http';
import app from './app';
import mongoose from 'mongoose';
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.izigbyf.mongodb.net/library-management-app?retryWrites=true&w=majority&appName=Cluster0`;

let server: Server;

// const PORT = 5000;
const PORT = process.env.PORT || 5000;

async function main() {
try {
    await mongoose.connect(uri);

    console.log("Connected to MongoDB using Mongoose!!");
    server = app.listen(PORT, () =>{
        console.log(`App is listening on port ${PORT}`);
    });
} catch (error) {
    console.log(error);
}    
}

main()