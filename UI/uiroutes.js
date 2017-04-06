var jst = require('jst');

var log    = require('../app/log')(module);


var uiRenderings = function (server){
        server.get('/', function (req, res) {
            console.log("home")
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

