const db = require("../../Config/config");
const PdfGenerator = require("../PdfGenerator/PdfGenerator");

module.exports = {

  FindTheAge: async (tableData, availableSeats,AgentEmail) => {
    return new Promise((resolve, reject) => {
      let person = 0;
      for (let i = 0; i < availableSeats.length; i++) {
        const seat = parseInt(availableSeats[i].SeatNumber);
        if ((seat % 6 === 1) || (seat % 6 === 0)) {
          if (tableData[person].age >= 60) {
            db.run(
              `UPDATE TicketBooking SET Name = ?, Email = ?, Gender = ?, PhoneNo = ?, Age = ?, Address = ?, Source = ?, Destination = ?, Allocated = 1 WHERE SeatNumber = ?;`,
              [
                tableData[person].name,
                tableData[person].email,
                tableData[person].gender,
                tableData[person].phoneNo,
                tableData[person].age,
                tableData[person].address,
                tableData[person].source,
                tableData[person].destination,
                seat
              ],
              (err, row) => {
                if (err) {
                  console.log(err);
                }
              }
            );
              PdfGenerator.PdfGenerator( tableData[person].name,
                  tableData[person].email,
                  tableData[person].gender,
                  tableData[person].phoneNo,
                  tableData[person].age,
                  tableData[person].address,
                  tableData[person].source,
                  tableData[person].destination,seat,AgentEmail);
            tableData.shift();
          }

        }
      }
      resolve(tableData);
    });
  },


  FillTheMiddleSeat: async (tableData, availableSeats, AgentEmail, tableDataNochange) => {

    console.log("This is table Data length  "+tableData.length);
    console.log(JSON.stringify(tableData))
  


    const NotChangedTableData = tableDataNochange;
   
    return new Promise(async (resolve, reject) => {
      let person = 0;
      for (let i = 0; i < availableSeats.length; i++) {
        
        const seat = parseInt(availableSeats[i].SeatNumber);
        if ((seat % 6 === 2) || (seat % 6 === 5)) {
      
          if (tableData.length>person) {
            let WindowSeat=await FindTheNearGender(seat-1);
            let AisleSeat=await FindTheNearGender(seat+1);
            if( tableData[person].age >= 60){
              if (WindowSeat[0] && AisleSeat[0]) {
                const sourceToFind = WindowSeat[0].Email;
                const sourceToFind2= AisleSeat[0].Email;
                const isSourceIncluded = NotChangedTableData.some(obj => obj.email === sourceToFind);
                const isSourceIncluded2 = NotChangedTableData.some(obj => obj.email === sourceToFind2);
                console.log(isSourceIncluded)
                console.log(isSourceIncluded2)
                console.log(WindowSeat[0].Email)
                  if( isSourceIncluded && isSourceIncluded2){
                   tableData= await  InsertTheSeatDataInDataBase( tableData[person].name,
                      tableData[person].email,
                      tableData[person].gender,
                      tableData[person].phoneNo,
                      tableData[person].age,
                      tableData[person].address,
                      tableData[person].source,
                      tableData[person].destination,
                      seat,tableData,AgentEmail);
              }
              else if(isSourceIncluded){
                tableData= await  InsertTheSeatDataInDataBase( tableData[person].name,
                  tableData[person].email,
                  tableData[person].gender,
                  tableData[person].phoneNo,
                  tableData[person].age,
                  tableData[person].address,
                  tableData[person].source,
                  tableData[person].destination,
                  seat,tableData,AgentEmail);

              }


              } 
              else if(WindowSeat[0]){
                if(WindowSeat[0].Gender===(tableData[person].gender)){
                  tableData= await  InsertTheSeatDataInDataBase( tableData[person].name,
                    tableData[person].email,
                    tableData[person].gender,
                    tableData[person].phoneNo,
                    tableData[person].age,
                    tableData[person].address,
                    tableData[person].source,
                    tableData[person].destination,
                    seat,tableData,AgentEmail);
                }
          
              

              }
            }
            else {
              if (WindowSeat[0] && AisleSeat[0]) {
                const sourceToFind = WindowSeat[0].Email;
                const sourceToFind2= AisleSeat[0].Email;
                const isSourceIncluded = NotChangedTableData.some(obj => obj.email === sourceToFind);
                const isSourceIncluded2 = NotChangedTableData.some(obj => obj.email === sourceToFind2);
                 console.log(isSourceIncluded)
                  if( isSourceIncluded && isSourceIncluded2){
                    tableData= await  InsertTheSeatDataInDataBase( tableData[person].name,
                      tableData[person].email,
                      tableData[person].gender,
                      tableData[person].phoneNo,
                      tableData[person].age,
                      tableData[person].address,
                      tableData[person].source,
                      tableData[person].destination,
                      seat,tableData,AgentEmail);
              }

              else if(WindowSeat[0]){
                if(WindowSeat[0].Gender===(tableData[person].gender)){
                  tableData= await  InsertTheSeatDataInDataBase( tableData[person].name,
                    tableData[person].email,
                    tableData[person].gender,
                    tableData[person].phoneNo,
                    tableData[person].age,
                    tableData[person].address,
                    tableData[person].source,
                    tableData[person].destination,
                    seat,tableData,AgentEmail);
                }
              

              }
              } 
         

            }
          
         

          }

        }
        else if((seat % 6 === 3) || (seat % 6 === 4)){
          if (tableData.length > person) {
            if(tableData){
              if( tableData[person].age <= 60){
                db.run(
                  `UPDATE TicketBooking SET Name = ?, Email = ?, Gender = ?, PhoneNo = ?, Age = ?, Address = ?, Source = ?, Destination = ?, Allocated = 1 WHERE SeatNumber = ?;`,
                  [
                    tableData[person].name,
                    tableData[person].email,
                    tableData[person].gender,
                    tableData[person].phoneNo,
                    tableData[person].age,
                    tableData[person].address,
                    tableData[person].source,
                    tableData[person].destination,
                    seat
                  ],
                  (err, row) => {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
                PdfGenerator.PdfGenerator( tableData[person].name,
                  tableData[person].email,
                  tableData[person].gender,
                  tableData[person].phoneNo,
                  tableData[person].age,
                  tableData[person].address,
                  tableData[person].source,
                  tableData[person].destination,
                  seat,AgentEmail);
              }
           
             
            }
            tableData.shift();

          }

        
         
        }
       
      }
      resolve(tableData);

    });

  },






FindAllSeats: async (AgentEmail) => {
    console.log("This is " + AgentEmail);
    const rows = await new Promise((resolve, reject) => {
      db.all(
        "SELECT Id, SeatNumber FROM TicketBooking WHERE AgentEmail=? AND Allocated=0 ORDER BY SeatNumber ASC",
        [AgentEmail],
        (err, rows) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
    return rows;
  },
};


const FindTheNearGender = async (seatNum) => {

  const rows = await new Promise((resolve, reject) => {
    db.all(
      "SELECT Id, SeatNumber,Gender,AgentEmail,Email FROM TicketBooking WHERE SeatNumber=?",
      [seatNum],
      (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
  return rows;
}

const InsertTheSeatDataInDataBase = async (name,email,gender,phoneNo,age,address,source,destination,seat,tableData,AgentEmail)=>{
  await db.run(
    `UPDATE TicketBooking SET Name = ?, Email = ?, Gender = ?, PhoneNo = ?, Age = ?, Address = ?, Source = ?, Destination = ?, Allocated = 1 WHERE SeatNumber = ?;`,
    [
      name,
      email,
      gender,
      phoneNo,
      age,
      address,
      source,
      destination,
      seat
    ],
    (err, row) => {
      if (err) {
        console.log(err);
      }
    }
  );

  PdfGenerator.PdfGenerator(name,email,gender,phoneNo,age,address,source,destination,seat,AgentEmail);

  return tableData.shift();
}