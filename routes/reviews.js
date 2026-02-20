const express = require('express');
const { 
    getReviews,
    getReview,
    createReview,
    // updateReview,
    // deleteReview
} = require('../controllers/reviews');

const Review = require('../models/Review');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedresults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(advancedResults(Review, {
        path: 'bootcamp',
        select: 'name description'
        
    }), getReviews)
    .post(protect, authorize('admin', 'user'), createReview);

router
    .route('/:id')
    .get(getReview)
//     .put(updateReview)
//     .delete(deleteReview);

module.exports = router;