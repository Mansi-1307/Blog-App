//truncate
const truncatePost = post => {
    if(post.length>10){
        // return post.body.slice(0,100)+"...";
        return post.substring(0,10)+"..."; 
    }
    return post;
    }

    module.exports={
        truncatePost,
    }

    