var passport = require('passport');
var moment = require('moment')

module.exports = {
	loginGoogle : async function (req,res)
	{
		try{
			passport.authenticate('google', { scope: ['email', 'profile'] })(req, res);
		}catch(err){
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
  	googleCallback: async function(req, res, next)
  	{
    	passport.authenticate('google', async function(err, user) {
	      	if(err) {
	        	// redirect to login page
	        	console.log('google callback error: '+err);
	        	res.redirect('http://localhost:3000/auth/callback/failure');
			    //return res.status(401).send(ResponseService.res(401, 40001, true, err));
	      	} else {
			    if(!user || user._json.domain!=='sequal.com.co')
			    {   
			    	res.redirect('http://localhost:3000/auth/callback/failure');
			        //return res.status(401).send(ResponseService.res(401, 30001, true));
			    }else{
		        	//console.log('google credentials');
		        	//user.expiry_date = moment().add(3599, "s").format("X");
		        	//console.log(user);
		        	let usuario = await ModelService.findOne('Usuarios',{email:user.email, activo:true})
		        	if(!usuario)
			        	return res.status(401).send(ResponseService.res(401, 30003, true));
		        	usuario.device = ComunService.getDevice(req)
					let $token = await TokenService.sesion(usuario)
					let result = { token : $token, user:usuario }
					res.redirect('http://localhost:3000/auth/callback/success?result='+encodeURIComponent(JSON.stringify(result)));
		        	//res.json(ResponseService.res(200, 10001, false, result));
			    }	      		
	      	}
    	})(req, res, next);
  	},
  	getAccessToken : async function(req,res)
  	{
  		try
  		{
  			let params = req.allParams();
  			//console.log(params.user)
  			if(!params.user.email)
  				return res.status(401).send(ResponseService.res(401, 40005, true, "email"))
  			let usuario = await ModelService.findOne('Usuarios',{email:params.user.email, activo:true})
        	if(!usuario)
	        	return res.status(401).send(ResponseService.res(401, 30003, true));
        	usuario.device = ComunService.getDevice(req)
			if(usuario.device=='device')
				usuario.device='browser'	        
        	//console.log("auth: ",usuario.device)
			let $token = await TokenService.sesion(usuario)
			let result = { token : $token, user:usuario }
			//console.log(result)
			return res.json(ResponseService.res(200, 10001, false, result));
  		}
  		catch(err)
  		{
  			console.log(err);
  			return res.status(500).send(ResponseService.res(500, 40001, true, err));
  		}
  	}
}