   
   var payload = {};
   var connection = new Postmonger.Session();
   var steps = [
   {'key': 'dekey', 'label': 'Select Data Extension key'},
   {'key': 'DEmapping', 'label': 'Mapping'}
];

var currentStep = steps[0].key;
var pkColumnNumber = 0;
var columnNumber = 0;

connection.trigger('ready');
connection.on('initActivity',function(data){
   console.log(data);
   if (data) {
       payload = data;
   }
   var pkColumnNumberData =  payload['arguments'].execute.inArguments[0].pkColumnNumber;
   var columnNumberData =  payload['arguments'].execute.inArguments[0].columnNumber;
   var test =  payload['arguments'].execute.inArguments[0]['pkSrcCloumnName'+'1'];
   console.log('pkSrcCloumnName1 is : ' + test);
   document.getElementById('DEName').value= payload['arguments'].execute.inArguments[0].DEName;
   document.getElementById('pkColumnNumber').value= pkColumnNumberData;
   document.getElementById('columnNumber').value= columnNumberData;
   createrows();
   for (var i=1;i<=pkColumnNumberData;i++){
    document.getElementById('pkSrcCloumnName'+i).value = payload['arguments'].execute.inArguments[0]['pkSrcCloumnName'+i];
    document.getElementById('pkDestCloumnName'+i).value = payload['arguments'].execute.inArguments[0]['pkDestCloumnName'+i];
   }
   for (var i=1;i<=columnNumberData;i++){
    document.getElementById('srcCloumnName'+i).value = payload['arguments'].execute.inArguments[0]['srcCloumnName'+i];
    document.getElementById('destCloumnName'+i).value = payload['arguments'].execute.inArguments[0]['destCloumnName'+i];
   }
}); 
var eventDefinitionKey;
connection.trigger('requestTriggerEventDefinition');

connection.on('requestedTriggerEventDefinition',
function(eventDefinitionModel) {
//console.log('EVENT definition from req trigger Event- '+JSON.stringify(eventDefinitionModel));
   if(eventDefinitionModel){
     eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
   }
}); 

connection.on('clickedNext',onClickedNext);
connection.on('clickedBack', onClickedBack);
connection.on('gotoStep', onGotoStep);


function onClickedNext () {
    console.log('Current step'+currentStep.key);
   if (currentStep.key == 'DEmapping') {
       save();
   } else {
    console.log('Is it in else part: ');
    createrows();
       connection.trigger('nextStep');
   }
}

function deleteRows(table,rowCount,columnCount){
    do{
        table.deleteRow(rowCount);
        rowCount--;
    }
    while(rowCount>columnCount);
}

function createrows(){
    pkColumnNumber = parseInt(document.getElementById('pkColumnNumber').value);
    columnNumber = parseInt(document.getElementById('columnNumber').value);
    var table = document.getElementById('pkColumnTable');
    var rowCount = table.rows.length-1;
    console.log('pkColumnNumber : ' + pkColumnNumber);
    console.log('columnNumber : ' + columnNumber);
    console.log('rowCount : ' + rowCount);
    if (rowCount > pkColumnNumber){
        deleteRows(table,rowCount,pkColumnNumber);
    } 
    for (var i=1;i<=pkColumnNumber;i++){
    var htmlId = document.getElementById('pkSrcCloumnName'+i);
    if (htmlId != null) {
       continue;
    }
    var row = table.insertRow(i);
    var cell1 = row.insertCell(0);
   // cell1.innerHTML="Primary Destination Column "+i;
    document.getElementById("fontdesign").cell1.innerHTML="Primary Destination Column "+i;
    var cell2 = row.insertCell(1);
    var element1 = document.createElement("textarea");
    element1.id="pkSrcCloumnName"+i;
    cell2.appendChild(element1);
    var cell3 = row.insertCell(2);
    var element2 = document.createElement("textarea");
    element2.id="pkDestCloumnName"+i;
    cell3.appendChild(element2);
    }
    var table2 = document.getElementById('columnTable');
    var rowCount2 = table2.rows.length-1; 
    console.log('rowCount2 : ' + rowCount2);
    if (rowCount2 > columnNumber){
        deleteRows(table2,rowCount2,columnNumber);
    } 
    for (var i=1;i<=columnNumber;i++){
    var htmlId = document.getElementById('srcCloumnName'+i);
    if (htmlId != null) {
       continue;
    }
    var row = table2.insertRow(i);
    var cell1 = row.insertCell(0);
    cell1.innerHTML="Non-Primary Destination Column "+i;
    var cell2 = row.insertCell(1);
    var element1 = document.createElement("textarea");
    element1.id="srcCloumnName"+i;
    cell2.appendChild(element1);
    var cell3 = row.insertCell(2);
    var element2 = document.createElement("textarea");
    element2.id="destCloumnName"+i;
    cell3.appendChild(element2);
    }
}

function onClickedBack () {
   connection.trigger('prevStep');
}


function onGotoStep (step) {
    console.log('IN GOTO step ')
   showStep(step);
   connection.trigger('ready');
}

function showStep (step, stepIndex) {
   if (stepIndex && !step) {
       step = steps[stepIndex - 1];
   }

   currentStep = step;

   document.getElementById("step1").style.display = 'none';
   document.getElementById("step2").style.display = 'none';
   console.log('Current step 1-'+currentStep.key);

   switch (currentStep.key) {
   case 'dekey':
      document.getElementById("step1").style.display = 'block';
       break;
   case 'DEmapping':
       console.log('In the DE mapping- ');
       document.getElementById("step2").style.display = 'block';
       break;
   }
}



function save () {
    var DEName = document.getElementById('DEName').value;
    console.log('DEName: '+DEName);
    var inArguments = {};
    for (var i=1;i<=pkColumnNumber;i++){
        var sourceColumnName = document.getElementById('pkSrcCloumnName'+i).value;
        var destColumnName = document.getElementById('pkDestCloumnName'+i).value;
        inArguments["pkSrcCloumnName"+i]=sourceColumnName;
        inArguments["pkSrcCloumnValue"+i]="{{Event."+ eventDefinitionKey +"."+sourceColumnName+"}}";
        inArguments["pkDestCloumnName"+i]=destColumnName;
    }
    for (var i=1;i<=columnNumber;i++){
        var sourceColumnName = document.getElementById('srcCloumnName'+i).value;
        var destColumnName = document.getElementById('destCloumnName'+i).value;
        inArguments["srcCloumnName"+i]=sourceColumnName;
        inArguments["srcCloumnValue"+i]="{{Event."+ eventDefinitionKey +"."+sourceColumnName+"}}";
        inArguments["destCloumnName"+i]=destColumnName;
    }
    inArguments["pkColumnNumber"]=pkColumnNumber;
    inArguments["columnNumber"]=columnNumber;
    inArguments["DEName"]=DEName;
    console.log("Built inArguments are ::: " + JSON.stringify(inArguments))
   payload['arguments'].execute.inArguments = [inArguments];  
   payload['arguments'].execute.useJwt = true;
   payload['configurationArguments'].save.useJwt = true;
   payload['metaData'].isConfigured = true;
   payload['key'] = 'REST-1';
   payload['type'] = 'REST';
   console.log('Total PAyload: - '+JSON.stringify(payload));
   connection.trigger('updateActivity', payload);
}


