const ObjectId 				= require('mongodb').ObjectID;
const base64Img 			= require('base64-img');
const fs 					= require('fs');
//const { v4: uuidv4 } 		= require('uuid');
const phonevalid			= require('phone');
const validatePhoneNumber 	= require('validate-phone-number-node-js');
const moment 				= require('moment');
moment.locale('es');
//const request 				= require("request-promise");
const DeviceDetector = require("device-detector-js");
const momentTz = require('moment-timezone');

module.exports = {
	validAdmin :async function(userEmail)
	{
			let admin = await ModelService.findOne('Usuarios',{email:userEmail})
			if(!admin)
				return false		
			if(!admin.permisos)
				return false		
			if(!admin.permisos.admin)
				return false		
			
			return true
	},
	validApp :async function(app,permiso,userEmail)
	{
			let admin = await ModelService.findOne('Usuarios',{email:userEmail})
			if(!admin)
				return false		
			if(!admin.permisos)
				return false		
			if(admin.permisos[app]!=permiso.toUpperCase())
				return false		

			return true
	},
	loadFile : function(file, dirname, nameFile=null){
		return new Promise(function(resolve, reject) {			
			let name = ComunService.newObjectId()						
			let dir = 'assets/'+dirname;
		    if (!fs.existsSync(dir))
		    	fs.mkdirSync(dir);

		    let dirTmp = '.tmp/public/'+dirname;
		    if (!fs.existsSync(dirTmp))
		        fs.mkdirSync(dirTmp);


		    let loadPhoto 		= base64Img.imgSync(file, dir, name);
		    let loadPhotoTmp 	= base64Img.imgSync(file, dirTmp, name);

		    fs.chmodSync(loadPhoto, 0777, function(err){
		        if(err)
		        	console.log(err);
		        	return reject(false);
		    });

		    fs.chmodSync(loadPhotoTmp, 0777, function(err){
		        if(err)
		        	console.log(err);
		        	return reject(false);
		    });

		    
			let newName = loadPhoto.split('/'); 
			    newName = newName[newName.length-1];
		    return resolve(dirname+'/'+newName);
		})
	},
	loadCSVFile : function(file, dirname, nameFile=null){
		return new Promise(function(resolve, reject) {			
			//let name = ComunService.newObjectId()						

			let dir = 'assets/'+dirname;
	    if (!fs.existsSync(dir))
	    	fs.mkdirSync(dir);

	    let dirTmp = '.tmp/public/'+dirname;
	    if (!fs.existsSync(dirTmp))
	        fs.mkdirSync(dirTmp);

      file.upload({
          maxBytes: 10000000,
          dirname: require('path').resolve(sails.config.appPath, dir)
      }, 
      async function (err, uploadedFiles) {
          if(err)
          {
              console.log('Error upload file', err);
              return resolve({status:400,result:err})
          }
          else
          {
              var filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/')+1);
              var uploadLocation = require('path').resolve(sails.config.appPath, dir+'/' + filename);
              var tempLocation = require('path').resolve(sails.config.appPath, dirTmp+'/' + filename);
              fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));
              return resolve({status:200,result:dir+'/'+filename})
          }
      }); 
		})
	},	
	zeroPad : function(num, length,txt='0') {
	  return num.toString().padStart(length, txt);
	},
	isValidPhone : function(phone){
		let pnoneV = phonevalid(phone)
		return validatePhoneNumber.validate(pnoneV[0]);
	},
	formatPhone : function(phone){
		let pnoneV = phonevalid(phone)
		return pnoneV[0];
	},
	isObjectIdValid : function(id){
		if (ObjectId.isValid(id)) 
			if (String(new ObjectId(id)) === id) 
				return true
			return false
		return false
	},
	toObjectId : function(id){
		if(ObjectId.isValid(id)) 
			return ObjectId(id) 
				
		return false
	},
	newObjectId : function(id){		
			return ObjectId(); 						
	},
	validEmail : function(email) {
	  	return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,5})$/.test(
	    	email
	  	);
	},
	validProfile : function(profile) {
		profile = profile.toUpperCase();
		if (profile === 'ADMIN' || profile === "USER") 
			return true;
		return false;
	},
	validGender : function(gender) {
		gender = gender.toLowerCase()
		if (gender === 'male' || gender === "female" || gender === "other") 
			return true;
		return false;
	},
	validBirthdate : function(date) {
	  	return /^([0-9]{4})\/([0-9]{2})\/([0-9]{2})$/.test(
	    	date
	  	);
	},
	capitalize : function(s) {
	  	if (typeof s !== 'string')
	  	{
	  		return s;
	  	}	
	  	else
	  	{
	  		s = s.toLowerCase();
	  		let separados = s.split(' ');
	  		let newS = '';
	  		for (var i = 0; i < separados.length; i++) {
	  			if (i == 0) 
	  			{
	  				newS = separados[i].charAt(0).toUpperCase() + separados[i].slice(1);
	  			}
	  			else
	  			{
	  				newS += ' '+separados[i].charAt(0).toUpperCase() + separados[i].slice(1);
	  			}
	  		}
	  		return newS;
	  	}
	},
	capitalizeOnlyFirst : function(s) {
	  	if (typeof s !== 'string')
	  	{
	  		return s;
	  	}	
	  	else
	  	{
	  		s = s.toLowerCase();
	  		let newS = s.charAt(0).toUpperCase() + s.slice(1);
	  		return newS;
	  	}
	},
	generateCode : function(length) {
		let result           = '';
	    let characters       = '0123456789';
	    let charactersLength = parseInt(length);
	    for ( let i = 0; i < parseInt(length); i++ ) {
	        result += characters.charAt(Math.floor(Math.random() * charactersLength));
	    }
	    return result;
	},
	formatDate : function(date, formatStart, formatEnd) {
		return moment(date, formatStart).format(formatEnd);
	},
	strToDefaultDate : function(date) {		
		return moment.utc(date).toDate();
	},
	timeZoneToUtc:function(dateTime,timeZone){
		
		let dateUtc=momentTz.tz(dateTime,timeZone);	 	    	
	    return moment.utc(dateUtc).toDate();
	},
	rangeDate : function(type) {		
		return [moment.utc().toDate(),moment.utc().add(1, type).toDate()];
	},
	eraseData : function(model) {
		delete model.createdAt
		delete model.updatedAt
		delete model.password
		return model
	},
	formatMoney: function(n, c, d, t)
	{
	    var c = isNaN(c = Math.abs(c)) ? 2 : c,
	    d = d == undefined ? "," : d,
	    t = t == undefined ? "." : t,
	    s = n < 0 ? "-" : "",
	    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
	    j = (j = i.length) > 3 ? j % 3 : 0;

	    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	},
	
    isBoolean:function(val){
    	return 'boolean' === typeof val || ((val.toString()=='true' || parseInt(val)==1) || (val.toString()=='false' || parseInt(val)==0))
    },
    toBoolean:function(val){
    	if(val.toString()=='true' || parseInt(val)==1)
    	   return true;
    	if(val.toString()=='false' || parseInt(val)==0)
    	   return false;
      return null;	
    },
    validate:function(params,fields){
    	let flag={error:false};
    	let val=[];
    	let name='';
    	let valid='';
    	let value='';
    	
    	for(i=0;i<fields.length;i++){    	     
    		[name,valid]=fields[i].split(':');    		    		
    		
    		if(params[name]==undefined){//no existe el campo
    			 flag=ResponseService.res(401, 40005, true, name);    			     			
    		}	 
    		else{
	    		value=params[name];
	    		if(valid.indexOf('email')>=0){//validar email
	    			if(!ComunService.validEmail(value))
				      flag=ResponseService.res(401, 20001, true);			      	    			
	    		}
	    		else if(valid.indexOf('boolean')>=0){//validar boolean	    		
	    			if(!ComunService.isBoolean(value))
				      flag=ResponseService.res(401, 40007, true,name);
				      
	    		}
	    		else if(valid.indexOf('number')>=0){//validar numero	    			
	    			if(isNaN(value))
				      flag=ResponseService.res(401, 40007, true,name);			     
	    		}
	    		else if(valid.indexOf('ObjectId')>=0){//validar numero
	    			if(!ComunService.isObjectIdValid(value))
				      flag=ResponseService.res(401, 40007, true,name);			     
	    		}
	    		else if(valid.indexOf('phone')>=0){//validar numero
	    			if(!ComunService.isValidPhone(value))
				      flag=ResponseService.res(401, 40007, true,name);			     
	    		}	
    	    }
    	    
    		if(flag.error)
    			break;
    	}
    	return flag;
    },
  arraytoObjectId : function(arr)
  {
  	for(let q=0;q<arr.length;q++)
  		arr[q]=ComunService.toObjectId(arr[q]);						
		return arr;
	},
	tagsToObject:function(tags){
		let array=[];		
		tags= JSON.parse(tags)		
		let obj=false
		for(i=0;i<tags.length;i++){			
			obj=ComunService.toObjectId(tags[i])
			if(obj)
			   array.push(obj)
		}		
		return array	 
	},
	getDevice:function(req){
		const deviceDetector = new DeviceDetector();		
        const userAgent = req.headers['user-agent'];
        const device = deviceDetector.parse(userAgent);            
        if(device.client!=null)        	
        	return device.client.type;
        return 'device';


	},
	generateCode:function() {
	  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	  let code = '';

	  for (let i = 0; i < 20; i++) {
	    const randomIndex = Math.floor(Math.random() * characters.length);
	    code += characters.charAt(randomIndex);

	    // Agregar un guion cada 5 caracteres (excepto al final)
	    if ((i + 1) % 5 === 0 && i !== 19) {
	      code += '-';
	    }
	  }

	  return code;
	}


    
}