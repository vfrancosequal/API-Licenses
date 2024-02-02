let msg = [];

module.exports = {

	res: function(status, code, error = false, data = null)
	{
    	let response = "";
    	/* EXITO */
    	msg[10001] = { 
    		text: 'Operación realizada con éxito', 
    		textEn: 'Operation performed successfully' 
    	};

    	msg[20001] = { 
	      	text: 'Correo invalido',
	      	textEn: 'Invalid email'
	    };	    

	    msg[20040] = { 
	      	text: 'Ya existe un usuario registrado con este correo',
	      	textEn: 'There is already a registered user with this email'
	    };    	    

    	msg[30001] = { 
	      	text: 'Lo siento no tienes autorización a esta petición',
	      	textEn: 'Sorry you do not have authorization to this request'
	    };

	    msg[30002] = { 
	      	text: 'usuario no existe',
	      	textEn: 'user does not exist'
	    };

	    msg[30003] = { 
	      	text: 'Opps! tu cuenta esta inactiva, comunicate con el soporte',
	      	textEn: 'Opps! your account is inactive, contact support'
	    };

	    msg[30004] = { 
	      	text: 'El Asociado no se encuentra activo',
	      	textEn: 'This Partner is not active'
	    };	    

	    msg[30005] = { 
	      	text: 'El Proyecto no se encuentra activo',
	      	textEn: 'This Project is not active'
	    };

	    msg[30006] = { 
	      	text: 'Token invalido, intente de nuevo',
	      	textEn: 'Invalid token, try again'
	    };

	    msg[30007] = { 
	      	text: 'Opps! Tu sesión ya expiro, por favor iniciar sesión nuevamente',
	      	textEn: 'Opps! Your session has expired, please log in again'
	    };

	    msg[30008] = { 
	      	text: 'uno de los ids no esta relacionado',
	      	textEn: 'one of the ids is not related'
	    };

	    msg[30009] = { 
	      	text: 'El id no se encuentra registrado',
	      	textEn: 'The id is not registered'
	    };

		msg[30010] = {
			text: data+' no encontrado',
	      	textEn: data+' not found'
		}; 

		msg[30011] = {
			text: 'No es posible realizar esta acción',
	      	textEn: 'It is not possible to perform this action'
		};

		msg[30012] = {
			text: 'Error generando el documento PDF',
	      	textEn: 'Error generating PDF document'
		}; 

		msg[30013] = {
			text: 'No se puede eliminar, se encuantra asociada a un equipo',
	      	textEn: 'Cannot be deleted, it is associated with a computer.'
		};  

		msg[30014] = {
			text: 'Ya existe un equipo con el mismo '+data,
	      	textEn: 'A device with the same supplier id already exists.'
		};

		msg[30015] = {
			text: 'Por Favor Espere, estamos procesando otro archivo',
	      	textEn: 'Por Favor Espere, estamos procesando otro archivo'
		};   

		msg[30016] = {
			text: 'No se puede cerrar el Point ya que se encuentra en estado '+data,
	      	textEn: 'The Point cannot be closed because it is in state '+data,
		};   

		msg[30017] = {
			text: 'No se puede asignar el Point ya que se encuentra en estado cerrado',
	      	textEn: 'The Point cannot be assigned because it has already been closed.',
		};

		msg[30018] = {
			text: 'ID de usuario ya registrado',
	      	textEn: 'User ID already registered.',
		};

		msg[30019] = {
			text: 'No se puede actualizar el Point ya que se encuentra en estado '+data,
	      	textEn: 'The Point status cannot be updated because it is in state '+data,
		};		   	    			    
    	
		/* ERROR DEL SISTEMA */
		msg[40001] = {
			text: 'Error procesando la petición. Contacte al equipo de soporte', 
			textEn: 'Error processing the request. Contact the support team'
		};

		msg[40002] = {
			text: 'Error enviando sms. Contacte al equipo de soporte', 
			textEn: 'Error sending sms. Contact the support team'
		};

		msg[40003] = {
			text: 'Redis conexion. Contacte al equipo de soporte', 
			textEn: 'Redis conection. Contact the support team'
		};

		msg[40004] = {
			text: 'Decode Redis token. Contacte al equipo de soporte', 
			textEn: 'Decode Redis token. Contact the support team'
		};

		msg[40005] = {
			text: 'El parametro '+data+' es obligatorio',
	      	textEn: 'The parameter '+data+' is mandatory'
		};

		msg[40006] = {
			text: 'Formato de celuar invalido',
	      	textEn: 'Invalid cell format'
		};

		msg[40007] = {
			text: 'Formato invalido ('+data+')',
	      	textEn: 'Invalid format ('+data+')'
		};

		msg[40008] = {
			text: 'existe un registro con estos datos ('+data+')',
	      	textEn: 'exist a record with this data ('+data+')'
		};

		msg[40009] = {
			text: 'esta session esta finaliada',
	      	textEn: 'this session is finished'
		};

		msg[40010] = {
			text: 'Valor de permiso ('+data+') no valido',
	      	textEn: 'Invalid ('+data+') permission value'
		};	
		
		msg[40011] = {
			text: 'Tipo de novedad ('+data+') no permitido',
	      	textEn: 'Type of novelty ('+data+') not allowed'
		};	
		
		msg[40012] = {
			text: 'El asociado ya tiene una novedad del mismo tipo para las fechas solicitadas.',
	      	textEn: 'The partner already has a novelty of the same type for the requested dates.'
		};

		msg[50000] = {
			text: data,
	      	textEn: data
		};		


		response = {
		  	'status'	: status,
		  	'message_es': msg[code].text,
		  	'message_en': msg[code].textEn,
		  	'result'	: data
		}

		if (error == true) {
			response.error = true;
			if (status != 500) 
				delete response.result;
		}

		return response;
	}
};




