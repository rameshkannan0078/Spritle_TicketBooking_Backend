const router = require('express').Router();
const db = require('../../Config/config');
const Authorize = require("../JWT/AuthenticateToken");
const ACCESS_TOKEN=require('../JWT/GlobalTokens')
const jwt=require('jsonwebtoken');


router.use(function (req, res, next) {
    console.log(req.url, "@", Date.now());
    next();
})


router.post('/SuperAdminLogin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);
    const user={email:email}
    const accessToken=jwt.sign(user,ACCESS_TOKEN.ACCESS_TOKEN);

    db.get(`SELECT * FROM superAdmin  WHERE email = ? and password=?  ;`, [email, password], (error, row) => {
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
          
            res.send({
                status: 404,
                message: 0
            })

        }
    });
})

router.post('/SuperAdminAddAgentExisted', Authorize.authenticateToken ,(req, res) => {
    const email = req.body.email;
    db.get(`SELECT * FROM AgentDetails where email=? ;`,[email], (error, row) => {
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


router.post('/SuperAdminAddAgent',  Authorize.authenticateToken,(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);

    db.run(`INSERT INTO "AgentDetails" (
        "Id",
        "Name",
        "Email",
        "Password",
        "Image",
        "Gender",
        "Dob",
        "Address",
        "userCreated",
        "PhoneNo"
    ) VALUES (
        Null,
        Null,
      ?,
      ?,
        Null,
        Null,
        Null,
        Null,
        0,
        Null
    );
     `, [email, password], (error, row) => {
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





router.post('/SuperAdminDeleteAgent', Authorize.authenticateToken ,(req, res) => {
    const email = req.body.email;
    db.get(`Delete FROM AgentDetails where email=? ;`,[email], (error, row) => {
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

router.get('/SuperAdminAllAgents',  Authorize.authenticateToken,(req, res) => {


    db.all(`SELECT * FROM AgentDetails ;`, (error, row) => {
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




router.get('/SuperAdminCountBookedSeats', Authorize.authenticateToken ,(req, res) => {


    db.all(`SELECT * FROM TicketBooking where Allocated=1 ;`, (error, row) => {
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


router.get('/SuperAdminCountChart', Authorize.authenticateToken,(req,res)=>{
    
    db.all(`SELECT  'below 20' AS age_group, COUNT(*) AS count   FROM   TicketBooking  WHERE     age < 20   UNION ALL  SELECT     '20-59' AS age_group, COUNT(*) AS count   FROM   TicketBooking  WHERE     age >= 20 AND age < 60   UNION ALL  SELECT     'above 60' AS age_group, COUNT(*) AS count   FROM   TicketBooking  WHERE     age >= 60;
  `, (error, row) => {
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




module.exports = router;