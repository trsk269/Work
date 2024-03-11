const mongoose =require("mongoose");
const connect = mongoose.connect("mongodb://localhost:/Let'sEat");

connect.then(()=>{
    console.log("database connected successfully");
})

.catch(()=>{
    console.log("connected");
});

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cartItems: [{
        type: mongoose.Schema.Types.ObjectId, // Assuming you store product IDs in the cart
        ref: 'Product'
    }],
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId, // Assuming you store order IDs in the history
        ref: 'Order'
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId, // Assuming you store product IDs in the wishlist
        ref: 'Product'
    }],
    visits: {
        type: Number,
        default: 0
    },
    // Add more fields as needed
});

const collection = new mongoose.model("users", LoginSchema);

const ProductSchema = new mongoose.Schema({
    product_id: {
        type: String, // Assuming product_id is of type String
        required: true,
        unique: true // Ensures uniqueness
    },
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_category: {
        type: String,
        required: true
    },
    product_Image: {
        type: String,
        required: true
    },
    product_availability: {
        type: String,
        required: true
    },
    product_description: { // Fixed a typo in field name
        type: String,
        required: true
    }
});

const Product = new mongoose.model("product", ProductSchema);

module.exports = {collection, Product};
