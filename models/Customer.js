const mongoose = require("mongoose");

const CreateCustomareSchema = new mongoose.Schema({
    companyname: String,
    email : String,
    contactname:String,
    phone: String,
    Currency: String,
    websitename: String,
    Country: String,
    city: String,
    address: String,
    street: String,
    billingphoneNo:String,
    town:String,
    location:String
})

const CreateCustomerModel = mongoose.model("CustomerTB",CreateCustomareSchema)
module.exports = CreateCustomerModel;
