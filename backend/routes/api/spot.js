const express = require('express');
const {sequelize} = require('sequelize');
const {User, Spot, SpotImage, Review, ReviewImage, Booking} = require("../../db/models");
const router = express.Router();
const { fn, col, Op } = require("sequelize");
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

        const allSpot = await Spot.findAll({
            include:[{
                model: SpotImage
            },
            {
                model: Review
            }],
            limit: size,
            offset: size * (page - 1),
            
        });
        
        // const avgR = await Review.findAll({
        //     attributes: [ [fn("AVG", col("stars")), "avgRating"]],
        //     group: ["spotId"],
        // });
 
        // ell = [];
        // avgR.forEach(ele=>{
        //     ell.push(ele.toJSON())
        // })
        // console.log("anmwyyy",ell[0].avgRating)
        // for(let i = 0; i < ill.length; i++){
        //     ill[i].avgRating = ell[i].avgRating;  
        // };
        ill = [];
        allSpot.forEach(element => {
            ill.push(element.toJSON())
        });

        ill.forEach(eles=>{
            let total = eles.Reviews
            if(total[0]){

                let sum = 0;
                for(let i = 0; i < total.length; i++){
                    sum +=total[i].stars
                }
                sum /= total.length
                eles.avgRating = sum;
            }
            //     (a.stars + b.stars)
            // })
            eles.SpotImages.forEach(image=>{
                eles.previewImage = image.url;
            });
            delete eles.SpotImages;
            delete eles.Reviews
        })

        

        res.json({
            "Spots": ill,
            page,
            size
        })
    }
);

router.get('/current', requireAuth, async (req, res)=>{
    const ownerId = req.user.id;
    const spot = await Spot.findAll({
        where:{
            ownerId
        },
        include:[
            {
                model: SpotImage
            },
            {
                model: Review
            }
        ]
    });
    // allOwnerSpot = [];
    // spot.forEach(ele=>{
    //     allOwnerSpot.push(ele.id)
    // });
    
    // const avgR = await Review.findAll({
    //     where:{
    //         spotId:{
    //             [Op.in]: allOwnerSpot
    //         }
    //     },
    //     attributes: [ [fn("AVG", col("stars")), "avgRating"]],
    //     group: ["spotId"],
    // });

    // const spotImage = await SpotImage.findAll({
    //     where:{
    //         spotId:{
    //             [Op.in]: allOwnerSpot
    //         }
    //     },
    // })

    // ell = [];
    // avgR.forEach(ele=>{
    //     ell.push(ele.toJSON())
    // })
    ill = [];
    spot.forEach(element => {
        ill.push(element.toJSON())
    });
    // for(let i = 0; i < ill.length; i++){
    //     ill[i].avgRating = ell[i].avgRating;
    //     ill[i].previewImage = spotImage[i].url;
        
    // };
    ill.forEach(eles=>{
        let total = eles.Reviews
        if(total[0]){

            let sum = 0;
            for(let i = 0; i < total.length; i++){
                sum +=total[i].stars
            }
            sum /= total.length
            eles.avgRating = sum;
        }
        //     (a.stars + b.stars)
        // })
        eles.SpotImages.forEach(image=>{
            eles.previewImage = image.url;
        });
        delete eles.SpotImages;
        delete eles.Reviews
    })
    
    res.json({"Spots": ill})
});



router.get('/:spotId', async (req, res)=>{
    const spot = await Spot.findByPk(req.params.spotId);
    if(!spot){
        res.status(404);
        res.json({"message": "Spot couldn't be found"})
    }else{
        const spotImage = await SpotImage.findAll({
            where:{
                spotId: spot.id
            },
            attributes:["id", "url", "preview"]
        })
        const owner = await User.findByPk(spot.ownerId,{
            attributes:["id", "firstName", "lastName"]
        });
        const numreview = await Review.count({
            where:{
                spotId: spot.id
            }
        });
        const avgR = await Review.findAll({
            where:{
                spotId: spot.id
            },
            attributes: [ [fn("AVG", col("stars")), "avgRating"]],
            
        });
        console.log("spot", spot.ownerId,)
        const spat = spot.toJSON();
        const avg = avgR[0].toJSON();
        spat.numReviews = numreview;
        spat.avgStarRating = avg.avgRating;
        spat.SpotImages = spotImage;
        spat.Owner = owner;
        // console.log(numreview,spat,)
        res.json(spat)
    }
});

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
            res.status(404)
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
   res.status(201)
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
        res.status(404);
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
        res.status(404)
        res.json({
            "message": "Spot couldn't be found"
          })
     }
});

router.get('/:spotId/reviews', async (req, res, next)=>{
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId)
    const Reviews = await Review.findAll({
        where:{
            spotId
        },
        include:[{
            model: User,
            attributes:["id", "firstName", "lastName"]
        },
        {
            model: ReviewImage,
            attributes:["id", "url"]
        }
    ]
    })
    if(!spot){
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
          })
    }
    res.json({Reviews})
});



router.post('/:spotId/reviews', requireAuth, async (req, res)=>{
    const spotId = req.params.spotId;
    const userId = req.user.id;
    const userRev = await Review.findOne({
        where:{
            spotId,
            userId
        }
    });
    
    if(userRev){
        res.status(500);
        res.json({
            "message": "User already has a review for this spot"
          })
    }else{
    const {review, stars} = req.body;
   if(stars < 1 || stars > 5){
    res.status(400);
    res.json({"error":{"stars": "Stars must be an integer from 1 to 5"}})
   }
   if(!review){
    res.status(400);
    res.json({"error":{"review": "Review text is required"}})
   }else{

       try{
           const newReview = await Review.create({
               spotId,
               userId,
               review,
               stars
           });
          res.status(201)
           res.json(
               newReview
           )
             } catch(error){
               res.status(404);
               res.json({
                   "message": "Spot couldn't be found"
                 })
             }
   }
}
});

router.get('/:spotId/bookings', requireAuth, async (req, res, next)=>{
    const spotId = req.params.spotId;
    const owner = await Spot.findByPk(spotId)
    if(!owner){
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
          });
    }else{

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
    }
 // res.json({"owner":owner.ownerId, "true or false": owner.ownerId === req.user.id, "userId": req.user.id}) 
});

const changeDate = (date)=>{
  return   parseInt(date.split('-').join(""))
}


router.post('/:spotId/bookings', requireAuth, async (req, res, next)=>{
    const userId = req.user.id;
    const {startDate, endDate} = req.body;
    if(changeDate(startDate) >= changeDate(endDate)){
        res.status(400);
        res.json({"errors": {
            "endDate": "endDate cannot be on or before startDate"
          }})
    }else{
        const booking = await Booking.findAll({
            where:{
                spotId: req.params.spotId
            },
            attributes:["startDate", "endDate"]
        });
        let obj = {message:"Sorry, this spot is already booked for the specified dates" }
           let bookingJ = [];
            booking.forEach(ele=>{
                bookingJ.push(ele.toJSON())
       })
        for(let i=0; i< bookingJ.length; i++){
            let stat = bookingJ[i].startDate;
            stat = stat.slice(0, 10)
            
            let end = bookingJ[i].endDate.slice(0,10) ;
          
            if(changeDate(startDate) >= changeDate(stat) && changeDate(startDate) <= changeDate(end)){
               obj.startDate = "Start date conflicts with an existing booking";
            }if(changeDate(endDate) >= changeDate(end) && changeDate(endDate) <= changeDate(end)){         
               obj.endDate = "End date conflicts with an existing booking";
            }
        }
        if(obj.startDate || obj.endDate){
            res.status(403);
            res.json(obj);
        }else
       {

            // res.json(booking)
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
            try{
                if(!idArray.includes(parseInt(spotId))){
                  const  newBooking = await Booking.create({
                    spotId,
                    userId,
                    startDate,
                    endDate
                    });
                    const deookings = await Booking.findOne({
                        where:{
                            userId,
                            spotId,
                            startDate:{
                                [Op.startsWith]: startDate
                            },
                            endDate:{
                                [Op.startsWith]: endDate
                            }
                        },
                        attributes:{
                            include:["id"]
                        },
                    });
                    
                    res.json(deookings);
                }else{
                    res.status(403);
                    res.json({"message": "sorry you can't book your own place"})
                }
                
            } catch(error){
                res.status(404);
                res.json({
                    "message": "Spot couldn't be found"
                  })
            }
       }
    }
})

module.exports = router;
