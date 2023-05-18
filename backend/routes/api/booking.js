const express = require('express');
const { Op } = require('sequelize');
const { User, Review, Spot, ReviewImage, Booking  } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();


router.get('/current', requireAuth, async (req, res, next)=>{
    const userId = req.user.id;
    const Bookings = await Booking.findAll({
        where:{
            userId
        },
        attributes:{
            include:["id"]
        },
        include:[
            {
                model: Spot,
                attributes:{
                    exclude:["createdAt", "updatedAt", "description"]
                }
            },
        ],
        
    })
    res.json({Bookings})
});

router.put('/:bookingId', requireAuth, async (req, res, next)=>{
    const userId = req.user.id;
    const booking = await Booking.findAll({
        where:{
            userId
        },
        attributes:["id"]
    });
    const bookingId = req.params.bookingId;

    let idArray = [];
    for(let i = 0; i< booking.length; i++){
        idArray.push(booking[i].id);
    }
    if(idArray.includes(parseInt(bookingId))){
        const newBooking = await Booking.findByPk(bookingId);
        const {startDate, endDate} = req.body;
        newBooking.update({
            startDate,
            endDate
        });
        res.json(newBooking)
    }else{
        res.json({
            "message": "Booking couldn't be found"
        })
    }
});

router.delete('/:bookingId', requireAuth, async (req, res, next)=>{
   const booking = await Booking.findByPk(req.params.bookingId);
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

    if(idArray.includes(parseInt(booking.spotId)) || parseInt(booking.userId === parseInt(req.user.id))){
        booking.destroy();
        res.json({
            "message": "Successfully deleted"
          })
    } else{
        res.json({
            "message": "Booking couldn't be found"
          })
    }
    
})


module.exports = router;