const moment = require('moment');
module.exports = {
	run : async function(){
		console.log('cron notification 24 before checkin UTC Time '+moment().tz('America/Bogota').format("HH:mm")+'....');
		let date = moment().tz('America/Bogota').format("YYYY-MM-DD")
		//console.log(date)
		let hour = moment().tz('America/Bogota').format("HH:mm")
		//console.log(hour)
		if(hour == "08:00")
		{
			let booking = await BookingService.findBooking({status:{'$in':['pending','active']},checkOut:date})
			//console.log(booking)
			for(var i = 0;i < booking.length;i++)
			{
				if(booking[i].user)
				{
					await NotificationService.sendNotification(booking[i].user._id,'4CLIENT',booking[i].project.name)
				}			
			}
		}
	}
}