$( document ).ready(function() {

    //Events ------------------------------------------
    $("#checkbutton").on("click", function(){ 
       
        var caseIdfield = $("#caseOrderId"),
            submitBatton = $(this),
            caseIdvalue = caseIdfield.val(),
            preloader = $(".preloader"),
            circularG = $("#circularG"),            
            visaStatus = $("#visaStatus"),
            errors = validate(caseIdvalue);        
       
        if(errors.length > 0 ) {
            if(!caseIdfield.hasClass("error")) {
                caseIdfield.addClass("error");
            }

            errors.forEach(function(error) {
                fireWarning("#wrongIdAlert", error.message);
            }, this);
            
            return false;
        }
       
        startPreloader(preloader, circularG);

        $.ajax({           
            url: "/api/getstatus/" + caseIdvalue,
            success: function(data) {
                if(data.error) {
                    setTimeout(function () {
                      fireWarning("#wrongIdAlert", "Wrong Case Order Id!");
                      stopPreloader(preloader, circularG); 
                    }, 2000);  
                    return false;              
                } 
                // var result = checkInputText($(this));

                // if(!result.checked) {
                //     fireWarning(result.message);
                // }

                var visaSatatusText = null;
               
                setTimeout(function () {
                    stopPreloader(preloader, circularG);

                    switch(data.tracking.status){
                            case 5: visaSatatusText = "In processing. Try next day";
                                    visaStatus.attr("data-color", "inProcessing");
                                    break;
                            case 10: visaSatatusText = "Processed! Wait for the letter.";
                                        visaStatus.attr("data-color", "processed");
                                        break;
                    }

                    if(visaSatatusText != null) {
                        caseIdfield.addClass("visibilityOff");
                        submitBatton.addClass("visibilityOff");
                        visaStatus.html(visaSatatusText).removeClass("displayNone");                   
                    }          
                       
                }, 2000);
           }
           
        });
    //     .fail(function() { console.log("error");
    //        //caseIdfield.addClass("error");
          
    //     })
    //     .always(function() {
    //         //circularG.css("display", "none");
    //         //preloader.addClass("displayNone");
    //    });
        return false;
    });
    
    // $( "#caseOrderId" ).blur(function() {
        
    // });

    $("#caseOrderId" ).focus(function() {
        var el = $(this);
        if(el.hasClass("error")) {
            el.removeClass("error");
            cancelWarning("#wrongIdAlert"); 
        }
    });

    $("#getStatusBnt").on("click", function() {

    })
});

// function getCaseId(fieldId) {    
//     return fieldId.val() || null;
// }

function startPreloader(preloaderWrapp, preloader) {
     preloaderWrapp.removeClass("displayNone");
     preloader.removeClass("displayNone"); 
}

function stopPreloader(preloaderWrapp, preloader) {
     preloaderWrapp.addClass("displayNone");
     preloader.addClass("displayNone"); 
}

function fireWarning(el, message) {

    var wrongAlert = $(el);
    wrongAlert.html(message);
    wrongAlert.removeClass("visibilityOff");
}

function cancelWarning(el) {
    $(el).addClass("visibilityOff");
}

function validate(value) {
    var args = {
        value: value,
        errors: []
    };

     isEmpty(args);
     maxLength(args);

    return args.errors;
}

 function isEmpty(arguments) {
    if(!arguments.value) {
        arguments.errors.push({ errorType: 'isEmpty', message: 'Please, enter Case Order Id' });
    }
}

function maxLength(arguments) { 
    if (arguments.value.length != 10) {
        arguments.errors.push({ errorType: 'maxLength', message: 'value must be, 10 symbols' });
    }
}