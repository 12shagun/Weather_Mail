const nodemailer = require("nodemailer");
const schedule = require('node-schedule');
const CronJob =require('node-cron').CronJob;
const axios = require("axios");
const bodyParser = require('body-parser');
const secret = require('../secret/secretFile');

bodyParser.urlencoded({ extended: true });

module.exports = function (_, passport) {
    
    return {
        SetRouting: function (router) {
            router.get('/', this.index);
            router.get('/home', this.getHome);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);
            router.post('/weatherReport',this.report);
            router.post('/emailService',this.emailService);
        },
        index: function (req, res) {
            res.render('index');
        },
        getGoogleLogin: passport.authenticate('google', {
            scope: ['profile', 'email']
            //scope: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/plus.profile.emails.read'] // <=== This will

        }),
        emailService: function(req,res){
            var city=req.body.city;
        
          // e-mail transport configuration
          let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: '17uec111@lnmiit.ac.in',
                  pass: secret.password
                }
            });

            var rule = new schedule.RecurrenceRule();
            rule.minute=0;
            rule.hour=8;
            var j = schedule.scheduleJob(rule,async function(){
                var data= await axios({
                    method: "GET",
                    url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${secret.key}`
                }).then(res => {
                    return res.data;
                   }).catch(err => console.log(err));
    
            let mailOptions = {
                from: '17uec111@lnmiit.ac.in',
                to: req.user.email,
                subject: 'Email from Weather_App: Weather Report for Today!',
                text: `Temperature is ${data.main.temp}.Today's weather is ${data.weather[0].main}`
           };
    
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent' );
                    }
                });
              });
              res.render('emailService',{
                user: req.user
            });
        },
        /* var time = req.body.time;
        var hour = Number(req.body.hour);
        var minute = Number(req.body.minute);
        if(time=="PM"||time=="pm")
        {
            hour+=12;
            if(hour==24)
            hour=0;
        }
        const date = new Date();
        const nowMinutes = date.getMinutes();
        const nowHours =date.getHours();
        console.log(nowHours+" "+nowMinutes);
        var diffminute=Math.abs(nowMinutes-minute);
        var diffhour=Math.abs(nowHours-hour);
        if(nowMinutes>minute)
        {
            diffhour--;
            diffminute=60-diffminute;
        }
        const cronHour={diffhour};
        const cronMinute ={diffminute};
        var rule = new schedule.RecurrenceRule();
      //  rule.hour = cronHour;
       console.log(typeof(cronHour)+typeof(rule.minute));
       //rule.minute = cronMinute;
        console.log(diffhour+" "+diffminute);
       //rule.second=2;
       rule.minute=6;
       rule.hour=17;
       /* var j = schedule.scheduleJob(rule, function(){
            console.log("hyyy");
        });*/
        
        /* cron.schedule('1 * * * * *', () => {
           //Send e-mail
          transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' );
                }
            });
            console.log("hyyyyy");
          },{
            scheduled: true,
            timezone: "Asia/Kolkata"
          });*/
            
        
        report: async function(req,res) {
           
            var city=req.body.city;

               var data= await axios({
                    method: "GET",
                    url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=730d4aef694870918a6b4d6a8ecd6732`
                }).then(res => {
                    return res.data;
                   }).catch(err => console.log(err));
             
            res.render('report',{data:data,user:req.user,city:city.toUpperCase()});
        },
        getHome: function (req, res) {
            res.render('home', {
                user: req.user
            })
        },
        googleLogin: passport.authenticate('google', {
            successRedirect: '/home',
            failiureRedirect: '/signup',
            failiureFlash: true
        }),
    }

}