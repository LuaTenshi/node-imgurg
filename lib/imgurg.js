var imgurg = exports;
var request = require('request');
var random = require("random-js")();
 
var CLIENT_ID = 'GET YOUR OWN KEY';  // The Client ID provided by imgur. - https://api.imgur.com/oauth2/addclient

imgurg.VERSION = require('../package.json').version;

imgurg.cid = ""
imgurg.query = function(query){
	var query = { c: String(query) }
	var subcat = (query.c).match(/(?:^r\/)(.*)/);
	query.e = subcat && encodeURIComponent((query.c).substring(2,(query.c).length)) || encodeURIComponent(query.c);

	console.log("Searching for "+query.c)

	var options = {
		encoding: 'utf8',
		json: true,
		headers: {
			'Authorization': 'Client-ID '+self.cid;
		},
		method: 'GET'
	}

	if( subcat ){
		options.uri = 'https://api.imgur.com/3/gallery/r/'+query.e+'/';
	} else {
		options.uri = 'https://api.imgur.com/3/gallery/search/viral/top?q='+query.e;
	}

	function tError(stat, err, body){
		if( body === undefined ){ body={data:""} }
		if( body.data === undefined || body.data == "" ){ body.data = "No data recived" }
		console.log("\nSTATUS CODE: "+String(stat || "000")+"\n----------------")
		console.log("  ERROR: "+String(err || "No Error Specified"));
		console.log("  RESPONSE: "+String(body.status));
		console.log("  DATA RECIVED: "+String(body.data)+"\n");

		if (err) throw err;
		return false
	}

	function isObjectEmpty(obj) {
		for (var key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				return false;
			}
		}
		return true;
	}

	request(options, function (err, res, body) {
			if ( (err != "" && body !== undefined) || res.statusCode !== 200 ){
				if(body.data === undefined || isObjectEmpty(body.data) ){ return tError(res.statusCode, err, body); }
				var l = (body.data).length;
				
				var img = {
					table: body.data[random.integer(0,l)], 
					amount: l
				}

				img.url = img.table.link || false;

				return img
			}else{ return tError(res.statusCode, err, body); }
	});
}