import { useState } from "react"
import Axios from 'axios'
export default function App() {
  const [sub , setSubj] = useState([])

  const [form , setForm] = useState({
    name :'',
    email : '',
    phone :'',
    message:'',
    tag:''
    })

  const handleSub = (e) =>{
    setSubj(prev => e.target.value)
  }
  const handleChange = (e) =>{
    const name = e.target.name
    const value = e.target.value
      setForm(prev =>( {...prev , [name] : value}))
  }

  const handleSumbit = async(e) =>{
      e.preventDefault()
      const response = await Axios.post('http://localhost:8080/contact',{
              name:form.name,
              email:form.email, 
              phone:form.phone,
              message: form.message,
              tag:form.tag
      })

      if(response.status === 200){
        alert("Thank YOU")
        setForm({
          name:"",
          email:"",
          phone:"",
          message:"",
          tag:""
        })
      }
      else{
        alert("Something went wrong")
      }
  }
  return (
   <form action="" onSubmit={handleSumbit} className="flex flex-1 flex-col w-[40%] border border-blue p-4 m-4">
    <div className="flex flex-col gap-2">
      <label htmlFor="">Name</label>
      <input type="text" value={form.name} name="name" onChange={(e) => handleChange(e)} className= "p-2  rounded-lg border-blue border outline-none "/>
    </div>
    <div className="flex flex-col gap-2">
      <label htmlFor="">Email</label>
      <input type="text" value={form.email} name="email" onChange={(e) => handleChange(e)} className= "p-2  rounded-lg border-blue border outline-none"/>
    </div>
    <div className="flex flex-col gap-2">
      <label htmlFor="">Phone</label>
      <input type="number" value={form.phone} name="phone" onChange={(e)=> handleChange(e)} className= "p-2  rounded-lg border-blue border outline-none"/>
    </div>
    <div className="flex flex-col gap-2">
      <label htmlFor="">Message</label>
      <textarea type="text" value={form.message} name="message" rows= {6} onChange={(e)=>handleChange(e)} className= "p-2  rounded-lg border-blue border outline-none"/>
    </div>
    <div className="flex flex-col gap-2">
      <label htmlFor="">Tags</label>
      <input type="text"  name="tag" value={form.tag} onChange={(e) => handleChange(e)} className= "p-2  rounded-lg border-blue border outline-none"/>
    </div>
    <button type="submit" className="px-4 py-2 border mt-4">Submit</button>
   </form> 
  )
}
