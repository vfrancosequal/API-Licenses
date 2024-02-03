import Licenses from "../models/Licenses.js";
import User from "../models/User.js";
import {generateCode, toBoolean} from "../services/comunServices.js";
import moment from 'moment';
import ObjectID from 'mongodb';

//Listar Licencias
const listLicenses = async (req, res) => {
	try{
		let params = req.query;
		let query = {};
		if(params.hasOwnProperty('status'))
			query.status = toBoolean(params.status);
	  	const licenses = await Licenses.find(query);
	  	res.status(200).json({ status: 200, msg: "Operación realizada con éxito", data: licenses});
	}catch(err){
	  	res.status(400).json({err});
	}
}
//Crear Licencias
const createLicenses = async (req,res)=>{
	let params = req.body;
	if(!params.hasOwnProperty('customerMail')){
	    return res.status(404).json({ msg: "customerMail es un campo obligatorio"});		
	}
	if(!params.hasOwnProperty('customerName')){
	    return res.status(404).json({ msg: "customerName es un campo obligatorio"});		
	}
	if(!params.hasOwnProperty('initialDate')){
	    return res.status(404).json({ msg: "initialDate es un campo obligatorio"});		
	}
	if(!params.hasOwnProperty('expirationDate')){
	    return res.status(404).json({ msg: "expirationDate es un campo obligatorio"});		
	}
	if(!params.hasOwnProperty('purchaseDate')){
	    return res.status(404).json({ msg: "purchaseDate es un campo obligatorio"});		
	}
	if(!params.hasOwnProperty('usersNumber')){
	    return res.status(404).json({ msg: "usersNumber es un campo obligatorio"});		
	}
	if(!params.hasOwnProperty('licenseType')){
	    return res.status(404).json({ msg: "licenseType es un campo obligatorio"});		
	}
  	try {
		params.expirationDate = moment(params.expirationDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD")
		if(params.licenseType.toLowerCase() == "trial"){
			params.expirationDate = moment(params.initialDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD");
			params.expirationDate = moment(params.expirationDate,"YYYY-MM-DD").add(30, 'days').format("YYYY-MM-DD");
			params.usersNumber = 1
		}

		let exists = false;
		let newCode = "";
			newCode = generateCode();
		do {
			const license = await Licenses.findOne({licenseCode:newCode});
			if(!license)
				exists = true
		} while(!exists);

		let paramsData = {
			customerMail : params.customerMail.toLowerCase(),
			customerName : params.customerName,
			initialDate : moment(params.initialDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD"),
			expirationDate : params.expirationDate,
			purchaseDate : moment(params.purchaseDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD"),
			usersNumber : parseInt(params.usersNumber),
			licenseType : params.licenseType.toLowerCase(),
			licenseCode : newCode,
			status : true,
		};
		const licenseData = new Licenses(paramsData);
		const newLicense = await licenseData.save();
  		return res.status(200).json({ status: 200, msg: "Operación realizada con éxito", data: newLicense });
  	} catch (error) {
    	console.log(error);
    	return res.status(400).json({error});
  	}
}
//Info Licencias
const infoLicenses = async (req, res) => {
	try{
		let params = req.query;
		
		if(!params.hasOwnProperty('id'))
			return res.status(404).json({ status: 400, msg: "id de licencia es un campo obligatorio"});		
	  	
	  	const license = await Licenses.findById(params.id);
	  	return res.status(200).json({ status: 200, msg: "Operación realizada con éxito", data: license});
	}catch(err){
	  	return res.status(400).json({status: 400, err: err});
	}
}
//Cambiar Status
const statusLicenses = async (req, res) => {
	try{
		let params = req.body;
		
		if(!params.hasOwnProperty('id'))
			return res.status(404).json({ status: 400, msg: "id de licencia es un campo obligatorio"});
	  	
	  	const result = await Licenses.findById(params.id);
	  	if(!result)
			return res.status(404).json({ status: 400, msg: "Registro no encontrado"});
		
		result.status = result.status?false:true;

		const savedLicense = await result.save();
	  	return res.status(200).json({ status: 200, msg: "Operación realizada con éxito", data: savedLicense});
	}catch(err){
	  	return res.status(400).json({status: 400, err: err});
	}
}
//Actualizar Licencias
const updateLicenses = async (req, res) => {
	let params = req.body;
	if(!params.hasOwnProperty('id')){
	    return res.status(404).json({ msg: "id es un campo obligatorio"});		
	}
	if(!params.hasOwnProperty('customerMail')){
	    return res.status(404).json({ msg: "customerMail es un campo obligatorio"});		
	}
	if(!params.hasOwnProperty('customerName')){
	    return res.status(404).json({ msg: "customerName es un campo obligatorio"});		
	}
	if(!params.hasOwnProperty('initialDate')){
	    return res.status(404).json({ msg: "initialDate es un campo obligatorio"});		
	}
	if(!params.hasOwnProperty('expirationDate')){
	    return res.status(404).json({ msg: "expirationDate es un campo obligatorio"});		
	}
	if(!params.hasOwnProperty('purchaseDate')){
	    return res.status(404).json({ msg: "purchaseDate es un campo obligatorio"});		
	}
	if(!params.hasOwnProperty('usersNumber')){
	    return res.status(404).json({ msg: "usersNumber es un campo obligatorio"});		
	}
	if(!params.hasOwnProperty('licenseType')){
	    return res.status(404).json({ msg: "licenseType es un campo obligatorio"});		
	}
  	try {
	  	const result = await Licenses.findById(params.id);
	  	if(!result)
			return res.status(404).json({ status: 400, msg: "Registro no encontrado"});

		params.expirationDate = moment(params.expirationDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD")
		if(params.licenseType.toLowerCase() == "trial"){
			params.expirationDate = moment(params.initialDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD");
			params.expirationDate = moment(params.expirationDate,"YYYY-MM-DD").add(30, 'days').format("YYYY-MM-DD");
			params.usersNumber = 1
		}

		result.customerMail = params.customerMail.toLowerCase();
		result.customerName = params.customerName;
		result.initialDate = moment(params.initialDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD");
		result.expirationDate = params.expirationDate;
		result.purchaseDate = moment(params.purchaseDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD");
		result.usersNumber = parseInt(params.usersNumber);
		result.licenseType = params.licenseType.toLowerCase();
		result.licenseCode = result.licenseCode;
		result.status = result.status;

		const savedLicense = await result.save();
  		return res.status(200).json({ status: 200, msg: "Operación realizada con éxito", data: savedLicense });
  	} catch (error) {
    	console.log(error);
    	return res.status(400).json({error});
  	}	
}
//Validar Licencia
const validateLicense = async (req, res) => {
	try{
		let params = req.query;
		
		if(!params.hasOwnProperty('id'))
			return res.status(404).json({ status: 400, msg: "id de licencia es un campo obligatorio"});
	  	
	  	const result = await Licenses.findById(params.id);
	  	if(!result)
			return res.status(404).json({ status: 400, msg: "Codigo de licencia no válido"});
		
	  	if(!result.status)
			return res.status(404).json({ status: 400, msg: "Codigo de licencia no válido"});

		let today = moment().utc().format("YYYY-MM-DD");
		if(moment(today).isBefore(result.initialDate) || moment(today).isAfter(result.expirationDate))		
			return res.status(404).json({ status: 400, msg: "Codigo de licencia no válido"});

	  	return res.status(200).json({ status: 200, msg: "Operación realizada con éxito", data: {expirationDate:result.expirationDate,initialDate:result.initialDate,status:result.status}});
	}catch(err){
	  	return res.status(400).json({status: 400, err: "La operación no pude ser procesada"});
	}
}
//Vincular Licencia
const associateLicense = async (req, res) => {
	try{
		let params = req.body;
		console.log(params)
		if(!params.hasOwnProperty('id'))
			return res.status(404).json({ status: 400, msg: "Email de usuario es un campo obligatorio"});

		if(!params.hasOwnProperty('licenseCode'))
			return res.status(404).json({ status: 400, msg: "Código de licencia es un campo obligatorio"});		

	  	console.log("Antes");
	  	//const user = await User.findOne({_id : params.id.toLowerCase()});
	  	const user = await User.findById(params.id);
	  	console.log(user)
	  	if(!user)
			return res.status(404).json({ status: 400, msg: "Usuario no registrado"});
	  	
	  	const license = await Licenses.findById(params.id);
	  	if(!license)
			return res.status(404).json({ status: 400, msg: "Codigo de licencia no válido"});
		
	  	if(!license.status)
			return res.status(404).json({ status: 400, msg: "Codigo de licencia no válido"});

		let numLicenses = await Users.count({idLicense:license._id,_id:{'$ne':user._id}});
		if ((numLicenses+1) > license.usersNumber)
			return res.status(401).send(ResponseService.res(401, 30020, true));

	  	return res.status(200).json({ status: 200, msg: "Operación realizada con éxito", data:user});
	}catch(err){
	  	return res.status(400).json({status: 400, err: "La operación no pude ser procesada"});
	}	
}

export {
  listLicenses,
  createLicenses,
  infoLicenses,
  statusLicenses,
  updateLicenses,
  validateLicense,
  associateLicense
}