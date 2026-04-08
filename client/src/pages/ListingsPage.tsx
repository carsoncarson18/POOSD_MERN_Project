import { useEffect, useState } from "react";
import { href, useNavigate } from "react-router-dom";
import ListingsHeader from "../components/ListingHeader";
import styles from "../styles/listings.module.css";
import SiteFooter from "../components/SiteFooter/SiteFooter";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import tempImg from "../assets/landing-page/food-waste-bg.png";

// import "../App.css";
// import Header from "../components/Header";
type Listing = {
  name: string;
  quantity: {
    value: number;
    unit: string;
  };
  expiresAt: string;
  category: string;
  imageUrl: string;
  claimed: boolean;
};

function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);
  useEffect(() => {
    const mockData: Listing[] = [
      {
        name: "Apples",
        quantity: { value: 5, unit: "pcs" },
        expiresAt: "2026-04-10",
        category: "Fruit",
        imageUrl: tempImg,
        claimed: false,
      },
      {
        name: "Milk",
        quantity: { value: 1, unit: "liter" },
        expiresAt: "2026-04-07",
        category: "Dairy",
        imageUrl: "",
        claimed: false,
      },
      {
        name: "chicken",
        quantity: { value: 1, unit: "liter" },
        expiresAt: "2026-04-08",
        category: "Meat",
        imageUrl: "",
        claimed: false,
      },
      {
        name: "beef",
        quantity: { value: 1, unit: "liter" },
        expiresAt: "2026-04-09",
        category: "Meat",
        imageUrl: "",
        claimed: false,
      },
    ];
    const available = mockData.filter((item) => !item.claimed);
    setListings(available);
  }, []);

  const handleClaim = (index: number) => {
    setConfirmIndex(index);
  };

  const handleConfirm = (index: number) => {
    const updated = [...listings];
    updated[index].claimed = true;
    setListings(updated);
    setConfirmIndex(null);
  };

  const handleCancel = () => {
    setConfirmIndex(null);
  };

  return (
    <div>
      {/* <ListingsHeader /> */}
      <SiteHeader />

      <main className={styles.listingspage}>
        <div className={styles.actions}>
          {/* return to neighborhoods page, will link when page is made*/}
          <a className={styles.returnbutton} href="">
            ← Neighborhoods
          </a>
          <button className={styles.addlisting}>+ Add Listing</button>
        </div>

        <div className={styles.listingscontainer}>
          <div className={styles.listingsgrid}>
            {listings.map((item, index) => (
              <div key={index} className={styles.listingcard}>
                <img src={item.imageUrl} alt={item.name} />
                <div className={styles.listingdetails}>
                  <h2>{item.name}</h2>
                  <p>
                    <strong>Quantity:</strong> {item.quantity.value}{" "}
                    {item.quantity.unit}
                  </p>
                  <p>
                    <strong>Expires:</strong>{" "}
                    {new Date(item.expiresAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Category:</strong> {item.category}
                  </p>
                </div>
                <div className={styles.listingactions}>
                  {/* BUTTON SECTION */}
                  <div className={styles.buttongroup}>
                    {confirmIndex === index ? (
                      <>
                        <button
                          className={styles.btnconfirm}
                          onClick={() => handleConfirm(index)}
                        >
                          Confirm
                        </button>
                        <button
                          className={styles.btncancel}
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className={styles.btnclaim}
                        onClick={() => handleClaim(index)}
                      >
                        Claim
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter></SiteFooter>
    </div>
  );
}
export default ListingsPage;
