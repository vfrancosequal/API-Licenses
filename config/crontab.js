module.exports.crontab = {

	crons:function()
	{
		var jsonArray = [];
		//jsonArray.push({interval:'0 */10 * * * * ',method:'synchronizeBooking'});		
		//jsonArray.push({interval:'0 0 0 * * * ',method:'ratingProject'});		
		//jsonArray.push({interval:'0 0 0 * * * ',method:'ratingSuite'});		
		//jsonArray.push({interval:'0 0 0 * * * ',method:'lowPriceProject'});		
		//jsonArray.push({interval:'0 0 */1 * * * ',method:'notify24Before'});		
		//jsonArray.push({interval:'0 0 */1 * * * ',method:'notify4Checkout'});		
		return jsonArray;
	},

	synchronizeBooking:function(){
		require('../crontab/synchronizeBooking.js').run();
	},
	ratingProject:function(){
		require('../crontab/ratingProject.js').run();
	},
	ratingSuite:function(){
		require('../crontab/ratingSuite.js').run();
	},	
	lowPriceProject:function(){
		require('../crontab/lowPriceProject.js').run();
	},
	notify24Before:function(){
		require('../crontab/notify24Before.js').run();
	},
	notify4Checkout:function(){
		require('../crontab/notify4Checkout.js').run();
	},		
};