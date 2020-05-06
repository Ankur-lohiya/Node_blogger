var express = require('express');
var router = express.Router();
var multer=require('multer');
var upload=multer({dest:'./public/images'});
var mongo=require('mongo');
var db=require('monk')('localhost/nodeblog');

router.get('/show/:id', function(req, res, next) {
    var post=db.get('posts');
    post.find(req.params.id,{},function(err,post){
        res.render('show',{
            'post':post[0]
        });
    });
});

router.get('/add', function(req, res, next) {
    var categories=db.get('categories');
    categories.find({},{},function(err,categories){
        res.render('addpost',{
            title:'Add Post',
            categories:categories
        });
    });
});

router.post('/add',upload.single('main_image'),function(req,res,next){
    var title=req.body.title;
    var category=req.body.category;
    var body=req.body.body;
    var author=req.body.author;
    var date=new Date();
    if(req.file){
        var image=req.file.filename;
    }
    else{
        var image='noimage.jpg';
    }
    var posts=db.get('posts');
    posts.insert({
        'title':title,
        'body':body,
        'category':category,
        'author':author,
        'date':date,
        'mainimage':image
    },function(err,post){
        if(err){
            res.send(err);
        }
        else{
             res.location('/');
             res.redirect('/');
        }
    })
});

router.post('/addcomment',function(req,res,next){
    var name=req.body.name;
    var body=req.body.body;
    var postid=req.body.postid;
    var date=new Date();
    var comment={
        'name':name,
        'body':body,
        'commentdate':date
    }
    var posts=db.get('posts');
    posts.update({'_id':postid},{
        $push:{
            'comments':comment
        }
    },function(err,doc){
        res.location('/post/show/'+postid);
        res.redirect('/post/show/'+postid)
    });
});

module.exports = router;
