import { useState, useEffect } from 'react'

import {supabase} from './supabase.client'
import {Box, Button, TextField, Typography, Card, CardContent, CardActions} from "@mui/material"
import { FaPenAlt } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { MdOutlineDone } from "react-icons/md";
interface Task{
  id:number,
  created_at:string,
  title:string,
  description:string
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
    }

    setTask({
      title:"",
      description:""
    })
  
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
    }
  }

  const handleUpdate= async (id:number,e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    const {error}= await supabase.from("tasks").update({title:"Updated title",description:"Updated description"}).eq("id",id)
    if(error){
      console.log("Error updating task:", error);
    }
  }
  return (
    <>
        <Box>
          {
            tasks.map((task)=>{
              return (
                <Card key={task.id} sx={{mb:2, shadow:3,p:2, alignItems:"center", justifyContent:"center"} }>
                  <CardContent className='task'>
                    <Typography variant='h5' fontWeight={"bold"}>{task.title}</Typography>
                    <Typography variant='body2' fontWeight={"light"}>{task.description}</Typography>
                  </CardContent>
                  <CardActions  sx={{display:"flex", justifyContent:"space-between"}} >
                    <Button type='button' variant='contained' onClick={(e)=>handleUpdate(task.id,e)} endIcon={<FaPenAlt/>} >Update</Button>
                    <Button type='button'  onClick={(e)=>handleDelete(task.id,e)} variant='contained'  endIcon={<MdOutlineDelete/>}sx={{backgroundColor:"red"}} >Delete</Button>
                    <Button type='button' variant='contained' sx={{backgroundColor:"green"}} endIcon={<MdOutlineDone />}>Mark complete</Button>
                  </CardActions>
                </Card>
              )
            })
          }
      
   </Box>
    </>
  )
}