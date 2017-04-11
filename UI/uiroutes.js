var jst = require('jst');

var log    = require('../app/log')(module);


var uiRenderings = function (server){
        //route to home page
        server.get('/', function (req, res) {
           
        jst.renderFile('./UI/home.html', {name: 'jst'}, 
            function(err, ctx) {
                    if(err){
                        console.log(err)
                        return;
                    }

                    res.send(ctx);
                });
    })
}

module.exports = uiRenderings

