const express = require("express");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isReviewOwner, isLoggedIn} = require("../middleware.js");
const router = express.Router({mergeParams : true}); // to access params from parent route (listing.js)

const reviewController = require("../controllers/review.js")

// --------- POST REVIEW ROUTE -------------


/* 
Although we can send a request to /reviews (which is also valid), it is not clear 
which listing the review belongs to unless we pass the listing ID in the query string.

Since our schema follows a one-to-many (1:N) relationship where a review is 
dependent on a listing, we send the request to:

/listings/:id/reviews

This way, the listing ID is already available in the URL itself.
*/

router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview))



// ------- DELETE REVIEW ROUTE -------------

router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.destroyReview))

module.exports = router;