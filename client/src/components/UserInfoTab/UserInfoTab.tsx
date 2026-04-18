import { useState } from "react";
import styles from "./UserInfoTab.module.css"
import axios from "axios";

const API_URL = "http://localhost:5001";

// type formData = {
//     firstName:String,
//     username:String,
//     email:String,
//     password:String
// };
const sign_data = {
    firstName:"namnamnam",
    lastName:"aug",
    username:"namnamnam",
    password:"namnamnam!",
    email:'d2apeye@gmail.com'
}

const data= {
    username:"nam",
    password:"namnamnam!"
}

const JWT = import.meta.env.VITE_JWT_SECRET
// console.log(JWT);



try 
{ 
    //const response = await axios.post(`${API_URL}/api/signup`,sign_data);    
    const response = await axios.post(`${API_URL}/api/login`,data);   
    console.log(response.data.user);

    // const token = localStorage.getItem("token");
    // const user = JSON.parse(localStorage.getItem("user") || "null");
    // console.log("user object", user);
     
}
catch(err:any) {
    console.log(err.response);
    // console.log(err);
    
}


export default function UserInfoTab()
{

    
    

    const [email,setEmail] = useState('beatbeetstreet@gmail.com');
    const [zips,setZips] = useState([111111,22222,33333]);


    return (
        <div className={styles.tab}>
            <div>
                <h2>Name</h2>
            </div>
            <form onSubmit={()=>{return false}}>
                <label>Email</label>
                <p>{email}</p>
                <input type="text"></input>
                <label>Zip Codes</label>
                {
                    zips.map((val,i)=>{
                        return (
                            <div key={i} style={{
                                width:'100%',
                                padding:'0 15px 0',
                                display:'flex',
                                flexDirection:'column',
                                alignItems:'center'
                            }}>
                                <label>{val}</label>
                                <button type="button" style={{width:'30%',borderRadius:20}}>Edit</button>
                            </div>
                        )
                    })
                }
                <div style={{margin:'15px 0 0 0',display:'flex',flexDirection:'row',gap:15}}>
                    <button type="button">Cancel</button>
                    <button type="button">Save</button>
                </div>
            </form>

        </div>
    );
}

