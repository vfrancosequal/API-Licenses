/**
 * User.js
*/

module.exports = {
	attributes: {

		email		: { type: 'string', required: true},
		nombres		: { type: 'string', required: true },
		apellidos	: { type: 'string', required: true },
		mac			: { type: 'string', required: true },
		pass		: { type: 'string', required: true },
		pass_mobile	: { type: 'string', required: true },
		perfil		: { type: 'string', required: true },
		activo		: { type: 'boolean', required: true },		
		admin		: { type: 'boolean', required: true },		
		revisor		: { type: 'boolean', required: true },		
		superAdmin	: { type: 'boolean', required: true },
		accessToken	: { type: 'string'},
		expiry_date	: { type: 'string'},

		//  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
	    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
	    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
	},
};