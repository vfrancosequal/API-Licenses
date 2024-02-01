var jwt = require("jsonwebtoken");
var moment = require('moment');

const TOKEN_KEY = sails.config.globals.TOKEN_KEY;

module.exports = {
	decode: function(token) {
		return new Promise(function(resolve, reject) {
			jwt.verify(token, TOKEN_KEY, function(err, decoded) {
				if (err)
					return reject(ResponseService.res(401, 30006, true));
				return resolve(decoded);
			});
		});
	},
	sesion : function(data){
		return new Promise(function(resolve, reject) {
			var create = moment().unix();
			var expire = moment().add(365, "days").unix();
			var dataToken = {
				userId 	: data._id.toString(),
				profile : data.profileNew,
				create 	: create,
				expire 	: expire,
				device  : data.device
			};
			
			var token = jwt.sign(dataToken, TOKEN_KEY);
			var expireD = 3600 * 24 * 365; //1 año dura el token
			RedisService.set("TOKEN::" + data._id + data.device, dataToken, expireD).then(function(data) {
				return resolve(token);
			})
			.catch(function(e) {
				console.log(e)
				return reject(e);
			});
		})
	},
	verify : function(params){
		return new Promise(function(resolve, reject) {
			var create = moment().unix();
			var expire = moment().add(1, "hours").unix();
			var dataToken = {
				userId: params._id.toString(),
				code  : params.code,
				create: create,
				expire: expire,
				device: params.device
			};

			var token = jwt.sign(dataToken, TOKEN_KEY);
			var expireD = 3600 * 1; //1 hora token
			RedisService.set("CODE::" + params._id + params.device, dataToken, expireD).then(function(data) {
				return resolve(token);
			})
			.catch(function(e) {
				return reject(e);
			});
		})
	}
}