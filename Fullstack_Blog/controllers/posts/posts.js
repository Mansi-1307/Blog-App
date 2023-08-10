const Post = require("../../model/post/Post");  
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");

//create
const createPostCtrl = async (req, res,next) => {
  const { title, description, category, image, user} = req.body;
  
  try {
if(!title || !description || !category || !req.file){
// return next( appErr("Please provide all the details",400));
return res.render("posts/addPost",{error:"Please provide all the details"});
};
    const userId= req.session.userAuth;
    const userFound=await User.findById(userId);
    const post = await Post.create({
      title,
      description,
      category,
      image: req.file.path,
      user:userFound._id,
    });

    // console.log(userId);
    //push the postcreated
    userFound.posts.push(post._id);
    await userFound.save();
    // res.json({
    //   status: "success",
    //   data: post
    // });
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
// return next( appErr(error.message,400));
return res.render("posts/addPost",{error:error.message});
  }
};

//all
const fetchPostCtrl = async (req, res,next) => {
  try {
    //get the id
    const id=req.params.id;
    //find the post
    const post=await Post.findById(id).populate({
      path:"comments",
      populate:{
        path:"user",
      },
    }).populate("user");
    // res.json({
    //   status: "success",
    //   data: post,
    // });

    res.render("posts/postDetails",{post
    , error:""});
  } catch (error) {
    return next( appErr(error.message,400)); 
  }
};

//details
const fetchPostsCtrl = async (req, res,next) => {
  try {
    const posts = await Post.find().populate("comments");
    res.json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    // res.json(error);
    return next( appErr(error.message,400));
  }
};

//delete
const deletePostCtrl = async (req, res,next) => {
  try {
//find the post
        const post=await Post.findById(req.params.id);
    //check if the post is created by the user
    if(post.user.toString()!==req.session.userAuth.toString()){
      // return next( appErr("You are not authorized to delete this post",400));
      return res.render("posts/postDetails",{post
        , error:"You are not authorized to delete this post"});

    }
    //delete the post

    await Post.findByIdAndDelete(req.params.id);
    // res.json({
    //   status: "success",
    //   user: "Post deleted",
    // });
    res.redirect("/");

  } catch (error) {
    // res.json(error);
    // return next( appErr(error.message,400));
    return res.render("posts/postDetails",{post:""
      , error:error.message});

  }
};

//update
const updatepostCtrl = async (req, res,next) => {
const {title,description,category}=req.body;


  try {
    const post=await Post.findById(req.params.id);
    //check if the post is created by the user
    if(post.user.toString()!==req.session.userAuth.toString()){
      // return next( appErr("You are not authorized to update this post",400));
      return res.render("posts/updatePost",{post
        , error:"You are not authorized to update this post"});

    }
    //check if the user has uploaded the image
    if(req.file){
      await Post.findByIdAndUpdate(req.params.id,{
        title,
        description,
        category,
        image:req.file.path
      },
      {new:true}
      );
    }else{
      await Post.findByIdAndUpdate(req.params.id,{
        title,
        description,
        category,
      },
      {new:true}
      );
    }


    //update the post
    

    res.redirect(`/api/v1/posts/${req.params.id}`);
  } catch (error) {
    // res.json(error);
    return res.render("posts/updatePost",{post
      , error:error.message});

  }
};
module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatepostCtrl,
};
