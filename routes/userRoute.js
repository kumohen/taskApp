const router = require("express").Router();
const User = require("../models/user");
const Auth = require("../middleware/auth");



router.get("/users/me",Auth ,async(req,res)=>{
    
    res.send(req.user);
})
router.get("/users" ,async(req,res)=>{
    try {
        const users = await User.find()
        res.status(200).send(users)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/users/:id",async(req,res)=>{
   try {
       const user = await User.findById(req.params.id)
       res.status(200).send(user)
   } catch (e) {
        res.status(400).send(e)
   }
})
router.patch("/users/me",Auth,async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if(!isValidOperation){
        return res.status(400).send({error:"Invalid updates"})
    }
    try {
       /// const user = await User.findById(req.user._id);

        updates.forEach(update =>{
            req.user[update] = req.body[update]
        })
        await req.user.save()
       // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidator:true})
        res.status(200).send(req.user)
    } catch (e) {
         res.status(400).send(e)
    }
 })
 router.delete("/users/me",Auth,async(req,res)=>{
   try {
    //    const user = await User.findByIdAndDelete(req.user._id);
    //    if(user){
    //        res.send("deleted")
    //    }

    await req.user.remove()
    res.send(req.user)
   } catch (e) {
        res.status(400).send(e)
   }
    
})
router.post("/createUser",async(req,res)=>{
    const user = new User(req.body);
    try {
        await user.save()
        const token = await user.generateAuthToken();
        res.header('Authorization', 'Bearer '+ token);
        res.redirect("/");
       // res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get("/register",(req,res)=>{
    res.render("register");
})
router.post("/users/login",async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
     //   res.redirect("/");
     res.header('Authorization', 'Bearer '+ token);
     res.redirect("/");
      // res.send({user:user,token})
    } catch (e) {
        res.redirect("/login")
       // res.status(400).send(e)
       }
})
router.get("/login",(req,res)=>{
    res.render("login");
})
router.post("/users/logout",Auth ,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter(token =>{
            return token.token !== req.token
        })
        await req.user.save();
        res.redirect("/")
      //  res.send("you successfully logout ")
    } catch (e) {
        res.redirect("/login")
        //res.status(400).send(e)
    }
    
})
router.get("/protected",Auth,(req,res)=>{
  //  res.header('Authorization', 'Bearer '+ token);
    res.send("protected route")
    //res.render("newHome");
})
router.delete("/delete",async (req,res)=>{
    const users = await User.deleteMany();
    if(users){
        res.send("all user is deletd");
    }
})


module.exports = router;
