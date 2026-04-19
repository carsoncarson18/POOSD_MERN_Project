import { useState, useEffect, type MouseEventHandler } from "react";
import SiteFooter from "../../components/SiteFooter/SiteFooter";
import SiteHeader from "../../components/SiteHeader/SiteHeader";
import styles from "./NeighborhoodsPage.module.css"
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const user = {
    _id:'69e44805f1875a28613fae5c'
}


const token = localStorage.getItem("token");

interface Hood {
    _id:string
    name:string,
    zipCode:Int8Array,
}



export default function NeighborHoodsPage()
{
    const navigate = useNavigate();

    const [error, setError] = useState<String>("");
    const [neighborhoods,setNeighborhoods] = useState<Array<Hood>>();
    const [search, setSearch] = useState<string>('');
    

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

        // const res = await fetch(
        //     `${API_URL}/api/getAllHoodIngredients?_id=${neighborhood!._id}`,
        //     { headers: { Authorization: `Bearer ${token}` } },
        // );

   
        } catch (err: any) {
            console.log("Error With Fetching Hoods: ", err.message);
        } 
        // finally {
        // setLoading(false);
        // }
    }



    async function createNeighborhood() {
        try {
            const res2 = await fetch(`${API_URL}/api/createHood?_id=${user._id}`, {
                method:'post',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name:'nams_hood2',
                    zipCode: 11911,
                }),
                
                // body: JSON.stringify({ _id: id })
            });
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
        fetchNeighborhoods();
    }, []);

    return (
        <>
            <SiteHeader/>
                <main className={styles.neighborhoodsPage}>
                    <h1>My Neighborhoods</h1>
                    <p>Enter a zip code to join a neighborhood or create one if it is empty!</p>
                    <SearchBar setNeighborhoods={setNeighborhoods} search={search} setSearch={setSearch}/>
                    <div className={styles.neighborhoodsContainer}>
                        {
                            neighborhoods && neighborhoods.length>0?
                            neighborhoods.map((hood,i)=>{
                                // console.log(neighborhoods);
                                
                                return <Neighborhood hood={hood} onEnter={onEnterHood}  key={i}/>
                            })
                            : 
                            <p>No neighborhoods Found. You can be the first to create one!</p>
                        }
                    </div>
                </main>
            <SiteFooter/>
        </>
    )
}



const Neighborhood = ({hood, onEnter=()=>{}}:{hood:Hood,onEnter:Function}) => {

  

    return (
        <div className={styles.neighborhood}>
            <p>{hood.name}</p>
            <p>Zip Code: {hood.zipCode}</p>
            <button onClick={()=>{onEnter(hood)}}>Enter</button>
        </div>
    );
}

const SearchBar = ({search,setSearch, setNeighborhoods}:{search:string,setSearch:Function,setNeighborhoods:Function})=>{

    


    return (
        <input  onChange={(event)=>{setSearch(event.target.value);}} value={search} className={styles.searchBar}/>
    );
}


/*
 Questions: Do we search for neighborhoods by zipcode/name since we are not automatically assigned to a neighborhood.

*/