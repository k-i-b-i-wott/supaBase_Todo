import { useState, useEffect } from 'react'

import {supabase} from './supabase.client'
import {Box, Button, TextField, Typography, Card, CardContent, CardActions} from "@mui/material"
import { FaPenAlt } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { MdOutlineDone } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
interface Task{
  id:number,
  created_at:string,
  title:string,
  description:string,
  isDone:boolean
}
const App = () => {
  return (
    <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} sx={{p:2}} alignItems={"center"}>
      <Typography variant="h4" >Supabase Todo</Typography>
      <Box  sx={{display: "flex", flexDirection:{xs:"column",md:"row"}}}>
        <CreateTodo />
        <FetchTodos />
      </Box>

    </Box>
  )
}

export default App

function CreateTodo(){
  
  const [task,setTask]=useState({
    title:"",
    description:""
  })
  const handleSubmit= async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()    
    const {error}=await supabase.from("tasks").insert(task).single()
    if(error){
      console.log(error)
    }else{
    setTask({ title:"", description:""})    
    
  }
  
  }
    return (   
  <Box component={"form"} onSubmit={handleSubmit} maxWidth={"sm"} sx={{p:2}} alignItems={"center"} justifyContent={"center"}>
    <TextField type="text"onChange={(e) => setTask((prev) =>({...prev, title: e.target.value}))} label="Enter the tittle" fullWidth required sx={{mb:2}} />
    <TextField multiline minRows={4}  onChange={(e) => setTask((prev) =>({...prev, description: e.target.value}))}   label="Task Description" fullWidth required   sx={{mb:2}} />
    <Button type="submit" variant="contained" fullWidth>Submit</Button>
  </Box>
    )
}


function FetchTodos() {
  const [tasks, setTasks] = useState<Task[]>([]);  
 
  const [updateTask, setUpdateTask]= useState<{id:number | null; title:string; description:string}>({id:null,title:"",description:""})
  const fetchTasks = async () => {
    const { error, data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })
    if (error) {
      console.log("Error reading tasks:", error);
    }
    setTasks(data || []);
  }
 

  useEffect(() => {
    fetchTasks();
   
  }, []);
  const handleDelete= async (id:number,e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    const {error}=await supabase.from("tasks").delete().eq("id",id)
    if(error){
      console.log("Error deleting task:", error);
    }else{
      fetchTasks()
    }
  
  }
  const handleEditClick = (task: Task) => {
    setUpdateTask({
      id: task.id,
      title: task.title,
      description: task.description,
    });
  };

  const handleUpdate= async (e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    const {error}= await supabase.from("tasks").update({title:updateTask.title,description:updateTask.description}).eq("id",updateTask.id)
    if(error){
      console.log("Error updating task:", error);
    }else{
      fetchTasks()
      setUpdateTask({id:null,title:"",description:""})
    }
  }
  const handleDone= async (id:number, isDone: boolean , e: React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    const {error}= await supabase.from("tasks").update({isDone:!isDone}).eq("id",id)
    if(error){
      console.log("Error updating task:", error);
    }else{
      fetchTasks()
    }
  }
  return (
    <>
        <Box>
        {
          updateTask.id && (
            <Box component={"form"}  maxWidth={"sm"} sx={{p:2}} alignItems={"center"} justifyContent={"center"}>
            <TextField type="text"onChange={(e) => setUpdateTask((prev) =>({...prev, title: e.target.value}))} label="Enter the tittle" fullWidth required sx={{mb:2}} />
            <TextField multiline minRows={4}  onChange={(e) => setUpdateTask((prev) =>({...prev, description: e.target.value}))}   label="Task Description" fullWidth required   sx={{mb:2}} />
            <Button type="submit" variant="contained" onClick={handleUpdate}  fullWidth sx={{mb:2}}>Save Changes</Button>
            <Button type='button' onClick={() => setUpdateTask({id: null, title: "", description: ""})} variant='contained' fullWidth sx={{mb:2}}>Cancel</Button>
          </Box>
          )
        }
          {
            tasks.map((task)=>{
              return (
                <Card key={task.id} sx={{mb:2, shadow:3,p:2, alignItems:"center", justifyContent:"center"} }>
                  <CardContent className='task'>
                    <Typography variant='h5' fontWeight={"bold"} sx={{textDecoration: task.isDone ? "line-through":"none"}}>{task.title}</Typography>
                    <Typography variant='body2' fontWeight={"light"}sx={{textDecoration: task.isDone ? "line-through":"none"}}>{task.description}</Typography>
                  </CardContent>
                  <CardActions  sx={{display:"flex", flexDirection:{xs:"column", md:"row"}, gap:2, justifyContent:"space-between"}} >
                    <Button type='button' variant='contained' onClick={() => handleEditClick(task)} endIcon={<FaPenAlt/>} >Update</Button>
                    <Button type='button'  onClick={(e)=>handleDelete(task.id,e)} variant='contained'  endIcon={<MdOutlineDelete/>}sx={{backgroundColor:"red"}} >Delete</Button>
                    <Button type='button' variant='contained' onClick={(e)=>handleDone(task.id,task.isDone,e)} sx={{backgroundColor:"green"}} endIcon={task.isDone ? <MdOutlineDone/> : <IoCheckmarkDoneSharp/>}>{task.isDone ? "Mark as Pending" : "Mark as Complete"}</Button>
                  </CardActions>
                </Card>
              )
            })
          }
      
   </Box>
    </>
  )
}

