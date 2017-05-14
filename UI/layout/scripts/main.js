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
       
        if(errors.length > 0 ) {console.log("err");
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
                
                var visaSatatusText = null;
               
                setTimeout(function () {
                    switch(data.tracking.status){
                            case 0: visaSatatusText = "Not paid yet.";
                                    visaStatus.attr("data-color", "inProcessing");
                                    break;

                            case 2: visaSatatusText = "Payment registered. Try next day";
                                    visaStatus.attr("data-color", "inProcessing");
                                    break;

                            case 5: visaSatatusText = "In processing. Try next day";
                                    visaStatus.attr("data-color", "inProcessing");
                                    break;

                            case 10: visaSatatusText = "Processed! Wait for the letter.";
                                        visaStatus.attr("data-color", "processed");
                                    break;
                    }

                    if(visaSatatusText != null) {
                        caseIdfield.addClass("displayNone");
                        submitBatton.addClass("displayNone");      
                            stopPreloader(preloader, circularG);
                            visaStatus.html(visaSatatusText).removeClass("displayNone");  
                    }    
                }, 2000);
           }
        });
   
        return false;
    });
    
    
    $("#caseOrderId" ).focus(function() {
        var el = $(this);
        if(el.hasClass("error")) {
            el.removeClass("error");
            cancelWarning("#wrongIdAlert"); 
        }
    });

    $("#getStatusBnt").click(function() {    
        event.preventDefault();
        $("#subscribeForm").toggle();
    });

    $("#subscribeForm").submit(function(event) {
        event.preventDefault();

            var form = $(this),
            //_caseId = form.find("input[name='caseId']" ).val(),
            _email = form.find("input[name='email']" ).val(),
            url = "/api/subscribe",
            _caseId = $("#caseOrderId").val();
          
        // Send the data using post
        var posting = $.post( url, { caseid: _caseId, mail: _email });

        posting.done(function( data ) {
            alert('Subscribed');
            console.log(data);
        });
    });
    
});

//Preloader-------------------
function startPreloader(preloaderWrapp, preloader) {
     preloaderWrapp.removeClass("displayNone");
     preloader.removeClass("displayNone"); 
}

function stopPreloader(preloaderWrapp, preloader) {
     preloaderWrapp.addClass("displayNone");
     preloader.addClass("displayNone"); 
}

//Warnings-------------------------
function fireWarning(el, message) {

    var wrongAlert = $(el);
    wrongAlert.html(message);
    wrongAlert.removeClass("visibilityOff");
}

function cancelWarning(el) {
    $(el).addClass("visibilityOff");
}

//Validation-----------------------
function validate(value) {
    var args = {
        value: value,
        errors: []
    };

    isEmpty(args);   
    if(args.errors.length > 0) {
        return args.errors;
    }    
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
        arguments.errors.push({ errorType: 'maxLength', message: 'Case Order Id must have 10 symbols' });
    }
}