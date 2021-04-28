const { save } = require("../../routes/activity");

    var payload = {};
    var connection = new Postmonger.Session();
    //Deepesh
    var lastStepEnabled=false;
    var currentStep = steps[0].key;
   
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

        // Disable the next button if a value isn't selected
        $('#select1').change(function () {
            var message = getMessage();
            connection.trigger('updateButton', { button: 'next', enabled: Boolean(message) });

            $('#message').html(message);
        });

        // Toggle step 4 active/inactive
        // If inactive, wizard hides it and skips over it during navigation
        $('#toggleLastStep').click(function () {
            lastStepEnabled = !lastStepEnabled; // toggle status
            steps[3].active = !steps[3].active; // toggle active

            connection.trigger('updateSteps', steps);
        })
    }








    // Deepesh end

connection.trigger('ready');
connection.on('initActivity',function(data){
    console.log(data);
    if (data) {
        payload = data;
    }
//Deepesh
var steps = [
    { "label": "Step 1", "key": "step1" },
    { "label": "Step 2", "key": "step2" },
    { "label": "Step 3", "key": "step3" },
    { "label": "Step 4", "key": "step4", "active": false }]

    // Deepesh end

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
    //Deepesh
        if (
            (currentStep.key === 'step3' && steps[3].active === false) ||
                currentStep.key === 'step4'
        ) {
            save();
        }

    else //Deepesh end
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
   connection.trigger('nextStep');
    //connection.trigger('updateActivity', payload);
}

//Deepesh till end
function showStep(step, stepIndex) {
    if (stepIndex && !step) {
        step = steps[stepIndex - 1];
    }

    currentStep = step;

    $('.step').hide();

    switch (currentStep.key) {
        case 'step1':
            $('#step1').show();
            connection.trigger('updateButton', {
                button: 'next',
                enabled: Boolean(getMessage())
            });
            connection.trigger('updateButton', {
                button: 'back',
                visible: false
            });
            break;
        case 'step2':
            $('#step2').show();
            connection.trigger('updateButton', {
                button: 'back',
                visible: true
            });
            connection.trigger('updateButton', {
                button: 'next',
                text: 'next',
                visible: true
            });
            break;
        case 'step3':
            $('#step3').show();
            connection.trigger('updateButton', {
                button: 'back',
                visible: true
            });
            if (lastStepEnabled) {
                connection.trigger('updateButton', {
                    button: 'next',
                    text: 'next',
                    visible: true
                });
            } else {
                connection.trigger('updateButton', {
                    button: 'next',
                    text: 'done',
                    visible: true
                });
            }
            break;
        case 'step4':
            $('#step4').show();
            break;
    }
}

});

