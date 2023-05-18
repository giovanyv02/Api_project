const express = require('express');
const { Op } = require('sequelize');
const { User, Review, Spot, ReviewImage  } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.delete('/:imageId', requireAuth, async(req, res, next)=>{
    const userId = req.user.id;
    const image = await ReviewImage.findByPk(req.params.imageId);
    const reviews = await Review.findAll({
        where:{
            userId
        }
    });
    let idArray = [];
    for(let i = 0;  i < reviews.length; i++){
        idArray.push(reviews[i].id)
    };
    if(idArray.includes(image.reviewId)){
        image.destroy();
        res.json({
            "message": "Successfully deleted"
          })
    }else{
        res.status(404);
        res.json({
            "message": "Review Image couldn't be found"
          })
    }
})


module.exports = router;