const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const Comment = require("../../model/comment/Comment");
const appErr = require("../../utils/appErr");
//create
const createCommentCtrl = async (req, res,next) => {
  const {message} = req.body;

  try {
    //find the post
    const post = await Post.findById(req.params.id);
    //create comment
    const comment = await Comment.create({
      message,
      user: req.session.userAuth,
      post: post._id,
      // post: post._id,
    });
    //push comment to post
    post.comments.push(comment._id);

    //find the user
    const user = await User.findById(req.session.userAuth);

    //push comment to user

    user.comments.push(comment._id);
    //disable validation and save
    await post.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });
    
    console.log(post);
    res.redirect(`/api/v1/posts/${post._id}`);
  } catch (error) {
return next(appErr(error.message, 400));
  }
};

//single
const commentDetailsCtrl = async (req, res,next) => {
  try {
   const comment=await Comment.findById(req.params.id);
   res.render("comments/updateComment",{
     comment,error:""
     });
  } catch (error) {
    // res.json(error);
    // return next( appErr(error.message,400));
    res.render("comments/updateComment",{
      error:error.message
      });
  }
};

//delete
const deleteCommentCtrl = async (req, res) => {
  console.log(req.query.postId);
  try {
   //find the post
   const comment=await Comment.findById(req.params.id);
   //check if the post is created by the user
   if(comment.user.toString()!==req.session.userAuth.toString()){
     return next( appErr("You are not authorized to delete this comment",400));
   }
   //delete the post

   await Comment.findByIdAndDelete(req.params.id);
   res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    res.json(error);
  }
};

//Update
const upddateCommentCtrl = async (req, res,next) => {

  try {
    console.log("query", req.query);

    const comment=await Comment.findById(req.params.id);
    if(!comment){
      return next( appErr("Comment not found",400));
    }
    //check if the post is created by the user
    if(comment.user.toString()!==req.session.userAuth.toString()){
      return next( appErr("You are not authorized to update this comment",400));
    }
    //update the post
    const updatedComment= await Comment.findByIdAndUpdate(req.params.id,{
      message:req.body.message
    },
    {new:true}
    );

    res.redirect(`/api/v1/posts/${req.query.postId}`);

  } catch (error) {
    // res.json(error);
    return next(appErr(error.message,400));
  }
};

module.exports = {
  createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  upddateCommentCtrl,
};
