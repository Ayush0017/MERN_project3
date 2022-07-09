var express = require('express');
var url = require('url');
var router = express.Router();
var indexmodel = require('../models/indexmodel')
var sendMail = require('./emailApi')

/* To remove user */
var cunm,cpass
cunm=""
cpass=""
router.all('/login',(req,res,next)=>{
	req.session.sunm=undefined
	req.session.srole=undefined
	
	if(req.cookies.cunm!=undefined)
	{
		cunm=req.cookies.cunm
		cpass=req.cookies.cpass
	}
	
	next()
})



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/contact', function(req, res, next) {
  res.render('contact');
});

router.get('/service', function(req, res, next) {
  res.render('service');
});

router.get('/register', function(req, res, next) {
  res.render('register',{"output":""});
});

router.post('/register', function(req, res, next) {
  //console.log(req.body)
	indexmodel.registerUser(req.body).then			  		((result)=>{
		if(result.s)
		{
			sendMail(req.body.email,req.body.password)		
			res.render('register',{"output":"User register successfully...."});
		}
		else
			res.render('register',{"output":"User already exists please try again...."});
	}).catch((err)=>{
		console.log(err)
	})		  
});


router.get('/verifyUser', function(req, res, next) { 
  var emailid=url.parse(req.url,true).query.email		 
  indexmodel.verifyUser(emailid).then((result)=>{
  	res.redirect('/login'); 		  
  }).catch((err)=>{
  	console.log(err)	
  })
});


router.get('/checkEmail', function(req, res, next) {
  var emailid = req.query.emailid
  indexmodel.checkEmail(emailid).then((result)=>{
  	console.log(result)
  	if(result.length==0)
  		matchstatus=0
  	else
  		matchstatus=1	
  	res.json({'matchstatus':matchstatus}) 		  
  }).catch((err)=>{
  	console.log(err)	
  })
});


router.get('/login', function(req, res, next) {
  res.render('login',{'cunm':cunm,'cpass':cpass,'output':''});
});

router.post('/login', function(req, res, next) {
	indexmodel.userLogin(req.body).then((result)=>{
		if(result.length==0)
			res.render('login',{'cunm':cunm,'cpass':cpass,'output':'Invalid user or authenticate your account....'});
		else
		{
			//to store user details in session
			req.session.sunm=result[0].email
			req.session.srole=result[0].role
			
			//to store user details in cookies
			if(req.body.chk!=undefined)
			{
			res.cookie('cunm',req.body.email, {maxAge: 360000});
			res.cookie('cpass',req.body.password, {maxAge: 360000});	
			}
			 
			
			if(result[0].role=="user")			
				res.redirect('/user');
			else			
				res.redirect('/admin');			
		}	
	}).catch((err)=>{
		console.log(err)
	})		
});

module.exports = router;
