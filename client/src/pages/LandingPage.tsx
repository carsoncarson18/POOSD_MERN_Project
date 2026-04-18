import SiteFooter from "../components/SiteFooter/SiteFooter";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import hero_image from "../assets/landing-page/food-waste-bg.png"
import UserInfoTab from "../components/UserInfoTab/UserInfoTab";


export default function LandingPage()
{

    return (
       <>
            
            <div id="landing-page">
                {/* <UserInfoTab/> */}
                {/* <div> */}
                <SiteHeader/> 
                {/* </div> */}
                <main style={{padding:'0 0 80px 0'}}>
                    <div style={{padding:'0 0 70px 0',boxShadow:'0 8px 22px -15px black ',width:'100%',height:'fit-content', position:'relative', zIndex:0, overflow:'hidden'}}>
                        <img style={{width:'100%',height:'100%',opacity:.6,objectFit:'cover',position:'absolute',bottom:0}} alt="Bag of Food Scraps" src={hero_image}/>
                        <div style={{
                                zIndex:1, 
                                width:'60%',
                                textAlign:'center',
                                display:'flex',
                                flexDirection:'column',
                                alignItems:'center',
                                gap:15, 
                                paddingTop:50,
                                textShadow:'0 2px 5px black',
                                backdropFilter:'blur(2px)',
                                margin:'0 auto'
                            }}>
                            <h1 style={{margin:0,color:'white'}}>What is Scraps?</h1>
                            <p style={{width:'80%',margin:0,fontWeight:600, color: 'white'}}>
                                Scraps is our solution to the problem of having 
                                extra ingredients or food items that you do not 
                                want to go to waste. <br/><br/> With Scraps, you can notify 
                                your neighbors of any items you don’t want with a 
                                corresponding expiration date and drop off location. 
                                Scraps is also useful if you are in need of food items 
                                rather than just for giving out food items.
                            </p>
                        </div>
                    </div>
                    <section>
                        <h1>How does Scraps Work?</h1>
                        <div style={{display:'flex',flexDirection:'column',gap:60}}>
                            <section>
                                <h2>Create an Account</h2>
                                <p>
                                    When you create an account, you will be prompted to 
                                    enter your profile information like your name, phone 
                                    number, and zip code. After logging in to your account, 
                                    you will be redirected to your neighborhoods page where 
                                    you can create or join communities for your area.
                                </p>
                            </section>
                            <section>
                                <h2>View Neighborhoods</h2>
                                <p>
                                    Scraps organizes user zip codes into neighborhoods 
                                    so you can communicate with the people near you. 
                                    If there is not already a neighborhood near where 
                                    you live to join, you can create one. After entering 
                                    a neighbor hood, you will be redirected to the 
                                    listings page.
                                </p>
                            </section>
                            <section>
                                <h2>View Listings</h2>
                                <p>
                                    The listings page is where you can view the food 
                                    items available to claim in your currently selected 
                                    neighborhood. These listings will provide an image 
                                    of the item, its name, its drop off location, and its 
                                    expiration date. In the listings page, you also have 
                                    the option to create your own listing, which will prompt 
                                    you to enter the same type of information describes above.
                                </p>
                            </section>
                            <section>
                                <h2>Account Management</h2>
                                <p>
                                    At any time, you can update your profile and personal 
                                    information when needed, and you can even manage list 
                                    of your personal zip codes if you know you might visit 
                                    more than one place at once.
                                </p>
                            </section>
                        </div>
                    </section>
                </main>
                <SiteFooter/>
                
            </div>
            
       </>
    );
}