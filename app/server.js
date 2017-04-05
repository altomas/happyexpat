var express         = require('express');
var path            = require('path'); // модуль для парсинга пути
var log             = require('./log')(module);

var server = express();


//var logger = require('express-logger');
//server.use(logger({path: "/logs/logfile.txt"}));

var bodyParser = require('body-parser');
server.use(bodyParser.json()); // support json encoded bodies
server.use(bodyParser.urlencoded({ extended: true })); // support encoded bo

//app.use(express.favicon()); // отдаем стандартную фавиконку, можем здесь же свою задать
//app.use(express.bodyParser()); // стандартный модуль, для парсинга JSON в запросах
//app.use(express.methodOverride()); // поддержка put и delete
//app.use(app.router); // модуль для простого задания обработчиков путей
//app.use(express.static(path.join(__dirname, "public"))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)


require('./rest')(server);

server.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

server.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});



module.exports = server;