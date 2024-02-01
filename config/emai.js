module.exports.email = {
	host: 'smtp.gmail.com',
    port: 465,
	secure: true, // use SSL
	auth: {
		user: process.env.email,
		pass: process.env.pass
	},
	templateDir: "api/emailTemplates",
	from:'ApoloDesk',
	testMode: false,
	ssl: true
}