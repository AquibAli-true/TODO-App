import express from "express";
import fs from "node:fs";
import cors from "cors";
const app = express();
const corsOptions = {
    origin: 'http://localhost:5173' 
};

app.use(cors(corsOptions));


const port= 3333
app.use(express.json());

app.post('/task', async (req,res)=>{

        try{
        const text = await fs.promises.readFile('./Backend/tasks.json','utf8')
        const history = await fs.promises.readFile('./Backend/copy.json','utf8')
        const taskArr= JSON.parse(text)
        const taskHistory= JSON.parse(history)
        taskArr.push(req.body)
        taskHistory.push(req.body)
        await fs.promises.writeFile('./Backend/tasks.json',JSON.stringify(taskArr,null,2) ,'utf8')
        await fs.promises.writeFile('./Backend/copy.json',JSON.stringify(taskHistory,null,2) ,'utf8')
        res.status(201).send("ok")
        }
        catch(err){
            console.log(err)
            res.status(500).send("Failed to save task")
        }

    
}).patch('/edit',async (req,res)=>{
    try{
        const data = req.body
        const text=await fs.promises.readFile('./Backend/tasks.json','utf8')
        const history=await fs.promises.readFile('./Backend/copy.json','utf8')
        const taskArr=JSON.parse(text)
        const taskHistory=JSON.parse(history)
        const newtaskArr=taskArr.map(task=>{
            if(task.id===data.id){
                task.text=data.text
            }
            return task;
        })
        const newtaskHistory=taskHistory.map(task=>{
            if(task.id===data.id){
                task.text=data.text
            }
            return task;
        })
        await fs.promises.writeFile('./Backend/tasks.json',JSON.stringify(newtaskArr,null,2))
        await fs.promises.writeFile('./Backend/copy.json',JSON.stringify(newtaskHistory,null,2))
        res.status(204).end()

    } catch(err){
        console.log(err)
        res.status(500).send("Failed");
    }
}).delete('/delete',async (req,res)=>{
    try{
        const data = req.body
        const text=await fs.promises.readFile('./Backend/tasks.json','utf8')
        const taskArr=JSON.parse(text)
        const newtaskArr=taskArr.filter(task=>task.id!==data.id)
        await fs.promises.writeFile('./Backend/tasks.json',JSON.stringify(newtaskArr,null,2))
        res.status(204).end()
    } catch(err){
        console.log(err)
        res.status(500).send('failed')
    }
}).patch('/check',async (req,res)=>{
    try{
        const data = req.body
        const text=await fs.promises.readFile('./Backend/tasks.json','utf8')
        const history=await fs.promises.readFile('./Backend/copy.json','utf8')
        const taskArr=JSON.parse(text)
        const taskHistory=JSON.parse(history)
        const newtaskArr=taskArr.map(task=>{
            if(task.id===data.id){
                task.completed=data.completed
            }
            return task;
        })
        const newtaskHistory=taskHistory.map(task=>{
            if(task.id===data.id){
                task.completed=data.completed
            }
            return task;
        })
        await fs.promises.writeFile('./Backend/tasks.json',JSON.stringify(newtaskArr,null,2))
        await fs.promises.writeFile('./Backend/copy.json',JSON.stringify(newtaskHistory,null,2))
        res.status(204).end()

    } catch(err){
        console.log(err)
        res.status(500).send("Failed");
    }
}).get('/data', async (req,res)=>{
    try{
        const data = await fs.promises.readFile('./Backend/tasks.json','utf8')
        const taskArr=JSON.parse(data);
        res.json(taskArr)
    } catch(err){
        console.log(err);
        res.status(500).send("Something went wrong")
    }
}).get('/history', async (req,res)=>{
    try{
        const history = await fs.promises.readFile('./Backend/copy.json','utf8')
        const historyArr=JSON.parse(history);
        res.json(historyArr)
    } catch(err){
        console.log(err);
        res.status(500).send("Something went wrong")
    }
})





app.listen(port,()=>{console.log("RUNNING...")})