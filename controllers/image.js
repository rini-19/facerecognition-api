const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '8038e2f4e65045dd859d0442eae7fd2e'
});

const handleApiCall = (req, res) =>{
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		 .then(data => res.json(data))
		 .catch(err => res.json("unable to work with api"))
}

const handleImage = (req, res, db) =>{
	const {id} = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries =>{
			res.json(entries[0]);
		})
		.catch(err =>res.status(400).json("unable to determine entries"));
}

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
};