
var connection = new Postmonger.Session();

connection.trigger('ready');

connection.on('initActivity',function(data){
    document.getElementById('Configuration').value=JSON.stringify(data);
}); 

connection.on('clickedNext',function(){
    var configuration=JSON.parse(document.getElementById('Configuration').value);
    connection.trigger('updateActivity', configuration);
})