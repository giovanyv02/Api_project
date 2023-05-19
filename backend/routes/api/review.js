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
    const reviewId = req.params.reviewId
    const countRev = await ReviewImage.count({
        where:{
            reviewId
        }
    });
    if(countRev >= 10){
        res.status(403);
        res.json({
            "message": "Maximum number of images for this resource was reached"
          })
    }else{

        const review = await Review.findAll({
            where:{
                userId
            },
            attributes:["id"]
        });
    
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
            res.status(404)
            res.json({ "message": "Review couldn't be found"})
        }
    }
});

router.put('/:reviewId', requireAuth, async (req, res, next)=>{
    const userId = req.user.id;
    const {review, stars} = req.body;
    if(stars < 1 || stars > 5 || !review){
        res.status(400);
        if(stars < 1 || stars > 5){
            res.json({"error":{"stars": "Stars must be an integer from 1 to 5"}})
         };
           if(!review){
         
             res.json({"error":{"review": "Review text is required"}})
            }
   }else{
    
       const reviews = await Review.findAll({
           where:{
               userId
           },
           attributes:["id"]
       });
       const reviewId = req.params.reviewId
       
       let idArray = [];
       for(let i = 0; i< reviews.length; i++){
           idArray.push(reviews[i].id);
       }
       
       
       if(idArray.includes(parseInt(reviewId))){
          const newReview = await Review.findByPk(req.params.reviewId);
          newReview.update({
           review,
           stars
          });
          res.json( newReview
          )
       }else{
           res.status(404)
           res.json({
               "message": "Review couldn't be found"
           })
       }
   }
} );

router.delete('/:reviewId', requireAuth, async (req, res, next)=>{
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
       const deleR = await Review.findByPk(req.params.reviewId);
        deleR.destroy();
        res.json({
            "message": "Successfully deleted"
        })
    } else{
        res.status(404);
        res.json({
            "message": "Review couldn't be found"
        })
    }
})



module.exports = router;