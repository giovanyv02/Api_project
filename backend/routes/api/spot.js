const express = require('express');
const {sequelize} = require('sequelize');
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

        const allSpot = await Spot.findAll({
            limit: size,
            offset: size * (page - 1),
            
        });
        
        // const avgR = await Review.findAll({
        //     attributes: ["spotId", [fn("AVG", col("stars")), "avgRating"]],
        //     group: ["spotId"],
        //     where:
        //   });


        res.json({
            "Spots": allSpot,
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
        }
    });
    res.json({"Spots": spot})
});

router.get('/:spotId', async (req, res)=>{
    const spot = await Spot.findByPk(req.params.spotId,{
        include:{
            model: SpotImage,
            attributes:{
                exclude:["createdAt", "updatedAt"]
            }
        }
    });
    if(!spot){
        res.status(404);
        res.json({"message": "Spot couldn't be found"})
    }else{

        res.json(spot)
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
    if(!Reviews[0]){
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
        // const booking = await Booking.findAll({
        //     where:{
        //         spotId: req.params.spotId
        //     },
        //     attributes:["startDate", "endDate"]
        // });
        // let obj = {message:"Sorry, this spot is already booked for the specified dates" }
        // for(let i=0; i< booking.length; i++){
        //     let stat = booking[i].startDate;
        //     console.log(booking)
        //     console.log(stat)
        //     stat = stat.slice(1, 8)
        //     let end = booking[i].endDate.slice(0,10) ;
        //     if(changeDate(startDate) > changeDate(stat) && changeDate(startDate) < changeDate(end)){
        //        obj.startDate = "Start date conflicts with an existing booking";
        //     }if(changeDate(endDate) > changeDate(end) && changeDate(endDate) < changeDate(end)){         
        //        obj.endDate = "End date conflicts with an existing booking";
        //     }
        // }
        // if(obj.startDate || obj.endDate){
        //     res.status(403);
        //     req.json(obj);
        // }else
      //  {

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
                    res.json(newBooking);
                }
                
            } catch(error){
                res.status(404);
                res.json({
                    "message": "Spot couldn't be found"
                  })
            }
      //  }
    }
})

module.exports = router;
