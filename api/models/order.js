const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', requires: true },
    quantity: { type: Number, default: 1, requires: false }
});

module.exports = mongoose.model('Order', orderSchema);