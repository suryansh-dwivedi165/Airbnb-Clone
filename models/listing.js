const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type:String,
        required:true,
    },
    description:String,
image: {
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1773332585754-f1436987743b?q=80&w=870&auto=format&fit=crop"
    }
}, 
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
        type:String,
        enum:['Point']
    },
    coordinates: {
        type:[Number],
        requires:true
    },
    category: {
        type:String,
        enum:["mountains", "arctic", "farms", "deserts"],
    }
}) 

listingSchema.post("findONeAndDelete", async(listing) => {
    if(lsiting) {
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
}); 

const Listing = mongoose.model("Listing", listingSchema); 

module.exports = Listing;              