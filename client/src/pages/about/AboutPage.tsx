import { Link } from "react-router-dom";
import SiteFooter from "../../components/SiteFooter/SiteFooter";
import SiteHeader from "../../components/SiteHeader/SiteHeader";
import { useState} from "react";
import er_diagram from "../../assets/about-page/erdiagram.png"
import figma_design from "../../assets/about-page/figma-design.png"
import male_icon from "../../assets/about-page/male-silhouette-icon.png" 
import female_icon from "../../assets/about-page/female-silhouette-icon.png"  
import styles from "./AboutPage.module.css"



interface MemberData {
    name:string;
    image?:string;
    description:string;
    short_description?:string;
    role:string;
    github?:string;
    linkedin?:string;
    sex: 'male' | 'female';
}


const default_person : MemberData = {
    name:'John Doelificus',
    sex:'male',
    description:'descrition',
    role:'Project Lead'
}

/*
    <Card setPerson={setPerson} name={'Carson Davie'} role={'Project Manager, Database Architect'}/>
    <Card setPerson={setPerson} name={'Mehreen Khan'} role={'API Developer'}/>
    <Card setPerson={setPerson} name={'George Avdella'} role={'API Developer'}/>
    <Card setPerson={setPerson} name={'Drake Austin'} role={'Flutter Developer'}/>
    <Card setPerson={setPerson} name={'Zainab Syed'} role={'Frontend Developer'}/>
    <Card setPerson={setPerson} name={"Noam Chemla"} role={'Frontend Developer'}/>
    <Card setPerson={setPerson} name={"Nahum Auguste"} role={'Frontend Developer'}/>
*/

const carson : MemberData = {
    name:'carson davie',
    description:'descriptionawdddddddddd ddddddddddd dddddd\nawdddddddd ddddddddd ddd\n\nadwwwwwww\n\n\nadwadwawccccccccc ccccccccc ccccccccccc ccccccccccc cccccccccccc cccccccccccc cccccccccvvv vvvvvv vvvsd',
    role:'Project Manager and Database Architect',
    sex:'male',
}

const mehreen : MemberData = {
    name:'Mehreen Khan',
    description:'Worked on ingredient and authentication endpoints and corresponding data validation. ',
    role:'API Developer',
    sex:'female',
}

const george : MemberData = {
    name:'George Avdella',
    description:'description',
    role:'API developer',
    sex:'male',
}

const drake : MemberData = {
    name:'Drake Austin',
    description:'description',
    role:'Flutter Developer',
    sex:'male',
}

const zainab : MemberData = {
    name:'Zainab Syed',
    description:'description',
    role:'Frontend Developer',
    sex:'female',
}

const noam : MemberData = {
    name:'Noam Chemla',
    description:'Worked on user experience for signing up, logging in, email authentication, and forgot password',
    role:'Frontend Developer',
    sex:'male',
}

const nahum : MemberData = {
    name:'Nahum Auguste',
    description:'description',
    role:'Frontend Developer',
    sex:'male',
}



export default function AboutPage()
{
    const [person,setPerson] = useState<MemberData | null>();

    return (
        <div id="about-page" className={styles.aboutPage}>
            <SiteHeader/>
                <main>
                    {
                    !person?
                    <>
                        <section>
                            <h1>About Us</h1>
                            <p>
                                We are Team 1 of the 2026 Processes of Object Oriented Software Design (POOSD) MERN project.
                                Out team comprised of 7 people, 3 of which were assigned with developing our frontend, 2 were
                                on the backend, 1 built our mobile app, and 1 was our project manager and database architect.
                            </p>
                        </section>
                        <section style={{width:'100%'}}>
                            <h1>Meet Our Team</h1>
                            <div style={{
                                display:'flex',
                                flexDirection:'row',
                                flexWrap:'wrap',
                                justifyContent:'space-evenly',
                                rowGap:70,
                                width:'60%'
                            }}>
                                <Card person={carson} setPerson={setPerson} />
                                <Card person={mehreen} setPerson={setPerson} />
                                <Card person={george} setPerson={setPerson} />
                                <Card person={drake} setPerson={setPerson} />
                                <Card person={zainab} setPerson={setPerson} />
                                <Card person={noam} setPerson={setPerson} />
                                <Card person={nahum} setPerson={setPerson} />
                            </div>
                        </section>
                        <section id="tech-stack">
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
                                <img style={{objectFit:'contain',width:'80%',height:'100%'}} src={er_diagram}/>
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
                            <section>
                                <h2>Figma</h2>
                                <p>
                                    We designed and prototyped our app using Figma.
                                </p>
                                
                                <img style={{objectFit:'contain',width:'80%',height:'100%'}} src={figma_design}/>
                            </section>
                        </section>
                    </>
                    :
                    <LearnMoreSection person={person} setPerson={setPerson}/>
                    }
                </main>
            <SiteFooter/>
        </div>
    );
}

function Card({person=default_person,setPerson=()=>{}}:{person?:MemberData,setPerson:Function})
{

    return (
        <div className="card" style={{border:'1px solid black',
            borderRadius:10,
            minWidth:200,
            width:'30%',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            backgroundColor:'white',
            color:'black',
            padding:'15px 20px',
            gap:15
        }}>
            <h2 style={{textAlign:'center',textTransform:'capitalize',whiteSpace:'nowrap'}}>{person.name}</h2>
            <div style={{height:300,width:'100%',border:'1px solid black', backgroundColor:'grey'}}>
                <img style={{objectFit:'contain', width:'100%', height:'100%'}} src={person.image ?? (person.sex=="male"? male_icon : female_icon)}/>
            </div>
            <h4 style={{textTransform:'capitalize',height:78,display:'flex',flexDirection:'column',textAlign:'center',justifyContent:'center'}}>
                {person.role}
            </h4>
            <p style={{height:100, width:'100%', textAlign:'center',textOverflow:'ellipsis',overflow:'hidden'}}>{person.short_description ?? person.description}</p>
            <Link to="" onClick={()=>{setPerson(person)}}>Learn More</Link>
        </div>
    );
}

function LearnMoreSection({person=default_person,setPerson=()=>{}}:{person?:MemberData, setPerson:Function})
{

    return (
        <div id="person-learn-more">
            <button style={{
                padding:'15px 24px',
                borderRadius:25,
                border:'1px solid black',
                marginBottom:0
            }} onClick={()=>{setPerson(null)}}>View the whole team</button>
            <h2 style={{textTransform:'capitalize'}}>{person.name}</h2>
            <div className={styles.imageContainer} style={{height:500,width:'100%',border:'1px solid black', backgroundColor:'grey'}}>
                <img style={{objectFit:'contain', width:'100%', height:'100%'}} src={person.image ?? (person.sex=="male"? male_icon : female_icon)}/>
            </div>
            <h4 style={{textTransform:'capitalize'}}>{person.role}</h4>
            <p style={{textAlign:'center'}}>
                {person.description}
            </p>
        </div>
    );
}

