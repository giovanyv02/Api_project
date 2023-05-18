const express = require('express');
const {} = require('sequelize');
const {User, Spot, SpotImage, Review, ReviewImage, Booking} = require("../../db/models");
const router = express.Router();
const { fn, col } = require("sequelize");
const {requireAuth} = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validate = [
    check('address')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage("Street address is required"),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required.'),
      check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
      check('country')
      .exists({ checkFalsy: true })
      .withMessage('counttry is required'),
      check('lat')
      .exists({ checkFalsy: true })
      .withMessage('Latitude is not valid'),
      check('lng')
      .exists({ checkFalsy: true })
      .withMessage('Longitude is not valid'),
      check('name')
      .exists({ checkFalsy: true })
      .withMessage('Name must be less than 50 characters'),
      check('description')
      .exists({ checkFalsy: true })
      .withMessage('description is required'),
      check('price')
      .exists({ checkFalsy: true })
      .withMessage('Price per day is required'),
    handleValidationErrors
  ];

router.get(
    '/', async(req, res, next)=>{
        let { page, size } = req.query;
  
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(size) || size < 1) size = 20;
        page = parseInt(page);
        size = parseInt(size);

        const allSpot = await Spot.findAll();

        const avgR = await Review.findAll({
            attributes: ["spotId", [fn("AVG", col("stars")), "avgRating"]],
            group: ["spotId"],
            limit: size,
            offset: size * (page - 1),
          });


        res.json({
            Spots: allSpot,
            avgR
        })
    }
);

router.post("/:spotId/images", requireAuth, async (req, res, next)=>{
    const userId = req.user.id;
    const spot = await Spot.findAll({
        where:{
            ownerId: userId
        },
        attributes: ['id']
    });
    const spotId = req.params.spotId
    // console.log(spotId)
    
    let idArray = [];
    for(let i = 0; i< spot.length; i++){
        idArray.push(spot[i].id);
    }
    // console.log(idArray.includes)
     if(idArray.includes(parseInt(spotId))){
        const {url, preview} = req.body;
        
        const newImage = await SpotImage.create({
            spotId, 
            url,
            preview
        })

        res.json({
            id: newImage.id,
            url,
            preview
        })
     }
        
        else{
            
            res.json({
                "message": "spot couldn't be found"
            })
        }
});

router.post('/',validate, requireAuth, async (req, res, next)=>{
   const ownerId = req.user.id;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    console.log(req.body);
    const newSpot = await Spot.create({
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });
   
    res.json({newSpot});
});

router.put('/:spotId',validate, requireAuth, async (req, res, next)=>{
    const userId = req.user.id;
    const spot = await Spot.findAll({
        where:{
            ownerId: userId
        },
        attributes: ['id']
    });
    const spotId = req.params.spotId
    // console.log(spotId)
    
    let idArray = [];
    for(let i = 0; i< spot.length; i++){
        idArray.push(spot[i].id);
    }
    // console.log(idArray.includes)
     if(idArray.includes(parseInt(spotId))){
         const spotToUp = await Spot.findByPk(req.params.spotId); 
        const {address, city, state, country, lat, lng, name, description, price} = req.body;
        spotToUp.update({
            address,
             city, 
             state, 
             country,
              lat, 
              lng, 
              name, 
              description,
               price
        });
        res.json({
            "spot":spotToUp
        })
     }else{
        res.json({
            "message": "spot couldn't be found"
        })
     }
});
router.delete('/:spotId', requireAuth, async (req, res, next)=>{
    const userId = req.user.id;
    const spot = await Spot.findAll({
        where:{
            ownerId: userId
        },
        attributes: ['id']
    });
    const spotId = req.params.spotId
    // console.log(spotId)
    
    let idArray = [];
    for(let i = 0; i< spot.length; i++){
        idArray.push(spot[i].id);
    }
    // console.log(idArray.includes)
     if(idArray.includes(parseInt(spotId))){
         const spotToDele = await Spot.findByPk(req.params.spotId); 
        await spotToDele.destroy();

        res.json({
            "message": "Successfully deleted"
        })
     } 
     else{
        res.json({
            "message": "Spot couldn't be found"
          })
     }
});

router.get('/:spotId/reviews', async (req, res, next)=>{
    const spotId = req.params.spotId;
    const Reviews = await Review.findAll({
        where:{
            spotId
        },
        include: User,
        include:{
            model: ReviewImage,
            attributes: ["id", "url"]
        }
    })
    if(!Review[0]){
        res.json({
            "message": "Spot couldn't be found"
          })
    }
    res.json({Reviews})
});

router.post('/:spotId/reviews', requireAuth,async (req, res)=>{
    const spotId = req.params.spotId;
    const userId = req.user.id;
    const {review, stars} = req.body;
    const newReview = await Review.create({
        spotId,
        userId,
        review,
        stars
    })
    res.json({
        newReview
    })
});

router.get('/:spotId/bookings', requireAuth, async (req, res, next)=>{
    const spotId = req.params.spotId;
    const owner = await Spot.findByPk(spotId)
    if(owner.ownerId === req.user.id){
        const Bookings = await Booking.findAll({
            where:{
               spotId 
            },
            include:[{
                model: User,
                attributes:["id", "firstName", "lastName"]
            }]
        });
        res.json({Bookings})
    }else{
        const Bookings = await Booking.findAll({
            where:{
                spotId
            },
            attributes:["spotId", "startDate", "endDate"]
        });
        res.json({Bookings})
    }
 // res.json({"owner":owner.ownerId, "true or false": owner.ownerId === req.user.id, "userId": req.user.id}) 
});

router.post('/:spotId/bookings', requireAuth, async (req, res, next)=>{
    const userId = req.user.id;
    const spot = await Spot.findAll({
        where:{
            ownerId: userId
        },
        attributes: ['id']
    });
    const spotId = req.params.spotId
    // console.log(spotId)
    
    let idArray = [];
    for(let i = 0; i< spot.length; i++){
        idArray.push(spot[i].id);
    };
    if(!idArray.includes(parseInt(spotId))){
        const {startDate, endDate} = req.body;
      const  newBooking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate
        });
        res.json(newBooking);
    }
})

module.exports = router;
