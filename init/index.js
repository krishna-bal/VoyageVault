const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
async function main(){
    await  mongoose.connect(MONGO_URL);
}

main()
.then((res)=> console.log("Radhe Radhe connected to DB"))
.catch((err)=>console.log("Radhe Radhe err"));


const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((d)=>({...d, owner : "69bd2e752b0db6f0b97ad1cb"}));
    await Listing.insertMany(initData.data);
    console.log("Radhe Radhe data is initialized");
}
initDB(); 
