const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                orders: docs.map( doc => {
                    return {
                        product: doc.product,
                        quantity: doc.quantity,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
                
            }
            
            res.status(200).json(response);
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then( product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId,
            });

            return order.save()
        })
        .then( result => {
            res.status(201).json({
                message: 'Created order successfully',
                createdOrder: {
                    product: result.product,
                    quantity: result.quantity,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                }
            });
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    res.status(201).json({
        message: 'Order was created!',
        order: order
    });
}

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('product quantity _id')
        .populate('product', 'name price')
        .exec()
        .then( order => {
            if (order) {
                res.status(200).json({
                    order: order,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + order.product._id
                    }
                });
            } else {
                res.status(404).json({
                    message: 'Not a valid entry for provided ID'
                })
            }
        })
        .catch( err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.orders_delete_order = (req, res, next) => {
    Order.remove( { _id: req.params.orderId } )
        .exec()
        .then( result => {
            res.status(200).json({
                message: 'Order deleted!'
            });
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}