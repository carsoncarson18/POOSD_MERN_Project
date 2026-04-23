import SiteFooter from "../components/SiteFooter/SiteFooter";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import hero_image from "../assets/landing-page/food-waste-bg.png"

export default function LandingPage() {

    return (
        <>

            <div id="landing-page">
                <SiteHeader />
                <main style={{ padding: '0 0 80px 0' }}>
                    <div style={{ padding: '0 0 70px 0', boxShadow: '0 8px 22px -15px black ', width: '100%', minHeight: '500px', position: 'relative', zIndex: 0, overflow: 'hidden', paddingTop: '90px', paddingBottom: '90px' }}>
                        <img style={{ width: '100%', height: '100%', opacity: .4, objectFit: 'cover', objectPosition: 'top', position: 'absolute', bottom: 0, filter: 'blur(8px)', transform: 'scale(1.05)' }} alt="Bag of Food Scraps" fetchPriority="high" src={hero_image} />
                        <div style={{
                            zIndex: 1,
                            width: '60%',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 15,
                            paddingTop: 50,
                            textShadow: '0 2px 14px black',
                            backdropFilter: 'blur(2px)',
                            margin: '0 auto'
                        }}>
                            <h1 style={{ margin: 0, color: 'white' }}>Welcome to the Neighborhood!</h1>
                            <p style={{ width: '80%', margin: 0, fontWeight: 600, color: 'white' }}>
                                Scraps is our solution to having too many extra ingredients or
                                food items that you don't want to go to waste.<br /><br />
                                With Scraps, you can post extra items with their expiration date
                                online and your neighbors can claim them. If you're short a few
                                items, check your Scraps feed; it might just have what you're
                                looking for!
                            </p>
                        </div>
                    </div>
                    <section>
                        <h1>How does Scraps work?</h1>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
                            <section>
                                <h2>Create an Account</h2>
                                <p>
                                    On the signup page, you'll be prompted to enter some
                                    profile information like your first name and email.
                                    We'll send an email verifying your account and, after
                                    following the instructions, you can log in and see your
                                    very own neighborhoods page.
                                </p>
                            </section>
                            <section>
                                <h2>View Neighborhoods</h2>
                                <p>
                                    Scraps organizes user zip codes into neighborhoods
                                    so you can communicate with the people near you.
                                    If there's not already a neighborhood near where
                                    you live to join, you can create one and name it.
                                    After entering a neighborhood, you'll be redirected
                                    to the neighborhood's listings page.
                                </p>
                            </section>
                            <section>
                                <h2>View Listings</h2>
                                <p>
                                    The listings page is where you can view the claimable
                                    food items posted by the members of the neighborhood.
                                    These listings will provide the item's image, name,
                                    description, quantity, category, and expiration date.
                                    You can filter based on category or just scroll through
                                    the entire page. On the flip side, you can also create
                                    your own listing on this page; just enter the same type
                                    of information described above and hit post!
                                </p>
                            </section>
                            <section>
                                <h2>Account Management</h2>
                                <p>
                                    At any time, you can update your own listings when
                                    needed or even update the list of your personal zips.
                                    If you're staying in an new area for a while, enter
                                    its zipcode and see if you can connect with the
                                    neighborhood through Scraps, the fantastic community-driven
                                    food-sharing platform!
                                </p>
                            </section>
                        </div>
                    </section>
                </main>
                <SiteFooter />

            </div>

        </>
    );
}