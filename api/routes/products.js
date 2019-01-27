const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth')
const ProductsController = require('../controllers/products');

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

router.get('/', ProductsController.products_get_all);
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);
router.get('/:productId', ProductsController.products_get_product);
router.patch('/:productId', checkAuth, ProductsController.products_patch_product);
router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;