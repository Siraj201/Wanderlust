const listing=require("./models/listing.js");
const expressError=require("./utils//expressError.js");
const {listingschema,reviewschema}=require("./schema.js");
const review = require("./models/review.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listings=await listing.findById(id);
    if(! listings.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validatelisting = (req, res, next) => {
    let { error } = listingschema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(404, errMsg);
    } else {
        next();
    }
};

module.exports.validatereview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(404, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
let reviews=await review.findById(reviewId);
if(!reviews.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this review");
    return res.redirect(`/listings/${id}`);
}
next();
}