const express = require('express');
const { Op } = require('sequelize');
const { User, Review, Spot, ReviewImage, Booking, SpotImage  } = require('../../db/models');
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
  let currentDate = `${year}-${0}${month}-${day}`;


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
        
        
    });
    const bookingJ = [];
    Bookings.forEach(element => {
        bookingJ.push(element.toJSON())
    });  
    
    for(let i = 0; i < bookingJ.length; i++){
        let preview = await SpotImage.findOne({
            where:{
                spotId: bookingJ[i].spotId
            }
        });
        
        bookingJ[i].Spot.previewImage = preview.toJSON().url;
    }

    res.json({bookingJ})
});

router.put('/:bookingId', requireAuth, async (req, res, next)=>{
    const userId = req.user.id;
    const {startDate, endDate} = req.body;
   
// if(changeDate(startDate) < changeDate(currentDate)){
//     res.status(403);
//     res.json({
//         "message": "Past bookings can't be modified"
//       })
// } else
 if(changeDate(startDate) >= changeDate(endDate)){
    res.status(400);
    res.json({"errors": {
        "endDate": "endDate cannot be on or before startDate"
      }})
} else{ 
    const spotB = await Booking.findOne({
        where:{
            id: req.params.bookingId
        },
        attributes:{
            include:["id"]
        }
    });
   if(spotB){
    const booking = await Booking.findAll({
        where:{
            spotId: spotB.spotId,
            id:{
                [Op.not]: req.params.bookingId
            }
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
    }
    

    const bookingb = await Booking.findAll({
        where:{
            userId
        },
        attributes:["id"]
    });
    const bookingId = req.params.bookingId;
    
    let idArray = [];
    for(let i = 0; i< bookingb.length; i++){
        idArray.push(bookingb[i].id);
    }
    if(idArray.includes(parseInt(bookingId))){
       // const newBooking = await Booking.findByPk(bookingId);
        spotB.update({
            startDate,
            endDate
        });
        console.log(spotB)
        res.json(spotB)
    }else{
        res.status(404)
        res.json({
            "message": "Booking couldn't be found"
        })
    }

   }else{
    res.status(404)
    res.json({
        "message": "Booking couldn't be found"
    })
    }
   
}

});

router.delete('/:bookingId', requireAuth, async (req, res, next)=>{
   const booking = await Booking.findOne({
    where:{
        id: req.params.bookingId
    }
   });
   
    if(booking){
        if(booking.userId === parseInt(req.user.id)){
            console.log(booking.startDate, "and", changeDate(booking.startDate))
            console.log(currentDate, "and", changeDate(currentDate))
            if(changeDate(booking.startDate) < changeDate(currentDate)){
                res.status(403);
                res.json({
                    "message": "Bookings that have been started can't be deleted"
                  })
            }else{
                booking.destroy();
                res.json({
                    "message": "Successfully deleted"
                  })
            }
        } else{
            res.status(403);
            res.json({
                "message": "you can't delete booking that doesn't belong to you"
              })
        }
        
        // console.log(spotId)
    } else{
        res.status(404);
        res.json({
            "message": "Booking couldn't be found"
          })
    }

    
})


module.exports = router;