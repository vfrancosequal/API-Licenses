module.exports.sendMail = function(template, email, subject, data=null) {
	//console.log(data,template,email,subject)
	sails.hooks.email.send(
	template, 
	{
		data: data
	},
	{
		to: email,
		subject: subject
	},
	function(err) {console.log(err || "Mail Sent to "+email+".");}
	)
}