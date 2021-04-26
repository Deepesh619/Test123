
//const express = require(['express']);
//import express from '../../node_modules/express';
 //= require('express')
//const app = app();
//const axios = require('axios');
//import app from '../../app.js'; 
//console.log(app);
/*var querystring = require('querystring');
var https = require('https');

var payload = [
    {
        "keys":{
            "ContactKey": "0033B00000V9hUFQAZ"
                },
        "values":{
            "Email":"akhil.passi12@accenture.com"
                }
    }];*/
    var authTokens = {};
    var payload = {};
    var connection = new Postmonger.Session();

connection.trigger('ready');
connection.on('requestedTokens', onGetTokens);
connection.on('initActivity',function(data){
    console.log(data);
    if (data) {
        payload = data;
    }
    document.getElementById('Configuration').value=JSON.stringify(data,null,2);
}); 

connection.on('clickedNext',function(){

    payload['arguments'].execute.inArguments = [{
        "tokens": authTokens,
        "Email": "akhil.passi444@accenture.com",
        "ContactKey" : "0033B00HHH9hUFQAZ"
    }];
    
    payload['metaData'].isConfigured = true;
    //payload.key = 'REST';
    console.log(payload);
    connection.trigger('updateActivity', payload);
});


function onGetTokens(tokens) {
    console.log(tokens);
    authTokens = tokens;
}

function insertDE() {
    
  /*  app.set('port', (process.env.PORT || 5000))
    app.use(__dirname + '/public')

    app.get('/connecttoMCData', function(request, responsefromWeb) {
	
        axios({
            method: 'post',
            url: 'https://www.exacttargetapis.com/hub/v1/dataevents/key:CustomActivityTest/rowset',
            data: payload,
            headers:{
               'Authorization': 'Bearer ' + authTokens,
               'Content-Type': 'application/json',
            }
          })
            .then(function(response) {
                    var json = response;
              console.log(json);
              responsefromWeb.send(json);
            }) 
             .catch(function (error) {
                console.log(error);
            });
    })

    console.log(payload); */
}
//module.exports.insertDE=insertDE;