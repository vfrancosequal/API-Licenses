/**
 * User.js
**/

module.exports = {
	attributes: {

		email		: { type: 'string', required: true},
		pin			: { type: 'string' },
		profile		: { type: 'string', isIn: ['USER', 'ADMIN'], required: true },
		fullName	: { type: 'string' },
		gender 	 	: { type: 'string' },		
		phone		: { type: 'string', required: true, unique: true },				
		active		: { type: 'boolean', required: true },				
		membership	: { type: 'string' },
		expoToken	: { type: 'string' },				
		language	: { type: 'string' },
		adv			: { type: 'string' },
		referralCode: { type: 'string' },
		fullRecord	: { type: 'boolean', required: true },
		stats		: { type: 'JSON' }	

		//  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
	    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
	    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
	},
};