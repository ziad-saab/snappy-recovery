;(function(){
  var Gun = require('gun');
  require('gun/lib/server');
  require('gun/axe');
	var config = {
		port: process.env.PORT,
    server: require('http').createServer(Gun.serve)
	};

	var gun = Gun({web: config.server.listen(config.port), file: 'data'});

	module.exports = gun;
}());