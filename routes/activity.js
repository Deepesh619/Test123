'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');
var querystring = require('querystring');
const { Console } = require('console');
exports.logExecuteData = [];

// Variables Decleration
var authHost = process.env.authHost;//'mcllzpmqql69yd9kvcz1n-mj1fqy.auth.marketingcloudapis.com';
var authEndpoint = '/v2/token';
var authData = {
  "grant_type": "client_credentials",
  "scope": null,
  "account_id": process.env.acctId,//"518002598",
  "client_id": process.env.clientId,//"1ye7xpmi31xwlu7xotjkauyv",
  "client_secret":process.env.clientSecret//"Z3bAfZPzvGM05d7cu05RVTmx"  
};
var authHeaders = {
  'Content-Type': 'application/json'
};
var MCHost = process.env.mcHost;//'mcllzpmqql69yd9kvcz1n-mj1fqy.rest.marketingcloudapis.com';
var MCEndpoint = '';
var method="POST";

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
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */

exports.execute = function (req, res) {

  var rowData=[];
  var accesstoken=null;
  
      JWT(req.body, process.env.jwtSecret, (err, decoded) => {

        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            
            // decoded in arguments
            MCEndpoint = '/hub/v1/dataevents/key:'+ decoded.inArguments[0].DEName +'/rowset' ;          
          //  console.log("Value of Src Col1 from inArgument : " + decoded.inArguments[0].srcCloumnValue1);
          //  console.log("Value of Src Col2 from inArgument : " + decoded.inArguments[0].srcCloumnValue2);
          //  console.log("Dest Col1 from inArgument : " + decoded.inArguments[0].pkDestCloumnName1);
          //  console.log("Dest Col2 from inArgument : " + decoded.inArguments[0].destCloumnName2);
          var pkColumnNumberData =  decoded.inArguments[0].pkColumnNumber;
          var columnNumberData =  decoded.inArguments[0].columnNumber;
          var setKey={};
          var setValues={};
          for (var i=1;i<=pkColumnNumberData;i++){
            var destColumnName = decoded.inArguments[0]['pkDestCloumnName'+i];
            var srcColumnValue = decoded.inArguments[0]['pkSrcCloumnValue'+i];
            setKey[destColumnName]=srcColumnValue;
           }
           for (var i=1;i<=columnNumberData;i++){
            var destColumnName = decoded.inArguments[0]['destCloumnName'+i];
            var srcColumnValue = decoded.inArguments[0]['srcCloumnValue'+i];
            setValues[destColumnName]=srcColumnValue;
           }
            rowData = [{
              "keys":setKey,
              "values":setValues             
                    }]; 
                    console.log('Row Data :'+ JSON.stringify(rowData));     

            //res.send(200, 'Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    }); 
    
    console.log('MCEndpoint is : ', MCEndpoint);
      //  logData(req);
     performPostRequest(authEndpoint,authHost,authHeaders, method, authData, function(data) {
        accesstoken = data.access_token;
        console.log('Access token is: ', accesstoken);
        insertRecordsIntoDE(rowData,accesstoken);
      });
     res.send(200, 'Execute'); 

    // example on how to decode JWT
     
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

/*
 * Below function is used to perform the rest call.
 */

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

/*
 * Below function is used to insert the records into DE.
 */

function insertRecordsIntoDE(rowData,accesstoken){
  var MCHeaders = {
    'Content-Type': 'application/json',
    'Authorization' : 'Bearer ' + accesstoken
  };
  console.log('Row data From Inarguments'+JSON.stringify(rowData));
  performPostRequest(MCEndpoint,MCHost,MCHeaders, method, rowData, function(data) {
    console.log(data);
  });
}