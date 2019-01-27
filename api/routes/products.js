const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth')

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        // ignore a file
        cb(null, false);
    } else {
        // store a file
        cb(null, true)
    }

    // != null => throws error
}

const upload = multer( {
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                products: docs.map( doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
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
});

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    var image_path = undefined;
    console.log("File:" + req.file);
    if (req.file != undefined) {
        console.log("Huray");
        image_path = "http://localhost:3000/" + req.file.path;
    }

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: image_path
    });

    product
        .save()
        .then( result => {
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then( doc => {
            if (doc) {
                res.status(200).json({
                    product: doc
                });
            } else {
                res.status(404).json({
                    message: 'Not a valid entry for provided ID'
                })
            }
            
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }

    Product.update( { _id: id }, { $set: updateOps } )
        .exec()
        .then( result => {
            res.status(200).json({
                message: 'Product updated!',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/product/' + id
                }
            });
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product.remove( { _id: id } )
        .exec()
        .then( result => {
            res.status(200).json({
                message: 'Product deleted!'
            });
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;