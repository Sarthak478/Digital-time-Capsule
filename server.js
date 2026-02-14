const express=require("express");
const fs=require("fs");
const path=require("path");
const app=express();
const PORT=3000;
app.set('view engine','ejs');
app.use(express.urlencoded({express: true}));
const capsulesFile=path.join(__dirname,"capsules.json");
let capsules=[];
if(fs.existsSync(capsulesFile)){
    capsules=JSON.parse(fs.readFileSync(capsulesFile))
}
app.get("/",(req,res)=>{
    res.render("index",{capsules});
})
app.post("/create",(req,res)=>{
    const { message, unlockDate } = req.body;
  capsules.push({ message, unlockDate });
  fs.writeFileSync(capsulesFile, JSON.stringify(capsules, null, 2));
  res.redirect("/");
});
app.get("/capsule/:id", (req, res) => {
    const capsule = capsules[req.params.id];
    const now = new Date();
    const unlock = new Date(capsule.unlockDate);
  
    const isUnlocked = now >= unlock;
    res.render("capsule", { capsule, isUnlocked });
  });
  app.listen(PORT,()=>{
    console.log(`Time capsule running at http://localhost:${PORT}`);
  });
