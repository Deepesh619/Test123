const { save } = require("../../routes/activity");

    var payload = {};
    var connection = new Postmonger.Session();

connection.trigger('ready');
connection.on('initActivity',function(data){
    console.log(data);
    if (data) {
        payload = data;
    }
    document.getElementById('DEName').value= payload['arguments'].execute.inArguments[0].DEName;
    document.getElementById('srcCloumnName1').value= payload['arguments'].execute.inArguments[0].srcCloumnName1;
    document.getElementById('pkDestCloumnName1').value= payload['arguments'].execute.inArguments[0].pkDestCloumnName1;
    document.getElementById('srcCloumnName2').value= payload['arguments'].execute.inArguments[0].srcCloumnName2;
    document.getElementById('destCloumnName2').value= payload['arguments'].execute.inArguments[0].destCloumnName2;
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
    if (currentStep.key == 'confirm')
    {
        save();
    }

    else
    {

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
}
});

