import { useState, useEffect } from 'react'
import './App.css'
import {supabase} from './supabase.client'


interface Task{
  id:number,
  created_at:string,
  title:string,
  description:string
}
const App = () => {


  return (
    <div>
      <h1>Supabase Todo</h1>
      <div className='todo-form'>
        <CreateTodo />
        <FetchTodos />
      </div>

    </div>
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
    if(task.title.trim()==="" || task.description.trim()===""){
      alert("Please enter a title and description")
      return
    }
    const {error}=await supabase.from("tasks").insert(task).single()
    if(error){
      console.log(error)
    }

    setTask({
      title:"",
      description:""
    });
  
  }
    return (   
  <form onSubmit={handleSubmit}>
    <input type="text"onChange={(e) => setTask((prev) =>({...prev, title: e.target.value}))} placeholder="Enter the tittle" />
    <textarea  onChange={(e) => setTask((prev) =>({...prev, description: e.target.value}))}   placeholder="Task Description" />
    <button type="submit" >Submit</button>
  </form>
    )
}


function FetchTodos() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTasks, setEditTasks] = useState<Task[]>([]);
  
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
        <ul>
          {
            tasks.map((task)=>{
              return (
                <li key={task.id}>
                  <div className='task'>
                    <h2>{task.title}</h2>
                    <p>{task.description}</p>
                  </div>
                  <div className='actions'>
                    <button type='button' onClick={(e)=>handleUpdate(task.id,e)} className='edit'>Update</button>
                    <button type='button' onClick={(e)=>handleDelete(task.id,e)} className='delete'>Delete</button>
                  </div>
                </li>
              )
            })
          }
      
   </ul>
    </>
  )
}