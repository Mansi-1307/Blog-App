require("dotenv").config();
const express = require("express");
const session = require("express-session");

const MongoStore = require("connect-mongo");
const MethodOverride = require("method-override");

const commentRoutes = require("./routes/comments/comment");
const postRoutes = require("./routes/posts/posts");
const userRoutes = require("./routes/users/users");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const multer = require("multer");
const Post = require("./model/post/Post");
const {truncatePost} = require("./utils/helpers");
require("./config/dbConnect");

const app = express();

//helpers
app.locals.truncPost = truncatePost;
//configure ejs
app.set("view engine", "ejs");

//serve static files
app.use(express.static(__dirname + "/public"));
//middlewares
//-------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//method override
app.use(MethodOverride("_method"));


//session
app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ 
            mongoUrl: process.env.MONGO_URL,
            ttl:24*60*60
        }),

    })
);
//save the login user into locals
app.use((req, res, next) => {
    if(req.session.userAuth){
        res.locals.userAuth = req.session.userAuth;
    }
    else{
        res.locals.userAuth = null;
    }
    next();
}
)
//render home page
app.get("/", async (req, res) => {
    try{
        const posts = await Post.find().populate("user").populate("comments");
    res.render("index", { posts });

    }
    catch(error){
        res.render("index"), {error: error.message};
    }

});

//users route
app.use("/api/v1/users", userRoutes);

//posts route
app.use("/api/v1/posts", postRoutes);

//comments
app.use("/api/v1/comments", commentRoutes);

//Error handler middlewares

app.use(globalErrorHandler);
//listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Servver is running on PORT ${PORT}`));
