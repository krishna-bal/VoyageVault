const Listing = require("../models/listing");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async(req,res)=>{
    const listings = await Listing.find();
    res.render("listings/index.ejs",{listings});
}

module.exports.renderNewForm = (req,res)=>{
        res.render("listings/new.ejs");
    }

module.exports.createListing = async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
    // return res.send(req.body.listing);
    const newListing = new Listing(req.body.listing); 
    newListing.owner = req.user._id;
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New listing created!");
    res.redirect("/listings"); 
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path :"reviews", populate : {path:"author"}})
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload", "/upload/h_250,w_200");
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing, originalImageUrl})
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
    console.log("updated....",response.body.features[0].geometry)
    
    // let listing = await Listing.findByIdAndUpdate(id,{
    //      title : newListing.title,
    //     description:newListing.description,
    //     image:{
        //         url : newListing.image.url,
        //     },
        //     price : newListing.price,
    //     location : newListing.location,
    //     country : newListing.country,
    // },
    // {
        //     new : true,
        //     runValidators : true,
        // })
        
        //OR
    // let listing = await Listing.findByIdAndUpdate(id,
    //     {$set : newListing},
    //     {
        //         new : true,
    //         runValidators :true
    //     }
    // )
    
    //OR

    let geometry = response.body.features[0].geometry;
    let listing = await Listing.findByIdAndUpdate(id,
        {...req.body.listing, geometry}, //deconstruct
        {
            new : true,
            runValidators :true
        });
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    console.log(listing);
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}

module.exports.filterListing = async (req, res) =>{
    let {category} = req.params;
    let listings = await Listing.find({category : category})
    res.render("listings/index.ejs",{listings});
}