const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth'); // Assuming you have JWT middleware
const upload = require('../middleware/multer'); // Import the multer instance

// Register User
router.post('/register', authController.register);

// Login User
router.post('/login', authController.login);

// Get User Data (Protected)
router.get('/user', authMiddleware, authController.getUser);

// Upload Profile Image (Protected)
router.post('/profile/upload', authMiddleware, upload.single('profileImage'), authController.uploadProfile);

// Upload Gallery Photo (Protected)
router.post('/gallery/upload', authMiddleware, upload.single('galleryPhoto'), authController.uploadGallery);

// Toggle Favorite Song (Protected)
router.put('/favorites/:id', authMiddleware, authController.toggleFavorite);

// Delete Photo from Gallery (Protected)
router.delete('/gallery/delete', authMiddleware, authController.deleteGallery);

module.exports = router;