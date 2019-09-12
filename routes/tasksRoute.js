const router = require("express").Router();
const Task = require("../models/tasks");
const Auth = require("../middleware/auth");

router.get("/alltasks",async(req,res)=>{
    try {
        const tasks = await Task.find().populate('tasks');
        res.status(200).send(tasks);
    } catch (e) {
        res.status(400).send(e)
    }
   
})

router.get("/tasks",Auth,async(req,res)=>{
    const match ={}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    try {
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit)
            }
        }).execPopulate()
      
        res.status(200).send(req.user.tasks);
    } catch (e) {
        res.status(400).send(e)
    }
   
})
router.get("/tasks/:id",Auth,async(req,res)=>{
    const _id = req.params.id
    try {
       // const task = await Task.findById(req.user._id);
       const task = await Task.findOne({_id,owner:req.user._id})
        res.status(200).send(task);
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch("/tasks/:id",Auth,async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if(!isValidOperation){
        return res.status(400).send({error:"Invalid updates"})
    }
    try {
       // const task = await Task.findById(req.params.id);
       const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
       if(!task){
           res.status(404).send("no task found")
       }
        updates.forEach(update =>{
            task[update] = req.body[update]
        })
        await task.save()
       // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidator:true})
        res.status(200).send(task)
    } catch (e) {
         res.status(400).send(e)
    }
 })
 router.delete("/tasks/:id",Auth,async(req,res)=>{
    try {
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id});
        if(task){
            res.send("deleted")
        }
    } catch (e) {
         res.status(400).send(e)
    }
     
 })
 router.delete("/tasks",async(req,res)=>{
    try {
        const tasks = await Task.deleteMany();
        if(tasks){
            res.send("deleted")
        }
    } catch (e) {
         res.status(400).send(e)
    }
     
 })
router.post("/createTask",Auth,async(req,res)=>{
    const task = new Task({...req.body,owner:req.user._id});
   let postedby = '';
   try {
       await task.save()
       
       res.status(200).send({task,postedby:req.user.name});
   } catch (e) {
     res.status(400).send(e)
   }
})


module.exports = router ;