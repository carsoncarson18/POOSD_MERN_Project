import styles from "../styles/listings.module.css";

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

type Props = {
  item: Ingredient;
  index: number;
  confirmIndex: number | null;
  currentUserId: string | null;
  onClaim: (index: number) => void;
  onConfirm: (index: number) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
};

export default function IngredientCard({
  item,
  index,
  confirmIndex,
  currentUserId,
  onClaim,
  onConfirm,
  onCancel,
  onDelete,
}: Props) {
  const isOwner = currentUserId && item.postedBy === currentUserId;
  const posted = new Date(item.createdAt).toLocaleDateString();

  return (
    <div className={styles.listingcard}>
      {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
      <div className={styles.listingdetails}>
        <h2>{item.name}</h2>
        <p>
          <strong>Quantity:</strong> {item.quantity.value} {item.quantity.unit}
        </p>
        <p>
          <strong>Expires:</strong>{" "}
          {new Date(item.expiresAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Category:</strong> {item.category}
        </p>
        <p>
          <strong>Posted:</strong> {posted}
        </p>
        <p>
          <strong>Description:</strong> {item.description}
        </p>
      </div>
      <div className={styles.listingactions}>
        <div className={styles.buttongroup}>
          {isOwner ? (
            <button
              className={styles.btncancel}
              onClick={() => onDelete(item._id)}
            >
              Remove
            </button>
          ) : confirmIndex === index ? (
            <>
              <button
                className={styles.btnconfirm}
                onClick={() => onConfirm(index)}
              >
                Confirm
              </button>
              <button className={styles.btncancel} onClick={onCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button className={styles.btnclaim} onClick={() => onClaim(index)}>
              Claim
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
