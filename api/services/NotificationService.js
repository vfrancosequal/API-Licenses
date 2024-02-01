const moment 				= require('moment');
moment.locale('es');
const momentTz = require('moment-timezone');
const { Expo } = require('expo-server-sdk');
// Create a new Expo SDK client
const expo = new Expo();

module.exports = {
	create : async function(params,push){		        		
		try
		{
			let data={
				title:params.title,
				body:params.body,
				data:params.data,
				view:false,
				type:params.type,
				idUser:params.user				
			}
			let notify = {}//await ModelService.create('Notifications',data);
			if(push){
				let user = await ModelService.findById('User',params.user);
				if(user && user.expoToken!=undefined && user.expoToken!='')
				   {
				   	    let pushToken=[];				   	    				   	  
			            pushToken.push(user.expoToken);			
						notify = await NotificationService.sendExpoPush(pushToken,data);
				   }	
			}			
			return notify;
		}
        catch(err)
        {
			console.error(err)
			return false;
        }
	},
	sendNotification:async function(receptor,emisor,point)
	{
		try
		{
			//let user = await ModelService.findById('User',idUser)
			//console.log(user.expoToken)
			let data = {
				receptor : receptor,
				emisor : emisor,
				type : 'comentario',
				data : 
				{
					titulo : "Alguien ha comentado",
					mensaje : emisor + "ha agregado un nuevo comentario en "+point					
				}
			}
			sails.sockets.broadcast('roomName', 'sendNoty', data);
			console.log("mensaje socket enviado") 
			const dataNoti={
							title:data.title,
							body:data.message,
							data:data.data,
							type:data.type,
							user:data.user
						}				
			//await this.create(dataNoti,true);
			return true;		
		}
      catch(err)
      {
			console.error(err)
			return false;
      }		
	}
}