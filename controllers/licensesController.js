import Licenses from "../models/Licenses.js";
import {generateCode, toBoolean} from "../services/comunServices.js";
import moment from 'moment'

//Leer
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
  		res.status(200).json({ status: 200, msg: "Operación realizada con éxito", data: newLicense });
  	} catch (error) {
    	console.log(error);
    	return res.status(400).json({error});
  	}
}

export {
  listLicenses,
  createLicenses
}