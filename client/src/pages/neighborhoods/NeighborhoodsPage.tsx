import { useState, useEffect, useRef } from "react";
import SiteFooter from "../../components/SiteFooter/SiteFooter";
import SiteHeader from "../../components/SiteHeader/SiteHeader";
import styles from "./NeighborhoodsPage.module.css"
import {useNavigate } from "react-router-dom";
import LeaveNeighborhoodPopup from "./LeaveHoodPopup";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";


let user = JSON.parse(localStorage.getItem("user") || "null");
// console.log(user);


const token = localStorage.getItem("token");

export interface Hood {
    _id:string,
    name:string,
    zipCode:string,
    createdBy:string
}



type onCreate = (name:string,zipCode:string) => void;


export default function NeighborHoodsPage()
{
    const navigate = useNavigate();
    

    const [error, setError] = useState<String>("");
    const [neighborhoods,setNeighborhoods] = useState<Array<Hood>>();
    const [search, setSearch] = useState<string>('');
    const [joinStatus, setJoinStatus] = useState<string>();
    const [hoodLeaving,setHoodLeaving] = useState<Hood>();
    const formRef = useRef<HTMLFormElement | null>(null);

    async function joinNeighborhood()
    {
       try {
            const res = await fetch(`${API_URL}/api/joinHood?_id=${user._id}`, {
                method:'post',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    zipCode: Number(search)
                }) 
                
            });

            if (!res.ok)
            {
                console.error("Failed to search/join a neighborhood.");
            }

            const json = await res.json();
            const status = json.status;

            setJoinStatus(status);
            fetchNeighborhoods();
            
            

   
        } catch (err: any) {
            setError("Error With Fetching Hoods: " + err.message);
        }  
    }
    

    async function fetchNeighborhoods() {

        try {
            const res = await fetch(`${API_URL}/api/getAllUserHoods?_id=${user._id}`, {
                method:'get',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });

            const json = await res.json();
            const hoods = json.neighborhoods;

            if (!res.ok) throw new Error(json.error || "Failed to Load Neighborhoods");

            setNeighborhoods(hoods);
            setError('');

        // const res = await fetch(
        //     `${API_URL}/api/getAllHoodIngredients?_id=${neighborhood!._id}`,
        //     { headers: { Authorization: `Bearer ${token}` } },
        // );

   
        } catch (err: any) {
            setError("Error With Fetching Hoods: " + err.message);
        } 
        // finally {
        // setLoading(false);
        // }
    }

    async function deleteNeighborhood(hood:Hood)
    {
        try {        
            
            const res = await fetch(`${API_URL}/api/deleteUserHood?_id=${user._id}`, {
                method:'delete',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
  
                body: JSON.stringify({
                    _id:hood._id
                }),
                
            });

            const json = await res.json();

           
            

            if (res.ok) {
                fetchNeighborhoods();
                // setJoinStatus(undefined);
                console.log(json.message);
                setError('');
            
            }

            setHoodLeaving(undefined);

            return res;
        }
        catch (err:any)
        {
            setError("Error With Deleting Hood: " + err.message);
        }
    }

    async function createNeighborhood(name:string,zipCode:string) {
        
        
        try {        
            const res = await fetch(`${API_URL}/api/createHood?_id=${user._id}`, {
                method:'post',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
  
                body: JSON.stringify({
                    name:name,
                    zipCode: Number(zipCode),
                }),
                
            });

            if (res.ok) {
                fetchNeighborhoods();
                setJoinStatus(undefined);
                setError('');
            }

            return res;
        }
        catch (err:any)
        {
            console.log("ERROR: ",err.message);
            
        }
    }

    function onEnterHood(hood:Hood)
    {
        if (hood)
        {
            navigate('/listingpage',{state:{neighborhood:hood}});
        }
    }


    
    useEffect(() => {
        // createNeighborhood()
        const form = formRef.current;
        

        if (form) {
            form.addEventListener('submit',(e)=>{
                // console.log("f: ",search);
                e.preventDefault();
                const data = new FormData(e.target as HTMLFormElement);
                const val = data.get('search')?.toString();
 
                if (val?.toString().length==5 && Number(val)) {
                    // console.log(val);
                    
                    setSearch(val);
                    // console.log(search);
                    
                    
                    
                    joinNeighborhood();
                    fetchNeighborhoods();
                    console.log('submitted form!');
                }
            });
        }

        fetchNeighborhoods();
    }, [search]);

    return (
        <>
            <SiteHeader/>
                {
                    hoodLeaving?
                    <LeaveNeighborhoodPopup onLeaveHood={deleteNeighborhood} setHoodLeaving={setHoodLeaving} hood={hoodLeaving}/>
                    :null
                }
                {
                    joinStatus=="new" ?
                    <CreateNeighborhoodPopup zip={search} setJoinStatus={setJoinStatus} onCreate={createNeighborhood}/>
                    : null
                }
                <main className={styles.neighborhoodsPage}>
                    
                    
                    <h1>My Neighborhoods</h1>
                    <div style={{height:70}}>
                        <p>Enter a zip code to join a neighborhood or create one if it does not exist!</p>
                        {
                            !error?
                            <p className={styles.errorMessage}>{error}</p>
                            :null
                        }
                    </div>
                    
                    <form ref={formRef} id="join-hood-form">
                        <SearchBar search={search} setSearch={setSearch}/>
                        <button className={`${styles.joinButton} ${search.length == 5 ? '': styles.inactive}`}>Join!</button>
                    </form>
                    {
                        neighborhoods && neighborhoods.length>0?
                        <div className={styles.neighborhoodsContainer}>
                                {
                                    neighborhoods.map((hood,i)=>{
                                    return <Neighborhood setHoodLeaving={setHoodLeaving} hood={hood} onEnter={onEnterHood}  key={i}/>
                                })}
                        </div>
                        :
                        <p>No neighborhoods Found.</p>
                    }
                    
                </main>
                
            <SiteFooter/>
        </>
    )
}



const Neighborhood = ({hood, onEnter=()=>{}, setHoodLeaving}:{hood:Hood,onEnter:Function,setHoodLeaving:Function}) => {

  

    return (
        <div className={styles.neighborhood}>
            <p>{hood.name}</p>
            <p>Zip Code: {hood.zipCode}</p>
            <button onClick={()=>{onEnter(hood)}}>Enter</button>
            {
                <button onClick={()=>{setHoodLeaving(hood)}}>Leave Neighborhood</button>
            }
        </div>
    );
}

const SearchBar = ({search,setSearch}:{search:string,setSearch:Function})=>{


    return (
        <input name="search" onChange={(event)=>{if (event.target.value.length <=5 && Number.isInteger(+event.target.value)) {setSearch(event.target.value);}}} value={search} className={styles.searchBar}/>
    );
}

const CreateNeighborhoodPopup = ({zip, setJoinStatus=()=>{}, onCreate=()=>{}}:{zip:string,setJoinStatus:Function,onCreate:onCreate}) =>
{
    const [name, setName] = useState<string>();

    return (
        <div style={{width:'100vw',height:'100vh',position:'absolute',display:'flex',flexDirection:'row',justifyContent:'center',marginTop:'var(--site-header-height)',zIndex:1}}>
            <div className={styles.createHoodPopup}>
                <button style={{margin:'10px 10px 0px auto'}} onClick={()=>{setJoinStatus(undefined);}}>Exit</button>
                <div style={{display:'flex',flexDirection:'column',gap:20,margin:'0 0 30px',width:'100%',alignItems:'center'}}>
                    <p>There is no neighborhood for this zip code. Be the first to name it!</p>
                    <label>Enter Name:</label>
                    <input onChange={(e)=>{setName(e.target.value)}} value={name} type="text"/>
                    <label>Zip Code: {zip}</label>
                    <button onClick={()=>{if (name && zip) {onCreate(name,zip)}}}>Create Neighborhood</button>
                </div>
                
            </div>
        </div>
    );
}


/*
TODO: Make it so you can press enter for the create neighborhood form.
More input validation and error checks.
Make responsive for mobile.
Display errors for incorrect n=hood names


*/


