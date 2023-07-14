import { useState } from "react"

export default function App() {
  // const [sub , setSubj] = useState([])

  const [form , setForm] = useState({
    name :'',
    email : '',
    phone :'',
    password:'',
    cpassword:''
    })

  // const handleSub = (e) =>{
  //   setSubj(prev => e.target.value)
  // }
  const handleChange = (e) =>{
    const name = e.target.name
    const value = e.target.value
      setForm(prev =>( {...prev , [name] : value}))
  }

  const contactForm = async (e) =>{

    e.preventDefault();

    const {name,email,phone,password,cpassword}=form;
    
    const res = await fetch("/Sregister",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,email,phone,password,cpassword
      })
    })
   
    const data= await res.json();
    window.alert("hello");

    if(data.status===422 || !data)
    {
      window.alert("Invalid reg")
      console.log("Invalid reg")
    }
    else
    {
      window.alert("Reg success")
      console.log("Reg success")
      
    }
  }




  return (
   <form method="POST"  className="flex flex-1 flex-col w-[40%] border border-blue p-4 m-4">
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
      <label htmlFor="">password</label>
      <input type="text" value={form.password} name="password"  onChange={(e)=>handleChange(e)} className= "p-2  rounded-lg border-blue border outline-none"/>
    </div>
    <div className="flex flex-col gap-2">
      <label htmlFor="">cpassword</label>
      <input type="text"  name="cpassword" value={form.cpassword} onChange={(e) => handleChange(e)} className= "p-2  rounded-lg border-blue border outline-none"/>
    </div>
    <button type="submit" onClick={contactForm} className="px-4 py-2 border mt-4">Submit</button>
   </form> 
  )
}
