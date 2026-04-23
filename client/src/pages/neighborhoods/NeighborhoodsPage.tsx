import { useState, useEffect, useRef } from "react";
import SiteFooter from "../../components/SiteFooter/SiteFooter";
import SiteHeader from "../../components/SiteHeader/SiteHeader";
import styles from "./NeighborhoodsPage.module.css"
import { useNavigate } from "react-router-dom";
import LeaveNeighborhoodPopup from "./LeaveHoodPopup";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";


let user = JSON.parse(localStorage.getItem("user") || "null");
// console.log(user);

export interface Hood {
    _id: string,
    name: string,
    zipCode: string,
    createdBy: string
}

type onCreate = (name: string, zipCode: string) => void;


export default function NeighborHoodsPage() {
    const navigate = useNavigate();


    const [error, setError] = useState<string>("");
    const [neighborhoods, setNeighborhoods] = useState<Array<Hood>>();
    const [search, setSearch] = useState<string>('');
    const [joinStatus, setJoinStatus] = useState<string>();
    const [hoodLeaving, setHoodLeaving] = useState<Hood>();
    const formRef = useRef<HTMLFormElement | null>(null);

    async function joinNeighborhood() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/joinHood`, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    zipCode: Number(search)
                })

            });

            if (!res.ok) {
                console.error("Failed to search/join a neighborhood.....");
            }

            const json = await res.json();
            const status = json.status;
            setJoinStatus(status);
            

            if (status == "joined" && search) {
                setError("You are already in this neighborhood.");
            }
            else {
                setError("");
            }



        } catch (err: any) {
            setError("Error With Joining Hoods: " + err.message);
        }
    }


    async function fetchNeighborhoods() {

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/getAllUserHoods`, {
                method: 'get',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });

            const json = await res.json();
            const hoods = json.neighborhoods;
            if (Array.isArray(hoods))
            {
                hoods.reverse();
            }

            if (!res.ok) throw new Error(json.error || "Failed to Load Neighborhoods");

            setNeighborhoods(hoods);

        } catch (err: any) {
            setError("Error With Fetching Hoods: " + err.message);
        }
    }

    async function deleteNeighborhood(hood: Hood) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/deleteUserHood`, {
                method: 'delete',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    _id: hood._id
                }),

            });

            const json = await res.json();




            if (res.ok) {
                fetchNeighborhoods();
                setError('');
            }

            setHoodLeaving(undefined);

            return res;
        }
        catch (err: any) {
            setError("Error With Deleting Hood: " + err.message);
        }
    }

    async function createNeighborhood(name: string, zipCode: string) {


        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/createHood`, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    name: name,
                    zipCode: Number(zipCode),
                }),

            });

            if (res.ok) {
                fetchNeighborhoods();
                setJoinStatus(undefined);
                setError('');
                setSearch('');
            }
            else {
                const errorData = await res.json();
                const err = errorData.errors.formErrors[0];
                if (err) {
                    setError(err);
                }

            }

            return res;
        }
        catch (err: any) {
            console.log("ERROR: ", err.message);

        }
    }

    function onEnterHood(hood: Hood) {
        if (hood) {
            navigate('/listingpage', { state: { neighborhood: hood } });
        }
    }

    useEffect(() => {
        fetchNeighborhoods();
    }, []);

    useEffect(() => {
        if (joinStatus == "joined") {
            fetchNeighborhoods();
        }

    }, [joinStatus]);

    return (
        <>
            <SiteHeader />
            {
                hoodLeaving ?
                    <LeaveNeighborhoodPopup setError={setError} onLeaveHood={deleteNeighborhood} setHoodLeaving={setHoodLeaving} hood={hoodLeaving} />
                    : null
            }
            {
                joinStatus == "new" ?
                    <CreateNeighborhoodPopup setError={setError} error={error} zip={search} setJoinStatus={setJoinStatus} onCreate={createNeighborhood} />
                    : null
            }
            <main className={styles.neighborhoodsPage}>


                <h1>My Neighborhoods</h1>
                <div style={{ height: 100 }}>
                    <p>Enter a zip code to join a neighborhood or create one if it does not exist!</p>
                    {
                        error ?
                            <p className={styles.errorMessage}>{error}</p>
                            : null
                    }
                </div>
                <SearchBar search={search} setSearch={setSearch} />
                <button onClick={joinNeighborhood} className={`${styles.joinButton} ${search.length == 5 ? '' : styles.inactive}`}>Join!</button>
                {
                    neighborhoods && neighborhoods.length > 0 ?
                        <div className={styles.neighborhoodsContainer}>
                            {
                                neighborhoods.map((hood, i) => {
                                    return <Neighborhood setHoodLeaving={setHoodLeaving} hood={hood} onEnter={onEnterHood} key={i} />
                                })}
                        </div>
                        :
                        <p>No neighborhoods Found.</p>
                }

            </main>

            <SiteFooter />
        </>
    )
}



const Neighborhood = ({ hood, onEnter = () => { }, setHoodLeaving }: { hood: Hood, onEnter: Function, setHoodLeaving: Function }) => {



    return (
        <div className={styles.neighborhood}>
            <p>{hood.name}</p>
            <p>Zip Code: {hood.zipCode}</p>
            <button className={styles.button} onClick={()=>{onEnter(hood)}}>Enter</button>
            {
                <button className={styles.leaveHoodButton} onClick={()=>{setHoodLeaving(hood)}}>Leave Neighborhood</button>
            }
        </div>
    );
}

const SearchBar = ({ search, setSearch }: { search: string, setSearch: Function }) => {


    return (
        <input name="search" onChange={(event) => { if (event.target.value.length <= 5 && Number.isInteger(+event.target.value)) { setSearch(event.target.value); } }} value={search} className={styles.searchBar} />
    );
}

const CreateNeighborhoodPopup = ({ setError, error = "", zip, setJoinStatus = () => { }, onCreate = () => { } }: { setError: Function, error: string, zip: string, setJoinStatus: Function, onCreate: onCreate }) => {
    const [name, setName] = useState<string>();

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'absolute', display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 'var(--site-header-height)', zIndex: 1 }}>
            <div className={styles.createHoodPopup}>
                <button style={{ margin: '10px 10px 0px auto' }} onClick={() => { setJoinStatus(undefined); setError(""); }}>Exit</button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, margin: '0 0 30px', width: '100%', alignItems: 'center' }}>
                    <p>There is no neighborhood for this zip code. Be the first to name it!</p>
                    <p className={styles.errorMessage}>{error}</p>
                    <label>Enter Name:</label>
                    <input onChange={(e) => { setName(e.target.value) }} value={name} type="text" />
                    <label>Zip Code: {zip}</label>
                    <button onClick={() => { if (name && zip) { onCreate(name, zip) } }}>Create Neighborhood</button>
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


