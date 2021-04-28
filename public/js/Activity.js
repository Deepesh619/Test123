
    //var payload = {};
    //var connection = new Postmonger.Session();

//Deepesh
'use strict';
define('module',function (require) {
	var Postmonger = require('postmonger');
	var connection = new Postmonger.Session();
    var payload = {};

var steps = [
    {'key': 'nextbutton', 'label': 'Select Data Extension key'},
    {'key': 'mapping', 'label': 'Mapping'}
];
var currentStep = steps[0].key;
var eventDefinitionKey = '';
var deFields = [];

$(window).ready(function () {
    connection.trigger('ready');
    connection.trigger('requestInteraction');
});

function initialize (data) {
    if (data) {
        payload = data;
    }
}

function onClickedNext () {
    if (currentStep.key === 'mapping') {
        save();
    } else {
        connection.trigger('nextStep');
    }
}

function onClickedBack () {
    connection.trigger('prevStep');
}

function onGotoStep (step) {
    showStep(step);
    connection.trigger('ready');
}

function showStep (step, stepIndex) {
    if (stepIndex && !step) {
        step = steps[stepIndex - 1];
    }

    currentStep = step;

    $('.step').hide();

    switch (currentStep.key) {
    case 'nextbutton':
        $('#step1').show();
        $('#step1 input').focus();
        break;
    case 'idselection':
        $('#step2').show();
        $('#step2 input').focus();
        break;
    }
}


//Deepesh end

connection.trigger('ready');
connection.on('initActivity',function(data){
    console.log(data);
    if (data) {
        payload = data;
    }
    document.getElementById('DEName').value= payload['arguments'].execute.inArguments[0].DEName;
    document.getElementById('mapping').value= payload['arguments'].execute.inArguments[0].mapping;
   // document.getElementById('srcCloumnName1').value= payload['arguments'].execute.inArguments[0].srcCloumnName1;
    //document.getElementById('pkDestCloumnName1').value= payload['arguments'].execute.inArguments[0].pkDestCloumnName1;
    //document.getElementById('srcCloumnName2').value= payload['arguments'].execute.inArguments[0].srcCloumnName2;
    //document.getElementById('destCloumnName2').value= payload['arguments'].execute.inArguments[0].destCloumnName2;
}); 
var eventDefinitionKey;
connection.trigger('requestTriggerEventDefinition');

connection.on('requestedTriggerEventDefinition',
function(eventDefinitionModel) {
//console.log('EVENT definition from req trigger Event- '+JSON.stringify(eventDefinitionModel));
    if(eventDefinitionModel){
      eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
      //  console.log(">>>Event Definition Key " + eventDefinitionKey);
        //If you want to see all
        //console.log('>>>Request Trigger', 
        //JSON.stringify(eventDefinitionModel));
    }

}); 


connection.on('clickedNext',function(){
    var DEName = document.getElementById('DEName').value;
    var srcCloumnName1 = document.getElementById('srcCloumnName1').value;
    var pkDestCloumnName1 = document.getElementById('pkDestCloumnName1').value;
    var srcCloumnName2 = document.getElementById('srcCloumnName2').value;
    var destCloumnName2 = document.getElementById('destCloumnName2').value;
    console.log('DEName is : '+ DEName);
    payload['arguments'].execute.inArguments = [{
        "srcCloumnValue1" : "{{Event."+ eventDefinitionKey +"."+srcCloumnName1+"}}",
        "srcCloumnValue2": "{{Event."+ eventDefinitionKey +"."+srcCloumnName2+"}}",
        "srcCloumnName1" : srcCloumnName1,
        "srcCloumnName2" : srcCloumnName2,
        "DEName" : DEName,
        "pkDestCloumnName1" : pkDestCloumnName1,
        "destCloumnName2" : destCloumnName2
    }];
   
    payload['arguments'].execute.useJwt = true;
    payload['configurationArguments'].save.useJwt = true;
    payload['metaData'].isConfigured = true;
    payload['key'] = 'REST-1';
    payload['type'] = 'REST';
   // console.log('Total PAyload: - '+JSON.stringify(payload));
    connection.trigger('updateActivity', payload);
});


//deepesh
connection.on('initActivity', initialize);
	connection.on('clickedNext', onClickedNext);
	connection.on('clickedBack', onClickedBack);
	connection.on('gotoStep', onGotoStep);
	connection.on('requestedInteraction', requestedInteractionHandler);
    connection.trigger('updateActivity', payload);

});

