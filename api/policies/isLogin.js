module.exports = async function(req, res, next) {
	var token = req.headers.authorization;
	let device= ComunService.getDevice(req);
	// si no viene el token mandamos el error 401
	//req.idUser =ComunService.toObjectId(token);
	//return next();
	//console.log("isLogin: ",device)
	if(device=='device')
		device='browser'
	if(!token)
		return res.status(403).send(ResponseService.res(403, 40005, true, 'token'))
	TokenService
		.decode(token)
		.then(function(decoded) {
			RedisService.get("TOKEN::" + decoded.userId + device)
				.then(function(result) {
					//console.log(result)
					if(!result){
						//el token no existe en redis ya expiro
						//lo idea es mandar un error 403 para que en nuestra app se cierre en automatico cada vez que un en point
						//conteste el status 403
						return res.status(403).send(ResponseService.res(403, 30007, true));
					}
					//si los datos del token son iguales a los que estan en redis entonces
					// el token es valido
					// si es diferente entonces el usuario inicio sesion en otro dispotivo y se anulo el token actual
					//if(device=='device')
						//device='browser'					
					if( result.create == decoded.create &&
						result.expire == decoded.expire &&
						result.userEmail == decoded.userEmail &&
						result.profile == decoded.profile &&
						decoded.userId == result.userId){
						//se valida si el profile corresponde al police actual, si se intenta consultar el endpoint
						//con un token vigente, pero no tiene el profile correspondiente no le damos acceso al controlador
						//if (result.profile == 'USER') 
							//return res.status(401).send(ResponseService.res(401, 30010, true));
						// aqui esta la magia a nuestro req le agregamos el userId que hizo la petición
						// para ser usado en los controladores
						req.userEmail = result.userEmail;
						return next();
					}else
						return res.status(403).send(ResponseService.res(403, 30007, true));
				}).catch(function(err){
					return res.status(500).send(ResponseService.res(500, 40003, true));
				});
		})
		.catch(function(err){
			//ocurrio un error al decodificar o alguien genero un token con el key incorrecto.
			return res.status(500).send(ResponseService.res(500, 40003, true));
		});
}