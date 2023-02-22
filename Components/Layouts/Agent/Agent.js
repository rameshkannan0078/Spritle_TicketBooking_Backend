const router = require('express').Router();
const db = require('../../Config/config');
const fs = require('fs');
const express=require('express');
const AgentFunctions=require('./AgentFunctions');

const Authorize = require("../JWT/AuthenticateToken");
const ACCESS_TOKEN=require('../JWT/GlobalTokens')
const jwt=require('jsonwebtoken');

router.use('/uploads', express.static(__dirname + '/uploads'));


router.use(function (req, res, next) {
    console.log(req.url, "@", Date.now());
    next();
})

router.post('/AgentLogin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);
    const user={email:email}
    const accessToken=jwt.sign(user,ACCESS_TOKEN.ACCESS_TOKEN);

    db.get(`SELECT * FROM AgentDetails  WHERE Email = ? and Password=?  ;`, [email, password], (error, row) => {
        if (error) {
            console.error(error.message);
        }
        if (row) {
            console.log(row)
            res.send({
                status: 200,
                message: row,
                access_Token:accessToken,
            })
        } else {
            console.log(row)
            res.send({
                status: 404,
                message: 0
            })

        }
    });
})


router.post('/FindTheAgentProfile', Authorize.authenticateToken, (req, res) => {
    const email = req.body.email;
    db.get(`SELECT * FROM AgentDetails  WHERE Email = ?  ;`, [email], (error, row) => {
        if (error) {
            console.error(error.message);
        }
        if (row) {
            console.log(row)
            res.send({
                status: 200,
                message: row
            })
        } else {
            console.log(row)
            res.send({
                status: 404,
                message: 0
            })

        }
    });
})




router.post('/AgentFirstTimeUpdate', (req, res) => {

    const [name,password,Image,Gender,dob,address,phoneno,email]=[req.body.name,req.body.password,req.body.image,req.body.gender,req.body.dob,req.body.address,req.body.phoneno,req.body.email];
    const file = req.files.image;
    const filename = file.name;
    console.log(req.body);
    console.log(filename);
    const newpath = __dirname + "/uploads/AgentsImages";
    fs.mkdirSync(newpath, { recursive: true });
    const filepath = newpath + '/' + filename;

    file.mv(filepath, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error moving file');
        } else {
            console.log(filepath);
            console.log("File moved successfully");
            db.run(`UPDATE AgentDetails
            SET Name = ?,
                Password = ?,
                Image = ?,
                Gender = ?,
                Dob = ?,
                Address = ?,
                PhoneNo = ?,
                userCreated=1
            WHERE Email = ?; ;`, [name, password,filename,Gender,dob,address,phoneno,email], (error, row) => {
                if (error) {
                    console.error(error.message);
                    res.send({
                        status: 404,
                        message: 0
                    })
                }
                else{
                    res.send({
                        status: 200,
                        message: row
                    })
                }
            });
         
        }
    })
})


router.get('/AgentUpcomingBookingCount',Authorize.authenticateToken,(req,res)=>{
    db.all(`SELECT (SELECT COUNT(*) FROM CompartmentAllocation) + (SELECT COUNT(*) FROM TicketBooking) AS total; `, (error, row) => {
        if (error) {
            console.error(error.message);
        }
        if (row) {
            console.log(row)
            res.send({
                status: 200,
                message: row
            })
        } else {
            console.log(row)
            res.send({
                status: 404,
                message: 0
            })

        }
    });

})





router.get('/AgentUpcomingBookingFilled',Authorize.authenticateToken,(req,res)=>{
    db.all(`SELECT * from TicketBooking where Allocated=1; `, (error, row) => {
        if (error) {
            console.error(error.message);
        }
        if (row) {
            console.log(row)
            res.send({
                status: 200,
                message: row
            })
        } else {
            console.log(row)
            res.send({
                status: 404,
                message: 0
            })

        }
    });

})

router.post('/AgentBookTheTicket',Authorize.authenticateToken, async (req, res) => {
    const AvilableSeats = await AgentFunctions.FindAllSeats(req.body.AgentEmail);
    
    const tableData = JSON.parse(req.body.tableData);
    console.log(AvilableSeats)
    const updatedTableData = await AgentFunctions.FindTheAge(tableData, AvilableSeats,req.body.AgentEmail);
    if(updatedTableData.length>0){
        await AgentFunctions.FillTheMiddleSeat(updatedTableData,AvilableSeats,req.body.AgentEmail,tableData);
    }
    if(updatedTableData.length<=0){
        res.send({
            status: 200,
            message: "Seat Booked",
            seatLength:updatedTableData.length
        })
    }
    else{
        res.send({
            status: 404,
            message: "Seat not Booked",
            seatLength:updatedTableData.length
        })
    }
  });
  
  
  

  router.post('/AgentAvilableTicketsCount',Authorize.authenticateToken, (req, res) => {
    const email = req.body.email;
    console.log(email)
    db.all(`SELECT * FROM TicketBooking  WHERE AgentEmail = ? and Allocated=0;`, [email], (error, row) => {
        if (error) {
            console.error(error.message);
        }
        if (row) {
            console.log(row)
            res.send({
                status: 200,
                message: row
            })
        } else {
            console.log(row)
            res.send({
                status: 404,
                message: 0
            })

        }
    });
   
  });




  router.post('/AgentPreviousBookingFilled',Authorize.authenticateToken, (req, res) => {
    const email = req.body.email;
    console.log(email)
    db.all(`SELECT * FROM TicketBooking  WHERE AgentEmail = ? and Allocated=1;`, [email], (error, row) => {
        if (error) {
            console.error(error.message);
        }
        if (row) {
            console.log(row)
            res.send({
                status: 200,
                message: row
            })
        } else {
            console.log(row)
            res.send({
                status: 404,
                message: 0
            })

        }
    });
   
  });




module.exports = router;