const db = require('../../Config/config');

module.exports = {
    AllocateSeatsToAgent: async (email, NumberOfSeats) => {
        let Seats = await GetTheSeatRows(NumberOfSeats);
        console.log(Seats)
        
        for (let index = 0; index < Seats.length; index++) {
            const element = Seats[index];
            await AllocateSeats((element.Seats), parseInt(element.SeatNumber), email, 0);
            
        }
        DeleteSeatRows(NumberOfSeats);
        return true;

    },
}

const AllocateSeats = async (seat,seatNo,email)=>{
    console.log("This is " +seatNo)
    const rows= await db.run(`
    INSERT INTO TicketBooking (
        Id,
        Name,
        Email,
        Gender,
        PhoneNo,
        Age,
        Address,
        Source,
        Destination,
        Seat,
        SeatNumber,
        AgentEmail,
        Allocated
    )
    VALUES (
        Null,
        Null,
        Null,
        Null,
        Null,
        Null,
        Null,
        Null,
        Null,
        ?,
        ?,
        ?,
        ?
    );
`, [seat, seatNo, email, 0], (error, row) => {
    if (error) {
        console.error(error.message);
    }
    if (row) {
        return true;
    } else {
        return false;
    }
});

return rows;

}


function GetTheSeatRows(NumberOfSeats) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM CompartmentAllocation LIMIT ${NumberOfSeats};`, [], (error, row) => {
            if (error) {
                reject(error);
            } else {
                resolve(row);
            }
        });
    });
}

function DeleteSeatRows(NumberOfSeats) {
    return new Promise((resolve, reject) => {
        db.run(`
            DELETE FROM CompartmentAllocation 
            WHERE id IN (
                SELECT id 
                FROM CompartmentAllocation 
                ORDER BY id 
                LIMIT ${NumberOfSeats}
            )
        `, [], (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

