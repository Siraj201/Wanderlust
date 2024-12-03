const mongoose=require("mongoose");
var schema=mongoose.Schema;
const review=require("./review.js");
const listingschema=new schema({
    title:{
        type:String,
        required:true,
    },
     description:{
        type:String,
    },
    image:{
        url:String,
        filename:String
    },
    price:Number,
    location :String,
    country:String,
    review:[{
        type:schema.Types.ObjectId,
        ref:"review"
    }],
    owner:{
        type:schema.Types.ObjectId,
        ref:"user"
    },
    geometry:{
        type:{
            type:String,
             enum:['Point'],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    category:{
        type:String,
        enum:["mountains","domes","trending","rooms","iconic-cities","castles","amazing-pools","camping","farms","arctic-pools","snow","boat"]
    }
});

listingschema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.review}});
    }
})
const listing=mongoose.model("listing",listingschema);
module.exports=listing;