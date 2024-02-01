const moment = require('moment');
module.exports = {
	run : async function(){
		console.log('cron notification 24 before checkin UTC Time '+moment().tz('America/Bogota').format("HH:mm")+'....');
		let date = moment().tz('America/Bogota').add(1,'day').format("YYYY-MM-DD")
		//console.log(date)
		let hour = moment().tz('America/Bogota').format("HH:mm")
		if(hour == "08:00")
		{
			let booking = await BookingService.findBooking({status:'pending',checkIn:date})
			//console.log(booking)
			for(var i = 0;i < booking.length;i++)
			{
				if(booking[i].user)
				{
					await NotificationService.sendNotification(booking[i].user._id,'24CLIENT',booking[i].project.name)
				}
				if(booking[i].suite.idPartner)
				{
					await NotificationService.sendNotification(booking[i].suite.idPartner,'24PARTNER',booking[i].project.name,'',booking[i].user.fullName)
				}			
			}
		}
	}
}