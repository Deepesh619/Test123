
require('express')

var app = express()
//const axios = require('axios'); */
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
    
    
}
//module.exports.insertDE=insertDE;