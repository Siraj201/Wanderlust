const express=require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
let { reviewschema } = require("../schema.js");
const listing = require("../models/listing.js");
const review=require("../models/review.js");
const router = express.Router({ mergeParams: true });
const{validatereview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");





// create reviews
// router.post("/",isLoggedIn, validatereview,wrapAsync(async(req,res)=>{
//     let listings=await listing.findById(req.params.id);
//     let newreview=new review(req.body.review);
//     newreview.author=req.user._id;
//     listings.review.push(newreview);
//     await newreview.save();
//     await listings.save();
//     console.log("new review saved");
//     req.flash("success","new review created");
//     res.redirect(`/listings/${listings._id}`);
// }));



router.post("/",isLoggedIn, validatereview,wrapAsync(reviewController.createReview));




//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;


