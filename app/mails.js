'use strict';
var config      = require('./config');
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.get('mailing').user,
        pass: config.get('mailing').pass
    }
});

var mailing = function(from_who){
    
    from_who = from_who || config.get('mailing').from;

    // Send a message to the specified email address when you navigate to /submit/someaddr@email.com
    // The index redirects here
    var submitMail = function(emailTo, subject, body, done, emailFrom) {


            // setup email data with unicode symbols
        var mailOptions = {
            from: emailFrom || from_who, // sender address
            to: emailTo, // list of receivers
            subject: subject, // Subject line
            text: '', // plain text body
            html: body // html body
        };

        // // send mail with defined transport object
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                    done (err);
                    return;
                }
                
                done()
        });
    };

    return { submit: submitMail };
};

module.exports = mailing;