const mongoose = require('mongoose');

// Define the schema for the Product model
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    availableQuantity: {
        type: Number,
        required: true,
    },
    /*category: {
        type: String,
        required: true,
    },*/
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
    ],
});

// Create a text index on the 'title' field
productSchema.index({ title: 'text' });

// Create the Product model based on the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
