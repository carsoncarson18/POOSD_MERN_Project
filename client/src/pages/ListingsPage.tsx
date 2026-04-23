import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import ListingsHeader from "../components/ListingHeader";
import axios from "axios";
import styles from "../styles/listings.module.css";
import SiteFooter from "../components/SiteFooter/SiteFooter";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import IngredientCard from "../components/IngredientCard.tsx";
import AddIngredientModal from "../components/AddIngredientModal/AddIngredientModal.tsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

type Ingredient = {
  _id: string;
  name: string;
  description: string;
  quantity: { value: number; unit: string };
  expiresAt: string;
  category: string;
  imageUrl: string;
  claimed: boolean;
  postedBy: string;
  createdAt: string;
};

type Neighborhood = {
  _id: string;
  name: string;
  zipCode: string;
};

function ListingsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // TEMP testing -  will delete when neighborhoods page is made
  // const neighborhood = location.state?.neighborhood ?? {
  //   _id: "69d6ebf15199fe9f257fc531",
  //   name: "Zainab-Hood",
  //   zipCode: "12345",
  // };

  // vvvv switch back to this line vvvv
  const neighborhood: Neighborhood | undefined = location.state?.neighborhood;

  // const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  // console.log("user object", user);

  // main states
  const [listings, setListings] = useState<Ingredient[]>([]);
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);

  const filteredListings =
    activeCategory === "all"
      ? listings.filter((i) => i.postedBy !== user?.id) // only show items not posted by user
      : activeCategory === "your items"
        ? listings.filter((i) => i.postedBy === user?.id) // only show items the user posted
        : listings.filter(
            (i) => i.category === activeCategory && i.postedBy !== user?.id, // items in a specific category
          );

  // gets categories that have items
  const availableCategories = [
    "all",
    "your items",
    ...new Set(listings.map((i) => i.category)),
  ];

  // if there isn't a neighborhood selected, go back to the neighborhoods page
  useEffect(() => {
    if (!neighborhood) {
      navigate("/neighborhoods");
      return;
    }
    fetchListings();
  }, []);

  // display claimmed ingredient message for 4 seconds
  useEffect(() => {
    if (claimSuccess) {
      const timer = setTimeout(() => setClaimSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [claimSuccess]);

  // get the list of ingredients within a neighborhood
  async function fetchListings() {
    setLoading(true);
    setError("");
    setActiveCategory("all");

    try {
      const res = await axios.get(
        `${API_URL}/api/getAllHoodIngredients?_id=${neighborhood!._id}`,
        // { headers: { Authorization: `Bearer ${token}` } },
      );

      /*
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to Load listings");

      setListings(
        json.ingredients
          .filter((i: Ingredient) => !i.claimed)
          .sort(
            (a: Ingredient, b: Ingredient) =>
              new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime(),
          ),
      );
      */

      // sort listings by expiration date
      setListings(
        res.data.ingredients
          .filter((i: Ingredient) => !i.claimed)
          .sort(
            (a: Ingredient, b: Ingredient) =>
              new Date(a.expiresAt).getDate() - new Date(b.expiresAt).getDate(),
          ),
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleClaim = (index: number) => setConfirmIndex(index);
  const handleCancel = () => setConfirmIndex(null);

  const handleConfirm = async (index: number) => {
    try {
      const item = filteredListings[index];
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/claimIngredient`,
        { _id: item._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      /* // replaced with axios
      const res = await fetch(`${API_URL}/api/claimIngredient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ _id: item._id }),
      });
      if (!res.ok) throw new Error("Failed to claim");
      */

      // remove from listing and display confirmation
      setListings((prev) => prev.filter((_, i) => i !== index));
      setConfirmIndex(null);
      setClaimSuccess(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // deleting an ingredient if the user posted it
  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/deleteIngredient`, {
        data: { _id: id },
        headers: { Authorization: `Bearer ${token}` },
      });

      /* replaced with axios
      const res = await fetch(`${API_URL}/api/deleteIngredient`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ _id: id }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      */

      setListings((prev) => prev.filter((i) => i._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  //
  const handleEdit = async (id: string, updatedFields: Partial<Ingredient>) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/editIngredient`,
        { _id: id, ...updatedFields },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setListings((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, ...updatedFields } : item,
        ),
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  // add the new ingredient to the list
  function handleCreated(newIngredient: any) {
    setListings((prev) => [newIngredient, ...prev]);
  }

  return (
    <div>
      {/* <ListingsHeader /> */}
      <SiteHeader />
      <main className={styles.listingspage}>
        {/* list of posted scraps */}
        <div className={styles.listingscontainer}>
          {loading && (
            <p style={{ color: "white", textAlign: "center" }}>Loading...</p>
          )}
          {error && (
            <p style={{ color: "#6c2c2cff", textAlign: "center" }}>{error}</p>
          )}
          {!loading && !error && listings.length === 0 && (
            <p style={{ color: "white", textAlign: "center" }}>
              No scraps posted yet - be the first!
            </p>
          )}

          <div className={styles.actions}>
            <div className={styles.neighborhoodName}>
              <h1>{neighborhood?.name}</h1>
            </div>

            <div className={styles.buttons}>
              {/* return to neighborhoods page */}
              <button onClick={() => navigate("/neighborhoods")}>
                ← Neighborhoods
              </button>

              {/* add a scrap */}
              <button onClick={() => setShowModal(true)}>+ Add Listing</button>
            </div>
          </div>

          {/* filter options */}
          <div className={styles.filterbar}>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterbtn} ${activeCategory === cat ? styles.filterbtnactive : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* view listings in specific categories */}
          <div className={styles.listingsgrid}>
            {filteredListings.map((item, index) => (
              <IngredientCard
                key={item._id}
                item={item}
                index={index}
                confirmIndex={confirmIndex}
                currentUserId={user?.id ?? null}
                onClaim={handleClaim}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onDelete={handleDelete}
                onEdit={(item) => setEditingItem(item)}
              />
            ))}
          </div>
        </div>

        {/* add ingredient popup if showModal = true */}
        {showModal && (
          <AddIngredientModal
            neighborhoodId={neighborhood!._id}
            token={null}
            onCreated={handleCreated}
            onClose={() => setShowModal(false)}
          />
        )}

        {editingItem && (
          <AddIngredientModal
            neighborhoodId={neighborhood!._id}
            token={null}
            existingIngredient={editingItem}
            onCreated={(updated) => {
              setListings((prev) =>
                prev.map((i) => (i._id === updated._id ? updated : i)),
              );
              setEditingItem(null);
            }}
            onClose={() => setEditingItem(null)}
          />
        )}

        {/* claim success popup */}
        {claimSuccess && (
          <div className={styles.claimPopup}>
            <p>Item Claimed!</p>
            <p>The owner has been emailed and will be in touch.</p>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

export default ListingsPage;
