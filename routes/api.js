const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const router = express.Router();

function arrayReducer(original) {
  const reduced = [];
  const copy = original.slice(0);

  for (let i = 0; i < original.length; i++) {
		let count = 0;	
		for (let w = 0; w < copy.length; w++) {
			if (original[i] === copy[w]) {
				count++;
				delete copy[w];
			}
		}
 
		if (count > 0) {
			const a = {};
			a.word = original[i];
			a.count = count;
			reduced.push(a);
		}
	}
  return reduced;
}


function countFrequency(text, n) {
  const clean = text.replace(/[^a-zA-Z]/g, ' ').split(' ').filter(Boolean).sort();
  const array = arrayReducer(clean);
  array.sort(function (a, b) {
    return (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0)} 
  );
  const returnArray = [];
  for (let i = 0; i < n; i++) {
    returnArray.push(array[i]);
  }

  const returnObj = {};

  if (array.length < n) {
    returnObj.success = false;
  } else {
    returnObj.success = true;
    returnObj.wordlist = returnArray;
  }

  return returnObj;
}


router.post('/api/count/', bodyParser.json(), async (req, res) => {
  const data = await axios.get('http://terriblytinytales.com/test.txt');
  const result = countFrequency(data.data, req.body.N);
  res.status(200).json({
      data: result
  });
});

module.exports = router;
