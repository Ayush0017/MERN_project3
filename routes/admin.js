var express = require('express');
var url = require('url')
var router = express.Router();
var adminmodel = require('../models/adminmodel')

/* To check admin users */
/*router.use((req,res,next)=>{
	console.log("----"+req.session.sunm+"----")
	if(req.session.sunm==undefined || req.session.srole!='admin')
	{
		res.redirect('/login')
	}
	else
		next()
})*/


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('adminhome',{'sunm':req.session.sunm});
});

router.get('/manageusers', function(req, res, next) {
  adminmodel.fetchUser('register').then((result)=>{
	res.render('manageusers',{'result':result,'sunm':req.session.sunm});
	}).catch((err)=>{
	console.log(err)
  })
});

router.get('/manageuserstatus', function(req, res, next) {
  var urlObj=url.parse(req.url,true).query
  var collection_name="register"
  adminmodel.manageUserStatus(collection_name,urlObj).then((result)=>{
	res.redirect('/admin/manageusers');
	}).catch((err)=>{
	console.log(err)
  })
});

router.get('/cpadmin', function(req, res, next) {
  res.render('cpadmin',{'sunm':req.session.sunm,'output':''});
});
router.post('/cpadmin', function(req, res, next) {
  adminmodel.cpadmin(req.session.sunm,req.body).then((result)=>{

  	if(result==0)
  		msg="Invalid old password , please try again"
	else if(result==1)
		msg="New & confirm new password not matched"
	else
		msg="Password updated successfully"
  	res.render('cpadmin',{'sunm':req.session.sunm,'output':msg});
	
	}).catch((err)=>{
	console.log(err)
  })
});


router.get('/epadmin', function(req, res, next) {
  adminmodel.epadmin(req.session.sunm).then((result)=>{
  	var m="",f=""
  	if(result[0].gender=="male")
  		m="checked"
  	else
  		f="checked"
  	
  	var msg=""	
  	if(req.query.s)
  		msg="Profile updated successfully...."	
  			
  	res.render('epadmin',{'userDetails':result[0],'sunm':req.session.sunm,'m':m,'f':f,'output':msg});
  }).catch((err)=>{
	console.log(err)  
  })	
});

router.post('/epadmin', function(req, res, next) {
  adminmodel.updateDetails(req.body).then((result)=>{
	res.redirect('/admin/epadmin?s=true');
	}).catch((err)=>{
	console.log(err)
  })	  
});


module.exports = router;












