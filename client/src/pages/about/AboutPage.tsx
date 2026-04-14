import { Link } from "react-router-dom";
import SiteFooter from "../../components/SiteFooter/SiteFooter";
import SiteHeader from "../../components/SiteHeader/SiteHeader";
import { useState, type MouseEventHandler } from "react";


export default function AboutPage()
{
    const [person,setPerson] = useState('');

    return (
        <div id="about-page">
            <SiteHeader/>
                <main>
                    <section>
                        <h1>About Us</h1>
                        <p>
                            We are Team 1 of the 2026 Processes of Object Oriented Software Design (POOSD) MERN project.
                            Out team comprised of 7 people, 3 of which were assigned with developing our frontend, 2 were
                            on the backend, 1 build our mobile app, and 1 was our project manager and database architect.
                        </p>
                    </section>
                    <section style={{width:'60%'}}>
                        <h1>Meet Our Team</h1>

                        {
                            !person ?
                            <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-evenly',rowGap:30}}>
                            <Card setPerson={setPerson} name={'Carson Davie'} role={'Project Manager, Database Architect'}/>
                            <Card setPerson={setPerson} name={'Mehreen Khan'} role={'API Developer'}/>
                            <Card setPerson={setPerson} name={'George Avdella'} role={'API Developer'}/>
                            <Card setPerson={setPerson} name={'Drake Austin'} role={'Flutter Developer'}/>
                            <Card setPerson={setPerson} name={'Zainab Syed'} role={'Frontend Developer'}/>
                            <Card setPerson={setPerson} name={"Noam Chemla"} role={'Frontend Developer'}/>
                            <Card setPerson={setPerson} name={"Nahum Auguste"} role={'Frontend Developer'}/>
                            </div>
                            :
                            <LearnMoreSection setPerson={setPerson} name={person}/>
                        }
                    </section>
                    <section>
                        <h1>Our Tech Stack</h1>
                        <p>
                            For our tech stack, we used the MERN framework to build our website and Flutter
                            to build our mobile app. GitHub was used for version control and setting up our 
                            CI/CD pipeline using GitHub actions. We used discord to communicate with each other,
                            and Figma to design and prototype our apps.
                        </p>
                        <section>
                            <h2>MongoDB</h2>
                            <p>
                                We used MongoDB as our non-relational database.
                            </p>
                            <p>INSERT DIAGRAMS</p>
                        </section>
                        <section>
                            <h2>Express.js</h2>
                            <p>Express.js was used manage api calls and request routing between the frontend
                                and our MongoDB database.
                            </p>
                            <p>INSERT DIAGRAMS</p>
                        </section>
                        <section>
                            <h2>React.js</h2>
                            <p>
                                React.js was used to develop our frontend.
                            </p>
                        </section>
                        <section>
                            <h2>Node.js</h2>
                            <p>We use Node.js as our runtime environment to run our JavaScript code on our web
                                server and our local devices for development.
                            </p>
                        </section>
                    </section>
                </main>
            <SiteFooter/>
        </div>
    );
}

function LearnMoreSection({name="Name",role="Role",description="blah blah...",setPerson=()=>{}}:{name:String,role:String,description:String,setPerson:Function})
{

    return (
        <section>
            <button style={{
                padding:'15px 24px',
                borderRadius:25,
                border:'1px solid black'
            }} onClick={()=>{setPerson('')}}>View the whole team</button>
            <h2>{name}</h2>
            <div style={{height:200,width:'100%',border:'1px solid black', backgroundColor:'grey'}}></div>
            <h2>{role}</h2>
            <p>
                {description}
            </p>
        </section>
    );
}

function Card({name="Name",role="Role",short_description="blah blah...",setPerson=()=>{}}:{name:String,role:String,short_description:String,setPerson:Function})
{

    return (
        <div style={{border:'1px solid black',
            borderRadius:10,
            minWidth:200,
            width:'25%',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            backgroundColor:'white',
            color:'black',
            padding:'15px 15px'
        }}>
            <h2 style={{textAlign:'center'}}>{name}</h2>
            <div style={{height:200,width:'100%',border:'1px solid black', backgroundColor:'grey'}}></div>
            <h3 style={{margin:0,height:78,display:'flex',flexDirection:'column',justifyContent:'center'}}>{role}</h3>
            <p style={{height:100}}>{short_description}</p>
            <Link to="" onClick={()=>{setPerson(name)}}>Learn More</Link>
        </div>
    );
}