var webapp = require('fh-webapp');
var express = require('express');
var mainjs = require('main.js');
$fh = require('fh-api');

var app = express();
app.use('/sys', webapp.sys(mainjs));
app.use('/mbaas', webapp.mbaas);
app.use('/cloud', webapp.cloud(mainjs));

var port = process.env.FH_PORT || process.env.VCAP_APP_PORT || 8001;
module.exports = app.listen(port, function(){
  console.log("App started at: " + new Date());
});
