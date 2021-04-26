'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');
var querystring = require('querystring');
exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */

var authHost = 'mcllzpmqql69yd9kvcz1n-mj1fqy.auth.marketingcloudapis.com';
var authEndpoint = '/v2/token';
var authData = {
  "grant_type": "client_credentials",
  "scope": null,
  "account_id": "518002598",
  "client_id": "1ye7xpmi31xwlu7xotjkauyv",
  "client_secret":"Z3bAfZPzvGM05d7cu05RVTmx"  
};
var authHeaders = {
  'Content-Type': 'application/json'
};
var accesstoken=null;
  
var MCHost = 'mcllzpmqql69yd9kvcz1n-mj1fqy.rest.marketingcloudapis.com';
var MCEndpoint = '/hub/v1/dataevents/key:D4627FEA-5CDE-4641-9AEA-A6EF9DA8881F/rowset';
var rowData = [{
  "keys":{
      "ContactKey": "0033B00000V9hUFAW"
          },
  "values":{
      "Email":"akhil.passi122@accenture.com"
          }
 

  }
}
];
var method="POST";

function  performPostRequest(endpoint,host,headers, method, data, success) {
    var dataString = JSON.stringify(data);
    console.log(headers);
    var options = {
      host: host,
      path: endpoint,
      method: method,
      headers: headers
    };
  
    var req = http.request(options, function(res) {
      res.setEncoding('utf-8');
  
      var responseString = '';
  
      res.on('data', function(data) {
        responseString += data;
      });
  
      res.on('end', function() {
       // console.log(responseString);
       var responseObject =  JSON.parse(responseString);
        success(responseObject);
      });
    });
    req.write(dataString);
    req.end();
  }


  function insertRecordsIntoDE(){
    //var authuri = 'Bearer ' + accesstoken;
    //console.log(authuri);
    var MCHeaders = {
      'Content-Type': 'application/json',
      'Authorization' : 'Bearer ' + accesstoken
    };
    console.log(MCHeaders);
    performPostRequest(MCEndpoint,MCHost,MCHeaders, method, rowData, function(data) {
      console.log(data);
    });
  }

exports.execute = function (req, res) {
  
      console.log('This is start of execution- : '+req);
    performPostRequest(authEndpoint,authHost,authHeaders, method, authData, function(data) {
        accesstoken = data.access_token;
        console.log('Access token is: ', accesstoken);
        insertRecordsIntoDE();
      });
     res.send(200, 'Execute');
    // example on how to decode JWT
  /*  JWT(req.body, process.env.jwtSecret, (err, decoded) => {

        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            
            // decoded in arguments
            var decodedArgs = decoded.inArguments[0];
            
            logData(req);
            res.send(200, 'Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    }); */
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Publish');
    console.log('Published');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Validate');
};