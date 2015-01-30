// This is the exact code that I use for my bot ( http://steamcommunity.com/id/botlain/ ) on Steam...

var imgurg = exports;
var request = require('request');
var random = require("random-js")();
 
var CLIENT_ID = '';  // The Client ID provided by imgur. - https://api.imgur.com/oauth2/addclient
var images;

// imgurg.VERSION = require('../package.json').version;

// imgurg.cid = "";
imgurg.out = "";
imgurg.query = function(query){
	var query = { c: String(query) }
	var subcat = (query.c).match(/(?:^r\/)(.*)/);
	query.e = subcat && encodeURIComponent((query.c).substring(2,(query.c).length)) || encodeURIComponent(query.c);

	// console.log("Searching for "+query.c)

	var options = {
		encoding: 'utf8',
		json: true,
		headers: {
			'Authorization': 'Client-ID '+CLIENT_ID
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

		var errz = ""
		errz += "\nSTATUS CODE: "+String(stat || "000")+"\n----------------";
		errz += "  ERROR: "+String(err || "No Error Specified")+"\n";
		errz += "  RESPONSE: "+String(body.status)+"\n";
		errz += "  DATA RECIVED: "+String(body.data)+"\n\n";

		if (errz) { console.log(errz) };
		imgurg.out = {say:"Woops seems that seems like an error..."};
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
			if ( res === undefined ){ res = { statusCode: "000" } }
			if ( ((err != "" && body !== undefined) || res.statusCode !== 200) && String(body) != "undefined" ){
				if(body.data === undefined || isObjectEmpty(body.data) ){ return tError(res.statusCode, err, body); }
				var l = (body.data).length;
				
				var img = {
					table: body.data[random.integer(0,l)],
					url: "",
					say: "", 
					amount: l
				}

				if (img.table === undefined){ return tError(res.statusCode, err, body); }

				img.nsfw = Boolean(img.table.nsfw)
				if (img.nsfw == "undefined"){ img.url = false }

				img.url = String(img.table.link || "undefined");

				img.say = img.nsfw && img.url+" (NSFW)" || img.url;
				
				imgurg.out = img;
				return imgurg.out;

			}else{ return tError(res.statusCode, err, body); }
	});
}