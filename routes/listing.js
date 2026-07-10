if(process.env.NODE_ENV!="production"){
    require("dotenv").config(); 
}
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing  = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { populate } = require("../models/review.js");
const listingController = require("../controllers/listing.js")
const multer = require("multer");
const {storage}= require("../cloudConfig.js")
const upload = multer({storage});


router
.route("/")
// INDEX ROUTE ----------------
.get(wrapAsync(listingController.index))
// -------------- CREATE ROUTE -------------------
.post(isLoggedIn,validateListing,upload.single('listing[image][url]'),  wrapAsync(listingController.createListing));




// -------------- NEW ROUTE --------------------

// should be placed before show route as both have get request on /listings and then have (/:id and /new) 
// if placed below /:id --> cast error 
// { 
    //      Express checks routes top to bottom.
    //      The first matching route wins. 
    // }
    // Always put fixed routes before dynamic routes [Static routes → Dynamic routes → Catch-all routes]
    
router.get("/new", isLoggedIn, listingController.renderNewForm)


router
.route("/:id")
// -------------- SHOW ROUTE -------------------
.get(wrapAsync(listingController.showListing))
// --------------- UPDATE ROUTE ------------------
.put(isLoggedIn, isOwner, validateListing, upload.single('listing[image][url]'), wrapAsync(listingController.updateListing))
// ---------------- DELETE ROUTE ----------------
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))


// --------------- EDIT ROUTE -------------------

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

// ------------- FILTER ROUTE ---------------

router.get("/filter/:category", wrapAsync(listingController.filterListing))
 
module.exports = router;

