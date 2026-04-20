import type {Hood} from "./NeighborhoodsPage"
import styles from "./NeighborhoodsPage.module.css"


export default function LeaveNeighborhoodPopup({hood,setHoodLeaving,onLeaveHood}:{hood:Hood,setHoodLeaving:Function,onLeaveHood:Function}){


    return (
            <div className={styles.leaveHoodPopupContainer}>
                <div className={styles.leaveHoodPopup}>
                    <div style={{display:'flex',flexDirection:'column',gap:20,margin:'0 0 30px',width:'100%',alignItems:'center'}}>
                        {hood?<><button style={{margin:'10px 10px 0px auto'}} onClick={()=>{setHoodLeaving(undefined);}}>Exit</button>
                        <p className={styles.errorMessage}>Are you sure you want to leave this neighborhood?</p>
                        <p>{hood.name}</p>
                        <p>Zip Code: {hood.zipCode}</p>
                        <button className={styles.leaveButton} onClick={()=>{{onLeaveHood(hood)}}}>Leave Neighborhood</button></>:null}
                    </div>
                </div>
            </div>
    );
}