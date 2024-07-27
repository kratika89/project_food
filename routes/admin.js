var express = require('express');
var pool = require("./pool")
var { LocalStorage } = require("node-localstorage")
var localStorage = new LocalStorage('./scratch')
var router = express.Router();

/* GET home page. */


router.get("/loginpage", function (req, res) {

  // console.log("admin:", admin)
  try {
    var admin = JSON.parse(localStorage.getItem('Admin'))
    if (admin==null) {
      res.render('loginpage', { message: '' })
    }
    else {
      res.render('dashboard', { data: admin, status: true, message: 'Login Success' })
    }

  }
  catch (e) {
    res.render('loginpage', { message: '' })
  }
})

router.post("/check_login", function (req, res) {
  pool.query("select * from admins where (emailid=? or mobilenumber=?) and password=?", [req.body.emailid, req.body.mobilenumber, req.body.password], function (error, result) {
    if (error) {
      res.render('loginpage', { data: [], status: false, message: 'Database error' })
    }
    else {
      if (result.length == 1) {
        localStorage.setItem("Admin", JSON.stringify(result[0]))
        res.render('dashboard', { data: result[0], status: true, message: 'Login Success' })
      }
      else {
        res.render('loginpage', { data: [], status: false, message: 'Invalid emailid/phonenumber/password' })
      }
    }
  })
})
router.get("/adminlogout", function (req, res) {
  localStorage.clear()
  res.redirect("/admin/loginpage")
})
module.exports = router;