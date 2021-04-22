var express = require('express')
var app = express()
const axios = require('axios');
var authTokens = {};
var payload = [
    {
        "keys":{
            "ContactKey": "0033B00000V9hUFQAZ"
                },
        "values":{
            "Email":"akhil.passi12@accenture.com"
                }
    }];
var connection = new Postmonger.Session();

connection.trigger('ready');
connection.on('requestedTokens', onGetTokens);
connection.on('initActivity',function(data){
    document.getElementById('Configuration').value=JSON.stringify(data,null,2);
}); 

connection.on('clickedNext',function(){
    var configuration= JSON.parse(document.getElementById('Configuration').value);
    connection.trigger('updateActivity', configuration);
});

function onGetTokens(tokens) {
    console.log(tokens);
    authTokens = tokens;
}

function insertDE() {
    
    app.set('port', (process.env.PORT || 5000))
    app.use(express.static(__dirname + '/public'))

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
                    var json = CircularJSON.stringify(response);
              console.log(json);
              responsefromWeb.send(json);
            }) 
             .catch(function (error) {
                console.log(error);
            });
    })

    console.log(payload);
    
}
module.exports={insertDE};