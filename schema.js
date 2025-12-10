const Jio = require("joi");

module.exports.listingSchema = Jio.object({
  listing: Jio.object({
    title: Jio.string().required(),
    description: Jio.string().required(),
    image: Jio.string().allow("", null),
    price: Jio.number().required().min(0),
    country: Jio.string().required(),
    location: Jio.string().required(),
  }).required(),
});

module.exports.reviewSchema = Jio.object({
  review:Jio.object({
    rating:Jio.number().required(),
    comment:Jio.string().required()
  }).required()
});