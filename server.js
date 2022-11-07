const express = require('express');
const app = express();

app.set('view engine', 'ejs');

// curl --header "accept:application/json" "localhost:8099/api/square/area/17"
app.get('/square/area/:length', (req,res) => {
	var result = {};
	result.shape = 'square';
	result.length = req.params.length;
	result.area = result.length ** 2;
	console.log(req.headers.accept);
	if (req.headers.accept == 'application/json') {
		res.status(200).json(result);
	} else {
		res.status(200).render('answer.ejs',{answer: result});
	}
})

app.listen(process.env.PORT || 8099);