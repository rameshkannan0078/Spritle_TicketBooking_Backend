const PDFDocument = require('pdfkit');
const fs = require('fs');
const http = require('http');
const FormData = require('form-data');

module.exports = {
	PdfGenerator: (name, email, gender, phoneNo, age, address, source, destination, seat, AgentEmail) => {
		const doc = new PDFDocument();
		doc.pipe(fs.createWriteStream('Components/TicketPdf/' + seat + '.pdf'));

		doc.image('Components/Assets/Logo.png', 50, 45, { width: 50 })
			.fillColor('#444444')
			.fontSize(20)
			.text('Spritle Ticket Booking', 110, 57)
			.fontSize(10)
			.text('Plot no 20, 2nd floor', 200, 65, { align: 'right' })
			.text('Chennai , Tamil Nadu,  600116', 200, 80, { align: 'right' })
			.moveDown();

		doc
			.fillColor("#444444")
			.fontSize(20)
			.text("Invoice", 50, 160);
		generateHr(doc, 185);

		doc.moveDown();

		doc.font('Helvetica');
		doc.fontSize(15).text('Name', 50, 220);
		doc.fontSize(15).text(name, 250, 220);

		doc.fontSize(15).text('Email', 50, 240);
		doc.fontSize(15).text(email, 250, 240);

		doc.fontSize(15).text('Gender', 50, 260);
		doc.fontSize(15).text(gender, 250, 260);

		doc.fontSize(15).text('PhoneNo', 50, 280);
		doc.fontSize(15).text(phoneNo, 250, 280);

		doc.fontSize(15).text('Age', 50, 300);
		doc.fontSize(15).text(age, 250, 300);

		doc.fontSize(15).text('Address', 50, 320);
		doc.fontSize(15).text(address, 250, 320);

		doc.fontSize(15).text('Source', 50, 400);
		doc.fontSize(15).text(source, 250, 400);

		doc.fontSize(15).text('Destination', 50, 420);
		doc.fontSize(15).text(destination, 250, 420);

		doc.fontSize(15).text('Agent Email', 50, 440);
		doc.fontSize(15).text(AgentEmail, 250, 440);


		doc.moveDown();

		doc.fontSize(18).text('Seat', 50, 460);
		doc.fontSize(18).text(seat, 250, 460);

		doc.fontSize(18).text('Seat Number', 50, 480);
		doc.fontSize(18).text(FindSeatDetail(seat), 250, 480);

		doc.fontSize(20).text('Your Ticket has been Booked Successfully ', 210, 530);
		generateFooter(doc);
		doc.end();
		  

	},

}

function generateHr(doc, y) {
	doc
		.strokeColor("#aaaaaa")
		.lineWidth(1)
		.moveTo(50, y)
		.lineTo(550, y)
		.stroke();
}

function generateFooter(doc) {
	doc
		.fontSize(10)
		.text(
			"Thanks for choosing spritle Ticket booking . Have a save Jouney!",
			50,
			700,
			{ align: "center", width: 500 }
		);
}

function FindSeatDetail(n) {
	switch (n % 6) {
		case 0:
			return n + " - Window Seat";
		case 1:
			return n + " - Middle Seat";
		case 2:
			return n + " - Aisle Seat";
		case 3:

			return n + " - Aisle Seat";

		case 4:
			return n + " - Middle Seat";
		case 5:
			return n + " - Window Seat";
	}


}

// function SendPdfTOUser(seat,AgentEmail) {
// 	console.log("hello")
// const form = new FormData();
// const filePath ='Components/TicketPdf/' + seat + '.pdf';
// const fileStream = fs.createReadStream(filePath);
// form.append('file', fileStream);
// form.append('email', AgentEmail);


// const options = {
//     hostname: 'localhost',
//     port: 3002,
//     path: '/sendpdf.php',
//     method: 'POST',
//     headers: form.getHeaders()
// };

// const req = http.request(options, function (res) {
//     console.log('Status code:', res.statusCode);
//     res.setEncoding('utf8');
//     res.on('data', function (chunk) {
//         console.log(chunk);
//     });
// });

// req.on('error', function (error) {
//     console.error(error);
// });

// form.pipe(req);
// }



