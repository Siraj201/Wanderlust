const express=require("express");
// const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
let { listingschema,reviewschema } = require("../schema.js");
const listing = require("../models/listing.js");
const router = express.Router({ mergeParams: true });
const {isLoggedIn, isOwner,validatelisting}=require("../middleware.js");
const multer=require("multer");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});



const listingController=require("../controllers/listings.js");


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),  wrapAsync(listingController.createListing));


//new route
router.get("/new",isLoggedIn, isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


// edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));



module.exports=router;