const generateCode = () => {
  	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  	let code = '';
  	for (let i = 0; i < 20; i++) {
    	const randomIndex = Math.floor(Math.random() * characters.length);
    	code += characters.charAt(randomIndex);
    	if ((i + 1) % 5 === 0 && i !== 19) {
      		code += '-';
    	}
  	}
  	return code;
}

const toBoolean = (val) =>{
	if(val.toString()=='true' || parseInt(val)==1)
	   return true;
	if(val.toString()=='false' || parseInt(val)==0)
	   return false;
  return null;	
}

export {generateCode, toBoolean};