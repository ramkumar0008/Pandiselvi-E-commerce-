import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const updateCart = (id, quantity) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Number(quantity) }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item._id !== id
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const deliveryCharge = subtotal >= 999 ? 0 : 49;
  const total = subtotal + deliveryCharge;

  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const formatPrice = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <div style={styles.container}>
          {/* Page Header */}

          <div style={styles.pageHeader}>
            <div>
              <p style={styles.eyebrow}>YOUR SHOPPING BAG</p>
              <h1 style={styles.heading}>Shopping Cart</h1>
              <p style={styles.subtitle}>
                Review your items and get ready to checkout.
              </p>
            </div>

            <div style={styles.itemCount}>
              <span style={styles.bagIcon}>🛍️</span>
              <div>
                <strong style={styles.itemCountNumber}>
                  {totalItems}
                </strong>
                <span style={styles.itemCountLabel}>
                  {totalItems === 1 ? "Item" : "Items"}
                </span>
              </div>
            </div>
          </div>

          {/* Empty Cart */}

          {cart.length === 0 ? (
            <section style={styles.emptyCard}>
              <div style={styles.emptyIcon}>🛒</div>

              <p style={styles.eyebrow}>YOUR BAG IS WAITING</p>

              <h2 style={styles.emptyTitle}>
                Your cart is empty
              </h2>

              <p style={styles.emptyDescription}>
                Looks like you haven't added anything yet.
                Explore our collection and find something you love.
              </p>

              <button
                type="button"
                onClick={() => navigate("/products")}
                style={styles.primaryButton}
              >
                Explore Products <span>→</span>
              </button>

              <p style={styles.secureNote}>
                ✦ A great find is just a click away
              </p>
            </section>
          ) : (
            <>
              {/* Shopping Layout */}

              <div style={styles.layout}>
                {/* Cart Items */}

                <section style={styles.itemsSection}>
                  <div style={styles.sectionHeader}>
                    <div>
                      <h2 style={styles.sectionTitle}>
                        Your Items
                      </h2>
                      <p style={styles.sectionSubtitle}>
                        Your selected products
                      </p>
                    </div>

                    <span style={styles.countBadge}>
                      {cart.length}{" "}
                      {cart.length === 1 ? "product" : "products"}
                    </span>
                  </div>

                  {cart.map((item) => (
                    <article
                      key={item._id}
                      style={styles.productCard}
                    >
                      {/* Product Image */}

                      <div style={styles.imageContainer}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={styles.productImage}
                        />
                      </div>

                      {/* Product Details */}

                      <div style={styles.productDetails}>
                        <span style={styles.category}>
                          {item.category || "PRODUCT"}
                        </span>

                        <h3 style={styles.productName}>
                          {item.name}
                        </h3>

                        <p style={styles.unitPrice}>
                          ₹{formatPrice(item.price)}
                          <span> / unit</span>
                        </p>

                        <div style={styles.mobileControls}>
                          <div style={styles.quantityGroup}>
                            <label
                              htmlFor={`quantity-${item._id}`}
                              style={styles.quantityLabel}
                            >
                              Quantity
                            </label>

                            <input
                              id={`quantity-${item._id}`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateCart(
                                  item._id,
                                  e.target.value
                                )
                              }
                              style={styles.quantityInput}
                            />
                          </div>

                          <strong style={styles.mobilePrice}>
                            ₹
                            {formatPrice(
                              Number(item.price) *
                                Number(item.quantity)
                            )}
                          </strong>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item._id)}
                          style={styles.removeButton}
                        >
                          <span style={styles.removeIcon}>×</span>
                          Remove item
                        </button>
                      </div>

                      {/* Desktop Quantity and Price */}

                      <div style={styles.productControls}>
                        <label
                          htmlFor={`desktop-quantity-${item._id}`}
                          style={styles.quantityLabel}
                        >
                          Qty
                        </label>

                        <input
                          id={`desktop-quantity-${item._id}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateCart(item._id, e.target.value)
                          }
                          style={styles.quantityInput}
                        />

                        <strong style={styles.lineTotal}>
                          ₹
                          {formatPrice(
                            Number(item.price) *
                              Number(item.quantity)
                          )}
                        </strong>
                      </div>
                    </article>
                  ))}

                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                    style={styles.continueButton}
                  >
                    <span>←</span> Continue Shopping
                  </button>
                </section>

                {/* Order Summary */}

                <aside style={styles.summaryCard}>
                  <div style={styles.summaryHeader}>
                    <div>
                      <p style={styles.summaryEyebrow}>
                        PAYMENT OVERVIEW
                      </p>
                      <h2 style={styles.summaryTitle}>
                        Order Summary
                      </h2>
                    </div>

                    <span style={styles.summaryIcon}>🧾</span>
                  </div>

                  <div style={styles.summaryItemCount}>
                    <span>Items in your bag</span>
                    <strong>{totalItems}</strong>
                  </div>

                  <div style={styles.summaryRow}>
                    <span>Subtotal</span>
                    <strong>₹{formatPrice(subtotal)}</strong>
                  </div>

                  <div style={styles.summaryRow}>
                    <span>Delivery charge</span>

                    {deliveryCharge === 0 ? (
                      <strong style={styles.freeDelivery}>
                        FREE
                      </strong>
                    ) : (
                      <strong>
                        ₹{formatPrice(deliveryCharge)}
                      </strong>
                    )}
                  </div>

                  {deliveryCharge > 0 && (
                    <div style={styles.deliveryMessage}>
                      <span>🚚</span>
                      <p>
                        Add ₹
                        {formatPrice(999 - subtotal)} more for free
                        delivery.
                      </p>
                    </div>
                  )}

                  {deliveryCharge === 0 && (
                    <div style={styles.deliverySuccess}>
                      <span>✓</span>
                      You unlocked free delivery!
                    </div>
                  )}

                  <div style={styles.divider} />

                  <div style={styles.totalRow}>
                    <div>
                      <strong style={styles.totalLabel}>
                        Total Amount
                      </strong>
                      <p style={styles.taxNote}>
                        Delivery included
                      </p>
                    </div>

                    <strong style={styles.totalPrice}>
                      ₹{formatPrice(total)}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/checkout")}
                    style={styles.checkoutButton}
                  >
                    Proceed to Checkout
                    <span>→</span>
                  </button>

                  <div style={styles.paymentInfo}>
                    <span style={styles.paymentIcon}>🔒</span>
                    <div>
                      <strong style={styles.paymentTitle}>
                        Safe & Secure Checkout
                      </strong>
                      <p style={styles.paymentDescription}>
                        Cash on Delivery available
                      </p>
                    </div>
                  </div>

                  <div style={styles.summaryFooter}>
                    <span>✓ Easy ordering</span>
                    <span>✓ Trusted shopping</span>
                  </div>
                </aside>
              </div>
            </>
          )}

          <footer style={styles.footer}>
            <span>© {new Date().getFullYear()}</span>
            <span style={styles.footerDivider}>·</span>
            <span>PandiSelvi E-Commerce</span>
          </footer>
        </div>
      </main>
    </>
  );
}

const styles = {
  page: {
    minHeight: "85vh",
    background: "#f5f6fc",
    color: "#172033",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    padding: "clamp(20px, 4vw, 45px) 0",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "0 clamp(16px, 4vw, 45px)",
    boxSizing: "border-box",
  },

  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "35px",
  },

  eyebrow: {
    color: "#6366f1",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "2px",
    margin: "0 0 10px",
  },

  heading: {
    fontSize: "clamp(29px, 4vw, 40px)",
    fontWeight: 850,
    letterSpacing: "-1.5px",
    lineHeight: 1.2,
    color: "#111827",
    margin: "0 0 10px",
  },

  subtitle: {
    fontSize: "14px",
    lineHeight: 1.7,
    color: "#778196",
    margin: 0,
  },

  itemCount: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    background: "#ffffff",
    padding: "14px 19px",
    borderRadius: "14px",
    border: "1px solid #e7eaf2",
    boxShadow: "0 5px 20px rgba(31,41,55,0.035)",
  },

  bagIcon: {
    width: "43px",
    height: "43px",
    display: "grid",
    placeItems: "center",
    borderRadius: "12px",
    background: "#eef2ff",
    fontSize: "21px",
  },

  itemCountNumber: {
    display: "block",
    color: "#172033",
    fontSize: "22px",
    fontWeight: 800,
  },

  itemCountLabel: {
    display: "block",
    color: "#778196",
    fontSize: "12px",
    marginTop: "2px",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 350px)",
    alignItems: "start",
    gap: "26px",
  },

  itemsSection: {
    minWidth: 0,
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  sectionTitle: {
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    color: "#172033",
    margin: "0 0 6px",
  },

  sectionSubtitle: {
    fontSize: "13px",
    color: "#8791a3",
    margin: 0,
  },

  countBadge: {
    background: "#eef2ff",
    color: "#4338ca",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 750,
  },

  productCard: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "21px",
    marginBottom: "15px",
    background: "#ffffff",
    border: "1px solid #e7eaf2",
    borderRadius: "17px",
    boxShadow: "0 5px 22px rgba(31,41,55,0.035)",
    boxSizing: "border-box",
    minWidth: 0,
  },

  imageContainer: {
    width: "118px",
    height: "118px",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    background: "#f7f8fc",
    border: "1px solid #edf0f6",
    borderRadius: "13px",
    padding: "8px",
    boxSizing: "border-box",
  },

  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: "8px",
  },

  productDetails: {
    flex: 1,
    minWidth: 0,
  },

  category: {
    display: "inline-block",
    color: "#6366f1",
    background: "#eef2ff",
    padding: "5px 8px",
    borderRadius: "5px",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.6px",
    textTransform: "uppercase",
    marginBottom: "9px",
  },

  productName: {
    fontSize: "16px",
    fontWeight: 750,
    lineHeight: 1.5,
    color: "#172033",
    margin: "0 0 7px",
    overflowWrap: "anywhere",
  },

  unitPrice: {
    fontSize: "14px",
    fontWeight: 750,
    color: "#4f46e5",
    margin: 0,
  },

  mobileControls: {
    display: "none",
  },

  quantityGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  quantityLabel: {
    color: "#8791a3",
    fontSize: "12px",
    fontWeight: 650,
  },

  quantityInput: {
    width: "68px",
    boxSizing: "border-box",
    padding: "10px 7px",
    border: "1px solid #dce1eb",
    borderRadius: "8px",
    outlineColor: "#6366f1",
    color: "#172033",
    background: "#ffffff",
    fontSize: "14px",
    fontWeight: 700,
    textAlign: "center",
  },

  removeButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "16px",
    padding: "0",
    border: "none",
    background: "transparent",
    color: "#dc2626",
    fontSize: "12px",
    fontWeight: 650,
    cursor: "pointer",
  },

  removeIcon: {
    fontSize: "19px",
    lineHeight: 1,
  },

  productControls: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "9px",
    flexShrink: 0,
  },

  lineTotal: {
    color: "#172033",
    fontSize: "16px",
    fontWeight: 800,
    whiteSpace: "nowrap",
    marginTop: "6px",
  },

  continueButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "9px",
    marginTop: "8px",
    padding: "12px 0",
    border: "none",
    background: "transparent",
    color: "#4f46e5",
    fontSize: "13px",
    fontWeight: 750,
    cursor: "pointer",
  },

  summaryCard: {
    position: "sticky",
    top: "20px",
    background: "#ffffff",
    padding: "25px",
    border: "1px solid #e4e7f0",
    borderRadius: "18px",
    boxShadow: "0 9px 30px rgba(31,41,55,0.055)",
    boxSizing: "border-box",
    minWidth: 0,
  },

  summaryHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "23px",
  },

  summaryEyebrow: {
    color: "#818cf8",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.5px",
    margin: "0 0 7px",
  },

  summaryTitle: {
    fontSize: "21px",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    color: "#172033",
    margin: 0,
  },

  summaryIcon: {
    width: "43px",
    height: "43px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    background: "#eef2ff",
    borderRadius: "12px",
    fontSize: "20px",
  },

  summaryItemCount: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    color: "#778196",
    fontSize: "13px",
    paddingBottom: "17px",
    borderBottom: "1px solid #edf0f6",
    marginBottom: "17px",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    marginBottom: "17px",
    color: "#778196",
    fontSize: "13px",
  },

  freeDelivery: {
    color: "#059669",
    fontWeight: 800,
  },

  deliveryMessage: {
    display: "flex",
    alignItems: "flex-start",
    gap: "9px",
    padding: "12px",
    background: "#fffbeb",
    border: "1px solid #fef3c7",
    borderRadius: "10px",
    marginTop: "3px",
    color: "#92400e",
  },

  deliverySuccess: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px",
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "10px",
    marginTop: "3px",
    color: "#047857",
    fontSize: "12px",
    fontWeight: 700,
  },

  divider: {
    borderTop: "1px solid #e7eaf2",
    margin: "22px 0",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },

  totalLabel: {
    display: "block",
    color: "#172033",
    fontSize: "14px",
    fontWeight: 800,
  },

  taxNote: {
    color: "#98a1b2",
    fontSize: "11px",
    margin: "5px 0 0",
  },

  totalPrice: {
    color: "#4338ca",
    fontSize: "23px",
    fontWeight: 850,
    letterSpacing: "-0.5px",
    whiteSpace: "nowrap",
  },

  checkoutButton: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginTop: "25px",
    padding: "15px 17px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #4338ca, #6366f1)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 750,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(79,70,229,0.2)",
    boxSizing: "border-box",
  },

  paymentInfo: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    marginTop: "22px",
    padding: "15px 0",
    borderBottom: "1px solid #edf0f6",
  },

  paymentIcon: {
    width: "38px",
    height: "38px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    background: "#f3f4f6",
    borderRadius: "10px",
    fontSize: "17px",
  },

  paymentTitle: {
    display: "block",
    color: "#374151",
    fontSize: "12px",
    fontWeight: 750,
  },

  paymentDescription: {
    color: "#8791a3",
    fontSize: "11px",
    margin: "5px 0 0",
  },

  summaryFooter: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px 14px",
    marginTop: "15px",
    color: "#778196",
    fontSize: "10px",
    fontWeight: 650,
  },

  emptyCard: {
    background: "#ffffff",
    border: "1px solid #e7eaf2",
    borderRadius: "20px",
    padding: "clamp(35px, 7vw, 75px) 20px",
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(31,41,55,0.04)",
  },

  emptyIcon: {
    width: "90px",
    height: "90px",
    display: "grid",
    placeItems: "center",
    margin: "0 auto 25px",
    borderRadius: "25px",
    background: "#eef2ff",
    fontSize: "43px",
  },

  emptyTitle: {
    color: "#172033",
    fontSize: "clamp(23px, 3vw, 29px)",
    fontWeight: 800,
    margin: "0 0 12px",
  },

  emptyDescription: {
    maxWidth: "420px",
    margin: "0 auto",
    color: "#778196",
    fontSize: "14px",
    lineHeight: 1.8,
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "25px",
    marginTop: "25px",
    padding: "14px 23px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #4338ca, #6366f1)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 750,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(79,70,229,0.2)",
  },

  secureNote: {
    margin: "25px 0 0",
    color: "#98a1b2",
    fontSize: "12px",
  },

  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "9px",
    marginTop: "45px",
    padding: "20px 0 5px",
    borderTop: "1px solid #e7eaf2",
    color: "#98a1b2",
    fontSize: "12px",
  },

  footerDivider: {
    color: "#c7d2fe",
  },
};

export default Cart;
