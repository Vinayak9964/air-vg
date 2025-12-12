const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const Listing = require("../model/listing.js");

const validateListing = (req,res,next)=>{
  let{error} = listingSchema.validate(req.body);
  if(error){
    let errmsg = error.details.map((el) => el.message.join(","));
    throw new ExpressError(400,error);

  }else{
    next();
  }
};

//index route
router.get("/",wrapAsync(async(req,res)=>{
  const alllistings = await Listing.find({});
  res.render("listing/index.ejs",{alllistings})
}));
//new route
router.get("/new",(req,res)=>{
  res.render("listing/new.ejs");
})
//show route
router.get("/:id",async(req,res)=>{
   const {id} = req.params;
   const listing = await Listing.findById(id).populate("reviews");
   res.render("listing/show.ejs",{listing});
}); 
router.post("/",validateListing,
  wrapAsync(async(req,res,next)=>{
  const newlisting = new Listing( req.body.listing);
  await newlisting.save();
  console.log(newlisting);
  res.redirect("/listings")
  
})
);
//edit route
router.get("/:id/edit", wrapAsync(async(req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs",{listing});
}));

//update route
router.put("/:id",validateListing,
  wrapAsync(async(req,res)=>{
  const {id} = req.params;
  const Listings = await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id", async(req,res)=>{
  const {id} = req.params;
  listdelete = await Listing.findByIdAndDelete(id);
  console.log(listdelete);
  res.redirect("/listings");

});
module.exports = router;