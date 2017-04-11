$( document ).ready(function() {
    var hostName =location.host;console.log(hostName);

    //Events ------------------------------------------
    $("#checkbutton").on("click", function(){
        var caseId = getCaseId("caseOrderId");
        $.ajax({           
            url: "/api/" + caseId
        }).then(function(data) {
            // if (data.status == "5") {

            // } else if (condition) {
                
            // } else {
                
            // } {}
        console.log(data);
        });
    });
    
    $( "#caseOrderId" ).blur(function() {
   // console.log( "Handler for .blur() called." );
    });
});

function getCaseId(fieldId) {
    return $("#" + fieldId).val();
}