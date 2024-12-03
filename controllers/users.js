
const user=require("../models/user");



module.exports.signup=(req,res)=>{
    res.render("users/signup.ejs")
}



module.exports.renderSignUPForm=async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newuser=new user({email,username});
        const registereduser=await user.register(newuser,password);
        console.log(registereduser);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wanderlust");
        res.redirect("/listings");
        })
        
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}




module.exports.renderLoginform=(req,res)=>{
    res.render("users/login.ejs")
}





module.exports.login=async(req,res)=>{
    req.flash("success","welcome back to wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
    })
    }