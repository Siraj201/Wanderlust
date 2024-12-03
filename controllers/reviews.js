const review=require("../models/review");
const listing=require("../models/listing");

module.exports.createReview=async(req,res)=>{
    const {id}=req.params;
    let listings=await listing.findById(req.params.id);
    let newreview=new review(req.body.review);
    newreview.author=req.user._id;
    listings.review.push(newreview);
    await newreview.save();
    await listings.save();
    console.log("new review saved");
    req.flash("success","new review created");
    res.redirect(`/listings/${listings._id}`);
}

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`)
}