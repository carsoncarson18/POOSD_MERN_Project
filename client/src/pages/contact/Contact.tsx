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
                <main>
                    <section>
                        <form action={"mailto:idk"} method="post" encType="text/plain">
                            <label>Contact Us</label>
                            <p>
                                Email us about any questions or concerns you may have regarding our app or developers.
                            </p>
                            {
                                hasError?
                                <p style={{color:'#ff3f3f',textShadow:'0 0px 1px black'}}>
                                    Please enter in a valid value to send us an email.
                                </p>
                                : null
                            }
                            <textarea required onChange={(event)=>{setText(event.target.value)}} value={text}/>
                            <button onClick={()=>{if (text) {sendEmail(text); setHasError(false)} else {setHasError(true)}; setText("")}} type="button" >Submit</button>
                        </form>
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