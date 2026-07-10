let mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");
const Schema = mongoose.Schema;   // now instead of mogoose.Schema just write Schema
let listingSchema = new Schema({
    title:{
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    image : {
        filename:{
            type:String,
            default:"listingImage",
        },
        url:{
            type:String,
            default : "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
            set:(v) => v==="" ? "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" : v,
        }
    },
    price : {
        type : Number,
    },
    location : {
        type : String,
    },
    country : {
        type : String,
    },
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : "Review"
    }],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    geometry : {
        type : {
            type : String,
            enum : ['Point'],
        },
        coordinates : {
            type : [Number],
            required : true
        }
    },
    category : {
        type : String,
        enum : ["Villa", "Island", "Rooms", "Arctic", "Amazing  Pools", "Trending", "Farms", "Camping", "Castles", "Mountains", "Iconic Cities"],
        required : true
    }
});


listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;