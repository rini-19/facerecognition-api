const handleRegister = (req, res, db, bcrypt) =>{
	let {name, email, password} = req.body;
	if(!name || !email || !password)
		return res.status(400).json('incorrect form submission');
	var salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	db.transaction(trx =>{
		trx.insert({
			email: email,
			hash: hash
		})
		.into('login')
		.returning('email')
		.then(loginEmail =>{
			db('users')
			.returning('*')
			.insert({
				name: name,
				email: loginEmail[0],
				entries: 0,
				joined: new Date()
			})
			.then(user =>{
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json("unable to register"));
}

module.exports = {
	handleRegister: handleRegister
};