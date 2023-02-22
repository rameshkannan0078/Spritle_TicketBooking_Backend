const express = require('express'); 
const app = express(); 
const cors = require('cors');
const fileupload = require("express-fileupload");

const SuperAdmin=require('./Components/Layouts/SuperAdmin/SuperAdmin');
const compartment=require('./Components/Layouts/SuperAdmin/Compartment');
const Agent=require('./Components/Layouts/Agent/Agent');
app.use(fileupload())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/TicketPdf', express.static('Components/TicketPdf'));


app.get('/',(res,req)=>{
    res.send({
        message:'Hello World'
    })
}) 

app.use('/SuperAdmin',SuperAdmin)
app.use('/compartment',compartment)
app.use('/agent',Agent)
app.listen(3001); 




console.log('Running at Port 3001');