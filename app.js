const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
    name: "Example"
})

const defaultitems = [item1];



app.get("/", function(req,res){
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    const day = today.toLocaleDateString("en-US", options);

    Item.find({}).then((founditems)=>{
        if(founditems.length === 0){
            Item.insertMany(defaultitems);
            res.redirect("/");
        } else{
            res.render("list", {day : day, newlistitem: founditems});
        }
    }).catch((err) => {
        console.log(err);
    })
    
    
});

app.post("/", function(req,res){
    const itemname = req.body.newitem;
    const item = new Item ({
        name: itemname
    })
    item.save();
    res.redirect("/");
});

app.post("/delete", function(req,res){
    const deleteid = req.body.element;
    Item.findByIdAndRemove(deleteid).then(()=>{
        console.log("success");
        res.redirect("/");
    })
})

app.listen(3000, function(){
    console.log("server is now live in port:3000")
});