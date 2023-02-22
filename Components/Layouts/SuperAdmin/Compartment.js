const router = require('express').Router();
const { OK } = require('sqlite3');
const db = require('../../Config/config');
const { PdfGenerator } = require('../PdfGenerator/PdfGenerator');
const CompartmentFunctions = require('./CompartmentFunctions');
const Authorize = require("../JWT/AuthenticateToken");
const ACCESS_TOKEN=require('../JWT/GlobalTokens')


router.use(function (req, res, next) {
    console.log(req.url, "@", Date.now());
    next();
})

router.post('/SuperAddCompartment',Authorize.authenticateToken , async (req, res) => {
    try {
      const tableData = req.body.tableData;
      const FinalData = tableData.split(',');
      
      FinalData.sort((a, b) => {
        const seatNumA = parseInt(a.split(' - ')[0]);
        const seatNumB = parseInt(b.split(' - ')[0]);
        return seatNumA - seatNumB;
      });
  
      console.log(FinalData);
  
      for (let i = 0; i < FinalData.length; i++) {
        const element = FinalData[i];
        await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO CompartmentAllocation (Id, Seats, SeatNumber) VALUES (Null, ?, ?);`,
            [element, element.split("-")[0]],
            (error, row) => {
              if (error) {
                console.error(error.message);
                reject(error);
              } else {
                resolve(row);
              }
            }
          );
        });
      }
      
      console.log("Data added successfully");
      res.send({
        status: 200,
        message: "OK",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        status: 500,
        message: "Internal Server Error",
      });
    }
  });
  

router.post('/SuperCompartmentAgentExisted', Authorize.authenticateToken ,(req, res) => {
    const email = req.body.email;
    db.get(`SELECT * FROM TicketBooking where email=? ;`, [email], (error, row) => {
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
            console.log('0')
            res.send({
                status: 404,
                message: 0
            })

        }
    });


})




router.post('/SuperAllocateSeatsToAgent', Authorize.authenticateToken ,(req, res) => {
    const email = req.body.AgentEmail;
    const NumberOfSeats = req.body.NumberOfSeats;
    console.log("This is Email " + email);
    console.log("This is Number oF Seats" + NumberOfSeats)
    const flag = CompartmentFunctions.AllocateSeatsToAgent(email, NumberOfSeats);
    if (flag) {
        res.send({
            status: 200,
            message: 'Allocated'
        })
    }
})




router.get('/SuperCompartmentCount', Authorize.authenticateToken ,(req, res) => {
  PdfGenerator();
    db.all(`SELECT * FROM CompartmentAllocation;`, (error, row) => {
        if (error) {
            console.error(error.message);
        }
        if (row) {
            res.send({
                status: 200,
                message: row.length
            })
        } else {
            
            res.send({
                status: 404,
                message: 0
            })

        }
    });


})



module.exports = router;