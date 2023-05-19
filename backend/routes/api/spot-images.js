const express = require('express');
const { Op } = require('sequelize');
const { User, Review, Spot, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next)=>{
    const ownerId = req.user.id;
    const image = await SpotImage.findByPk(req.params.imageId);
    const spots = await Spot.findAll({
        where:{
            ownerId
        }
    });
    let idArray = [];
    for(let i = 0; i< spots.length; i++){
        idArray.push(spots[i].id)
    };
    if(idArray.includes(image.spotId)){
        image.destroy();
        res.json({"message": "Successfully deleted"})
    }else{
        res.json({
            "message": "Spot Image couldn't be found"
          })
    }
})


module.exports = router;