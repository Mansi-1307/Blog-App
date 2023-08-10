const appErr = require("../utils/appErr");


const protected = (req, res, next) => {
    if(req.session.userAuth){
        next();
    }else{
    //    next(appErr("You are not logged in", 401));
    res.render('users/notAuthorize')
    }
}
module.exports = protected;