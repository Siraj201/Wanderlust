const listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});




module.exports.index=async (req, res, next) => {
    let listings = await listing.find();
    res.render("listing/index.ejs", { listings });
};


module.exports.renderNewForm=(req, res) => {
    res.render("listing/new.ejs");
};


module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    let listings = await listing.findById(id).populate({ path:"review",populate:{path:"author"}}).populate("owner");
    if(!listings){
        req.flash("error","listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listings });
}


module.exports.createListing=async (req, res, next) => {
    let response=await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit:1,
    }).send();
    let url=req.file.path;
    let filename=req.file.filename;
    let newlisting = new listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry=response.body.features[0].geometry;
    let savedListing=await newlisting.save();
    // console.log(savedListing);
    req.flash("success","new listing created");
    res.redirect("/listings");
};


module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listings = await listing.findById(id);
    if(!listings){
        req.flash("error","listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl=listings.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listing/edit.ejs", { listings ,originalImageUrl});
};


module.exports.updateListing=async (req, res, next) => {
    let { id } = req.params;
    let listings=await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listings.image={url,filename};
        await listings.save();
    }
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    if(! listing){
        req.flash("success","listing deleted")
    }
    res.redirect("/listings");
};