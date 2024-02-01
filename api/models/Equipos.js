/**
 * Equipos.js
*/

module.exports = {
	attributes: {
		idProveedor  : {type: 'string', required: true},
		idEquipo     : {type: 'string', required: true},
		idProducto   : {type: 'string', required: true},
		fechaEntrega : {type: 'string', required: true},
		marca        : {model: "Marcas", required: true},
		modelo       : {type: 'string', required: true},
		procesador   : {type: 'string', required: true},
		ram          : {type: 'string', required: true},
		disco        : {type: 'string', required: true},
		sistema      : {type: 'string', required: true},
		asociado     : {type: "string", required: true},
		estado       : {type: 'string', required: true},
		notas        : {type: 'string', required: false},
		otros        : {type: 'string', required: false},
		kit          : {type: 'string', required: false},
		//  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
	    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
	    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
	},
};