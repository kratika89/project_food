const express = require('express')

const upload = require("./multer")
const pool = require("./pool")
const fs=require("fs")
var {LocalStorage}=require("node-localstorage")
var localStorage=new LocalStorage('./scratch')
const router = express.Router()

router.get('/food_interface', function (req, res) {
//     var admin=JSON.parse(localStorage.getItem('Admin'))
//   console.log("admin:",admin)
  try{
    var admin=JSON.parse(localStorage.getItem('Admin'))
  if(admin==null){
  res.render('loginpage',{message:''})
  }
  else{
    res.render("foodinterface",{message:""})
  }

}
catch{
  res.render('loginpage',{message:''})
}

});

router.post('/sumbit_food', upload.single('foodpicture'), function (req,res) {
    try {
        pool.query("insert into fooditems(category_id, subcategory_id, foodname, ingrediennts, description, price, offerprice, foodtype, status, foodpicture) values(?,?,?,?,?,?,?,?,?,?)", [req.body.category_id, req.body.subcategory_id, req.body.foodname, req.body.ingrediennts, req.body.description, req.body.price, req.body.offerprice, req.body.foodtype, req.body.status, req.file.filename], function (error, result) {
            if (error) {
                console.log("Error:", error)
                res.render('foodinterface', { message: 'Their is issue in loading database.' })
            }
            else {
                res.render('foodinterface', { message: 'Result loaded successfully.' })
            }
        })
    }
    catch (e) {
        res.render('foodinterface', { message: 'Server issue...Please contact with backend team.' })
    }
})
router.get('/fillcategory',function(req,res){
try{
pool.query("select * from category",function(error,result){
    if(error){
        res.json({data:[],status:false,message:'Database error'})
    }
    else{
        res.json({data:result,status:true,message:'Success'})
    }
})
} 
catch(e){
    res.json({data:[],status:false,message:'Server Error..contact with backend team.'})
}
})

router.get('/fillsubcategory',function(req,res){
    try{
    pool.query("select * from subcategory where category_id=?",[req.query.category_id],function(error,result){
        if(error){
            res.json({data:[],status:false,message:'Database error'})
        }
        else{
            res.json({data:result,status:true,message:'Success'})
        }
    })
    } 
    catch(e){
        res.json({data:[],status:false,message:'Server Error..contact with backend team.'})
    }
    })


router.get('/displayallfood',function(req,res){
//     var admin=JSON.parse(localStorage.getItem('Admin'))
//   console.log("admin:",admin)
  try{
    var admin=JSON.parse(localStorage.getItem('Admin'))
  if(admin==null){
  res.render('loginpage',{message:''})
  }
  else{
   try{
    pool.query("select F.*,(select C.category_name from category C where C.category_id=F.category_id) as categoryname,(select S.subcategoryname from subcategory S where S.subcategory_id=F.subcategory_id) as subcategoryname from fooditems F",function(error,result){
        if (error){
            res.render('displayallfood',{status:false,data:[]})
        }
        else{
            res.render('displayallfood',{status:true,data:result}) 
        }
    
    })
}
catch(e){
    res.render('displayallfood',{status:false,data:[]}) 
}
}
  }
  
catch{
  res.render('loginpage',{message:''})
}
});

router.get('/show_product',function(req,res){
    pool.query("select F.*,(select C.category_name from category C where C.category_id=F.category_id) as categoryname,(select S.subcategoryname from subcategory S where S.subcategory_id=F.subcategory_id) as subcategoryname from fooditems F where F.food_id=?",[req.query.food_id],function(error,result){
        if (error){
            res.render('showproduct',{status:false,data:[]})
        }
        else{
            res.render('showproduct',{status:true,data:result[0]}) 
        }
    
})
})



router.post('/update_food',function(req,res){
if(req.body.btn=="Edit"){
    pool.query("update fooditems set category_id=?, subcategory_id=?, foodname=?, ingrediennts=?, description=?, price=?, offerprice=?, foodtype=?, status=? where food_id=?",[req.body.category_id, req.body.subcategory_id, req.body.foodname, req.body.ingrediennts, req.body.description, req.body.price, req.body.offerprice, req.body.foodtype, req.body.status ,req.body.food_id] ,function(error,result){
        if (error){
            console.log("Error:",error)
            res.redirect('/food/displayallfood')
        }
        else{
            res.redirect('/food/displayallfood')
        }
          
    
})
}
else{
    pool.query("delete from fooditems where food_id=?",[req.body.food_id] ,function(error,result){
        if (error){
            console.log("Error:",error)
            res.redirect('/food/displayallfood')
        }
        else{

            fs.unlink(`e:/foodproject/public/images/${req.body.foodpicture}`,function(error,result){
                if(error){
                    console.log(error)
                }
                else{
                    console.log("deleted")
                }
            })
            







            res.redirect('/food/displayallfood')
        }
          
})
}
})

router.get('/show_picture',function(req,res){
    res.render("showpicture",{data:req.query})
})


router.post('/edit_picture',upload.single('foodpicture'),function(req,res){
    pool.query("update fooditems set foodpicture=? where food_id=?",[req.file.filename,req.body.food_id],function(error,result){
        if(error){
            res.redirect('/food/displayallfood')

        }
        else{
            fs.unlink(`e:/foodproject/public/images/${req.body.oldfoodpicture}`,function(error,result){
                if(error){
                    console.log(error)
                }
                else{
                    console.log("deleted")
                }
            })
            res.redirect('/food/displayallfood')
            
        }
    })
})
module.exports = router