const express = require("express");
const router = express.Router({mergeParams:true });
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const review = require("../model/review.js");

const validateReview = (req,res,next)=>{
  let{error} = reviewSchema.validate(req.body);
  if(error){
    let errmsg = error.details.map((el) => el.message.join(","));
    throw new ExpressError(400,error);

  }else{
    next();
  }
}
//review route
//post
router.post("/listings/:id/review",validateReview,wrapAsync(async(req,res,next)=>{
  let listing = await Listing.findById(req.params.id);
let newrev = new Review(req.body.review);

listing.reviews.push(newrev);  // works only if schema has reviews: []

  await newrev.save();
  await listing.save();

  
  res.redirect(`/listings/${listing._id}`)
}));
//delete review 
router .delete("/listings/:id/review/:reviewId", async (req, res) => {
    let { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
});

module.exports = review;