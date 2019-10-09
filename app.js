var express=require('express');
var multer=require('multer');
var ejs=require('ejs');
var path=require('path');
var app=express();

// set storage engine
var storage = multer.diskStorage({
    destination:'./public/uploads/',
    filename:function(req,file,cb){
   cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
});

//Init upload
var upload=multer({
    storage: storage,
    limits:{fileSize:100000000000},
    fileFilter:function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('myImage');

/// checkFileType
function checkFileType(file,cb){
    // Allowed extensoins
    const fileTypes=/jpeg|jpg|png|gif/;
    //check ext
    var extname=fileTypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    var mimetype = fileTypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }
    else{
        cb('Error:Images only');
    }
}
app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
   if(err){
       res.render('index',{
           msg:err
       });
   }
   else{
       
       if(req.file==undefined){
           res.render('index',{
               msg:'Error: no file selected!'
           });
       }
       else{
        res.render('index',{
            msg:'file uploaded',
            file:`uploads/${req.file.filename}`
        });  
       }
   }
    })
})


app.set('view engine','ejs');
app.use(express.static('./public'));

app.get('/',(req,res)=>{
    res.render('index');
});


app.listen('4000',()=> console.log("server started"));