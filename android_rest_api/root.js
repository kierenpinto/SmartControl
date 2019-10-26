const express = require('express')
const router = express.Router()


router.get('/', (req, res) => res.send('Hello World!'))

router.post('/', (req,res) => {
	// req.
	text = {
		'test':'Response'
	}
	// res.send("Post Request")
	res.json(text)
})

module.exports = router