//jshint esversion:6

const express= require('express');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todoDB',{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify',false);

const itemsSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true
    }
});

const Item = mongoose.model("Item",itemsSchema);

app.get('/',function(req,res){
   Item.find({},function(err,foundItems){
       if(err){
           console.log(err);
       }else{
           res.render("list",{newListItems: foundItems});
       }
   });
});

app.post('/',function(req,res){
    const itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect('/');
});

app.post('/delete',function(req,res){
    const itemId= req.body.checkbox;
    Item.deleteOne({_id:itemId},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("deleted successfully!");
        }
    });
    res.redirect('/');
});




app.listen(3000,function(){
  console.log("Sever has started on port 3000");
});