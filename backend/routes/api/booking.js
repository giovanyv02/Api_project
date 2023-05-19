const express = require('express');
const { Op } = require('sequelize');
const { User, Review, Spot, ReviewImage, Booking  } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

const changeDate = (date)=>{
    return   parseInt(date.split('-').join(""))
  };

  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  
  // This arrangement can be altered based on how we want the date's format to appear.
  let currentDate = `${year}-${month}-${day}`;


router.get('/current', requireAuth, async (req, res, next)=>{
    const userId = req.user.id;
    const Bookings = await Booking.findAll({
        where:{
            userId
        },
        attributes:{
            include:["id"]
        },
        include:
            {
                model: Spot,
                attributes:{
                    exclude:["createdAt", "updatedAt", "description"]
                }
            },
        
        
    })
    res.json({Bookings})
});

router.put('/:bookingId', requireAuth, async (req, res, next)=>{
    const userId = req.user.id;
    const {startDate, endDate} = req.body;
   
if(changeDate(startDate) < changeDate(currentDate)){
    res.status(403);
    res.json({
        "message": "Past bookings can't be modified"
      })
} else if(changeDate(startDate) >= changeDate(endDate)){
    res.status(400);
    res.json({"errors": {
        "endDate": "endDate cannot be on or before startDate"
      }})
} else{

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
        newBooking.update({
            startDate,
            endDate
        });
        res.json(newBooking)
    }else{
        res.status(404)
        res.json({
            "message": "Booking couldn't be found"
        })
    }
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
    if(changeDate(booking.startDate) > changeDate(currentDate)){
        res.status(403);
        res.json({
            "message": "Bookings that have been started can't be deleted"
          })
    } else{

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
            res.status(404);
            res.json({
                "message": "Booking couldn't be found"
              })
        }
    }
    
})


module.exports = router;