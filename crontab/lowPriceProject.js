const moment = require('moment');
module.exports = {
	run : async function(){
		console.log('cron delete pdf UTC Time '+moment().utc().format("HH:mm")+'....');
	}
}