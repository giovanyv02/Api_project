const express = require('express');
const { Op } = require('sequelize');
const { User, Review, Spot, ReviewImage  } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.get('/current', async (req, res, next)=>{
    const allReview = await Review.findAll({
        
        where:{
            userId: req.user.id
        },
        include:{
            model: User,
            attributes:["id", "firstName", "lastName"]
        },
        include:{
            model: Spot,
            attributes:["id", "ownerId",  "address", "address", "city", "state", "country", "lat", "lng",
            "name",
            "price",
            "previewImage"]
        },
        include:{
            model: ReviewImage,
            attributes: ['id', "url"]
        }
    })

    res.json({
        allReview
    })
});

router.post('/:reviewId/images', requireAuth, async(req, res, next)=>{
    const userId = req.user.id;
    const review = await Review.findAll({
        where:{
            userId
        },
        attributes:["id"]
    });
    const reviewId = req.params.reviewId

    let idArray = [];
    for(let i = 0; i< review.length; i++){
        idArray.push(review[i].id);
    }

    if(idArray.includes(parseInt(reviewId))){
        const {url} = req.body; 
        const newImage = await ReviewImage.create({
            reviewId,
            url
        });
        res.json({
            "id": newImage.id,
            url
        })
     } else{
        console.log(idArray, reviewId)
        res.json({ "message": "Review couldn't be found"})
    }
});

router.put('/:reviewId', requireAuth, async (req, res, next)=>{
    const userId = req.user.id;
    const review = await Review.findAll({
        where:{
            userId
        },
        attributes:["id"]
    });
    const reviewId = req.params.reviewId

    let idArray = [];
    for(let i = 0; i< review.length; i++){
        idArray.push(review[i].id);
    }
    

    if(idArray.includes(parseInt(reviewId))){
       const newReview = await Review.findByPk(req.params.reviewId);
       const {review, stars} = req.body;
       newReview.update({
        review,
        stars
       });
       res.json({
        "review": newReview
       })
    }else{
        res.json({
            "message": "Review couldn't be found"
        })
    }
} )



module.exports = router;