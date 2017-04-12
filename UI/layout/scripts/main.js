$( document ).ready(function() {

    //Events ------------------------------------------
    $("#checkbutton").on("click", function(){
        var caseIdfield = $("#caseOrderId"),
            submitBatton = $(this),
            caseIdvalue = getCaseId(caseIdfield),
            preloader = $(".preloader"),
            circularG = $("#circularG"),
            wrongAlert = $("#wrongIdAlert"),
            visaStatus = $("#visaStatus");

        preloader.removeClass("displayNone");
        circularG.css("display", "block"); 

        $.ajax({           
            url: "/api/getstatus/" + caseIdvalue
        }).done(function(data) {
            if(data.error) {
                circularG.css("display", "none");
                preloader.addClass("displayNone");
            }
            var visaSatatusText = null;
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
        })
        .fail(function() {
           caseIdfield.addClass("error");
           wrongAlert.removeClass("visibilityOff");
        })
        .always(function() {
            circularG.css("display", "none");
            preloader.addClass("displayNone");
        });
    
    ;
    return false;
    });
    
    $( "#caseOrderId" ).blur(function() {
   
    });

    // $(document).on('click', function(e) {
    //     if (!$(e.target).closest(".parent_block").length) {
    //         $('.toggled_block').hide();
    //     }
    //     e.stopPropagation();
    // });

    $( "#caseOrderId" ).focus(function() {
        var el = $(this);
        if(el.hasClass("error")) {
            el.removeClass("error");
            $("#wrongIdAlert").addClass("visibilityOff");
        }
    });

    $("#getStatusBnt").on("click", function() {

    })
});

function getCaseId(fieldId) {    
    return fieldId.val();
}