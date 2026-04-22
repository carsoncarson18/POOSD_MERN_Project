import { useState } from "react";
import SiteFooter from "../../components/SiteFooter/SiteFooter";
import SiteHeader from "../../components/SiteHeader/SiteHeader";





export default function Contact() {
    const [text, setText] = useState<string>();
    const [hasError, setHasError] = useState(false);

    /*
        Note to self, ensure input validation for message sent to email. Though this may not be 
        necessary if all the button will do is forward the text to the user's emailing software
    */

    

    return (
        <div id="contact">
            <SiteHeader/>
                <main style={{minHeight:'100vh'}}>
                    <section>
                        <div className="emailForm" style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                            <label>Contact Us</label>
                            <div style={{height:150,width:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
                                <p>
                                    Email us about any questions or concerns you may have regarding our app or developers.
                                </p>
                                {
                                    hasError?
                                    <p style={{color:'#6c2c2cff',textShadow:'0 0px 1px black'}}>
                                        Please enter in a valid text value to send us an email.
                                    </p>
                                    : null
                                }
                            </div>
                            
                            <textarea style={{borderRadius:5}} required onChange={(event)=>{setText(event.target.value)}} value={text}/>
                                <a className="button" onClick={()=>{if (text) {setHasError(false)} else {setHasError(true)};}} href={text? `mailto:autoscrapsmail@gmail.com?body=${text}` : '#'}> Email</a>
                            {/* <button onClick={()=>{if (text) {sendEmail(text); setHasError(false)} else {setHasError(true)}; setText("")}} type="button" >Submit</button> */}
                        </div>
                    </section>
                </main>
            <SiteFooter/>
        </div>
    )
}

const sendEmail = (text:string)=>
{
    window.location.href = "mailto:scrapscontact@gmail.com Message&body="+text;
}