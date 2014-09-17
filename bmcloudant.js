
var cloudant = require('cloudant')
var http = require('http');



var port = (process.env.VCAP_APP_PORT || 1337);
var host = (process.env.VCAP_APP_HOST || '0.0.0.0');


//Create a Webserver and respond
require('http').createServer(function(req, res) {	  
	//Set up the DB connection
	 if (process.env.VCAP_SERVICES) {
		  // Running on Bluemix. Parse for  the port and host that we've been assigned.
		  var env = JSON.parse(process.env.VCAP_SERVICES);
		  var host = process.env.VCAP_APP_HOST; 
		  var port = process.env.VCAP_APP_PORT;

  	  	console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    

		  
	 }
	
// Also parse out Cloudant settings.
if (process.env.VCAP_SERVICES) {
var cloudantenv = env['cloudantNoSQLDB'][0]['credentials'];
console.log('cloudant credentials: %s', cloudantenv); 	 
}
cloudant({account:cloudantenv.username, password:cloudantenv.password}, function(er, cloudant) {
  		if (er)
    		  return console.log('Error connecting to Cloudant account %s: %s', me, er.message)

  		// Clean up the database we created previously.
  		cloudant.db.destroy('rte', function() {
    		// Create a new database.
    		cloudant.db.create('rte', function() {
      		// specify the database we are going to use
      		var rte = cloudant.use('rte')
      		// and insert a document in it
      		rte.insert({ crazy: true }, 'IBM PaaS', function(err, body, header) {
        	if (err)
          		return console.log('[rte.insert] ', err.message)

        	console.log('you have inserted the document')
		res.write('you have inserted the document')
                res.write(body)  
        	console.log(body)
      })
    })
  })
})
}).listen(port, host);
console.log("Connected to port =" + port + " host =  " + host);

