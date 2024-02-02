const moment = require('moment');
module.exports = {
	run : async function(){
		console.log('cron Rating Suites UTC Time '+moment().utc().format("HH:mm")+'....');
		let suites = await ModelService.find('Suite',{})
		if(suites.length>0)
		{
			for(var i=0;i<suites.length;i++)
			{
				let ratings = await ModelService.find('Rating',{idSuite:suites[i]._id})
				let prom = 0;
				if(ratings.length>0)
				{
					for(var j=0;j<ratings.length;j++)
					{
						prom = prom + ratings[j].rating
					}
					prom = parseInt(prom / ratings.length)
				}
				await ModelService.update('Suite',{rating:prom},{_id:suites[i]._id})
			}
		}
		console.log('ENDcron Rating Suites UTC Time '+moment().utc().format("HH:mm")+'....');
	}
}