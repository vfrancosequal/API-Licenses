const moment = require('moment');
module.exports = {
	run : async function(){
		console.log('cron Rating Projects UTC Time '+moment().utc().format("HH:mm")+'....');
		let project = await ModelService.find('Project',{})
		if(project.length>0)
		{
			for(var i=0;i<project.length;i++)
			{
				let ratings = await ModelService.find('Rating',{idProject:project[i]._id})
				let prom = 0;
				if(ratings.length>0)
				{
					for(var j=0;j<ratings.length;j++)
					{
						prom = prom + ratings[j].rating
					}
					prom = parseInt(prom / ratings.length)
				}
				await ModelService.update('Project',{rating:prom},{_id:project[i]._id})
			}
		}
	}
}