import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Navbar from "../components/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  stock: "",
  featured: false,
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/products`);

      setProducts(
        Array.isArray(response.data) ? response.data : []
      );
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load products. Check your backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);
        } catch {
          setToken("");
        }
      } else {
        setToken("");
      }

      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authLoading && user && token) {
      fetchProducts();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user, token, fetchProducts]);

  const categories = [
    ...new Set(
      products.map((product) => product.category).filter(Boolean)
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      product.name?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query);

    const matchesCategory =
      !category || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyProduct);
    setEditingId(null);
  };

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!user || !token) {
      setError("Please log in with your admin account.");
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.image.trim() ||
      !form.category.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError("Enter a valid price greater than or equal to zero.");
      return;
    }

    if (
      form.stock === "" ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError(
        "Stock must be a whole number greater than or equal to zero."
      );
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      image: form.image.trim(),
      category: form.category.trim(),
      stock,
      featured: form.featured,
    };

    try {
      setSaving(true);

      if (editingId) {
        await axios.put(
          `${API_URL}/products/${editingId}`,
          payload,
          authConfig
        );

        setMessage("Product updated successfully!");
      } else {
        await axios.post(
          `${API_URL}/products`,
          payload,
          authConfig
        );

        setMessage("Product added successfully!");
      }

      resetForm();
      await fetchProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save product. Check your admin permissions."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      image: product.image || "",
      category: product.category || "",
      stock: String(product.stock ?? 0),
      featured: Boolean(product.featured),
    });

    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await axios.delete(
        `${API_URL}/products/${product._id}`,
        authConfig
      );

      setProducts((previous) =>
        previous.filter((item) => item._id !== product._id)
      );

      if (editingId === product._id) {
        resetForm();
      }

      setMessage("Product deleted successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete product. Check your admin permissions."
      );
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <main style={styles.center}>
          <div style={styles.loadingCard}>
            <div style={styles.spinner} />
            <h2 style={styles.loadingTitle}>
              Checking authentication
            </h2>
            <p style={styles.muted}>
              Please wait while we verify your account.
            </p>
          </div>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main style={styles.center}>
          <div style={styles.accessCard}>
            <div style={styles.lockIcon}>🔐</div>
            <p style={styles.eyebrow}>RESTRICTED AREA</p>
            <h1 style={styles.heading}>Admin Login Required</h1>
            <p style={styles.muted}>
              Please log in with your authorized admin account to
              manage products.
            </p>
            <Link to="/login" style={styles.primaryLink}>
              Go to Login →
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <header style={styles.topBar}>
          <div>
            <p style={styles.eyebrow}>PANDISELVI / ADMIN</p>
            <h1 style={styles.heading}>Product Management</h1>
            <p style={styles.muted}>
              Add, update and manage your store products.
            </p>
          </div>

          <Link to="/admin" style={styles.secondaryLink}>
            ← Admin Dashboard
          </Link>
        </header>

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📦</div>
            <div>
              <p style={styles.statLabel}>Total Products</p>
              <h2 style={styles.statValue}>{products.length}</h2>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>⭐</div>
            <div>
              <p style={styles.statLabel}>Featured Products</p>
              <h2 style={styles.statValue}>
                {products.filter((product) => product.featured).length}
              </h2>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>🏷️</div>
            <div>
              <p style={styles.statLabel}>Categories</p>
              <h2 style={styles.statValue}>{categories.length}</h2>
            </div>
          </div>
        </section>

        {error && (
          <div role="alert" style={styles.error}>
            <span style={styles.alertIcon}>!</span>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div role="status" style={styles.success}>
            <span>✓</span>
            <span>{message}</span>
          </div>
        )}

        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionEyebrow}>PRODUCT DETAILS</p>
              <h2 style={styles.sectionTitle}>
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <p style={styles.muted}>
                Enter the product information below.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                style={styles.cancelButton}
                onClick={resetForm}
              >
                ✕ Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <label style={styles.label}>
                Product Name *
                <input
                  style={styles.input}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Headphones"
                  required
                />
              </label>

              <label style={styles.label}>
                Category *
                <input
                  style={styles.input}
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  required
                />
              </label>

              <label style={styles.label}>
                Price (₹) *
                <input
                  style={styles.input}
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="1999"
                  required
                />
              </label>

              <label style={styles.label}>
                Stock Quantity *
                <input
                  style={styles.input}
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  placeholder="20"
                  required
                />
              </label>

              <label style={styles.labelFull}>
                Product Image URL *
                <input
                  style={styles.input}
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/product.jpg"
                  required
                />
              </label>

              <label style={styles.labelFull}>
                Description *
                <textarea
                  style={styles.textarea}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter product description..."
                  rows={4}
                  required
                />
              </label>

              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                <span>Mark as featured product</span>
              </label>
            </div>

            <div style={styles.formActions}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  ...styles.primaryButton,
                  opacity: saving ? 0.65 : 1,
                  cursor: saving ? "wait" : "pointer",
                }}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "✓ Save Changes"
                    : "+ Add Product"}
              </button>
            </div>
          </form>
        </section>

        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionEyebrow}>YOUR INVENTORY</p>
              <h2 style={styles.sectionTitle}>All Products</h2>
              <p style={styles.muted}>
                {filteredProducts.length} product(s) displayed
              </p>
            </div>

            <button
              type="button"
              onClick={fetchProducts}
              style={styles.cancelButton}
            >
              ↻ Refresh
            </button>
          </div>

          <div style={styles.filters}>
            <div style={styles.searchWrap}>
              <span style={styles.searchIcon}>⌕</span>
              <input
                style={styles.searchInput}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
              />
            </div>

            <select
              style={styles.select}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div style={styles.emptyState}>
              <div style={styles.spinner} />
              <p style={styles.centerText}>Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📦</div>
              <h3 style={styles.emptyTitle}>No products found</h3>
              <p style={styles.centerText}>
                Try changing your search or category filter.
              </p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Product</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Featured</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td style={styles.td}>
                        <div style={styles.productCell}>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={styles.thumbnail}
                            onError={(event) => {
                              event.currentTarget.style.visibility = "hidden";
                            }}
                          />
                          <div style={styles.productInfo}>
                            <strong style={styles.productName}>
                              {product.name}
                            </strong>
                            <p style={styles.descriptionPreview}>
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td style={styles.td}>
                        <span style={styles.categoryBadge}>
                          {product.category}
                        </span>
                      </td>

                      <td style={styles.priceCell}>
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.stockBadge,
                            ...(Number(product.stock) === 0
                              ? styles.outOfStock
                              : Number(product.stock) < 5
                                ? styles.lowStock
                                : styles.inStock),
                          }}
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {product.featured ? (
                          <span style={styles.featuredBadge}>⭐ Featured</span>
                        ) : (
                          <span style={styles.notFeatured}>No</span>
                        )}
                      </td>

                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button
                            type="button"
                            style={styles.editButton}
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            style={styles.deleteButton}
                            onClick={() => handleDelete(product)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer style={styles.footer}>
          © {new Date().getFullYear()} PandiSelvi E-Commerce · Admin Panel
        </footer>
      </main>
    </>
  );
}

const styles = {
  page: {
    maxWidth: "1500px",
    margin: "0 auto",
    padding: "clamp(20px, 4vw, 48px)",
    background: "#f4f6fb",
    minHeight: "90vh",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    color: "#172033",
    boxSizing: "border-box",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "28px",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "2px",
    color: "#6366f1",
    margin: "0 0 10px",
  },
  heading: {
    fontSize: "clamp(26px, 3vw, 36px)",
    fontWeight: 800,
    letterSpacing: "-1px",
    color: "#111827",
    margin: "0 0 10px",
    lineHeight: 1.2,
  },
  muted: {
    color: "#778196",
    fontSize: "14px",
    margin: 0,
    lineHeight: 1.7,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
    gap: "18px",
    marginBottom: "26px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "#ffffff",
    border: "1px solid #e7eaf2",
    borderRadius: "15px",
    padding: "21px",
    boxShadow: "0 6px 20px rgba(31, 41, 55, 0.035)",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    background: "#eef2ff",
    borderRadius: "13px",
    fontSize: "22px",
  },
  statLabel: {
    margin: "0 0 7px",
    color: "#778196",
    fontSize: "12px",
    fontWeight: 650,
  },
  statValue: {
    margin: 0,
    fontSize: "25px",
    fontWeight: 800,
    color: "#172033",
  },
  card: {
    background: "#ffffff",
    padding: "clamp(18px, 3vw, 30px)",
    border: "1px solid #e7eaf2",
    borderRadius: "18px",
    marginBottom: "26px",
    boxShadow: "0 8px 30px rgba(31, 41, 55, 0.045)",
    minWidth: 0,
    boxSizing: "border-box",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "26px",
  },
  sectionEyebrow: {
    color: "#818cf8",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.6px",
    margin: "0 0 8px",
  },
  sectionTitle: {
    fontSize: "21px",
    fontWeight: 750,
    color: "#111827",
    margin: "0 0 8px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
    gap: "22px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#374151",
    minWidth: 0,
  },
  labelFull: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#374151",
    gridColumn: "1 / -1",
    minWidth: 0,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 15px",
    border: "1px solid #dce1eb",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#172033",
    outlineColor: "#6366f1",
    background: "#fbfcff",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 15px",
    border: "1px solid #dce1eb",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#172033",
    fontFamily: "inherit",
    background: "#fbfcff",
    resize: "vertical",
    outlineColor: "#6366f1",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    fontSize: "14px",
    fontWeight: 650,
    color: "#374151",
    cursor: "pointer",
    flexWrap: "wrap",
  },
  checkbox: {
    width: "17px",
    height: "17px",
    accentColor: "#4f46e5",
  },
  formActions: {
    borderTop: "1px solid #edf0f6",
    marginTop: "25px",
    paddingTop: "22px",
  },
  primaryButton: {
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
    color: "#ffffff",
    padding: "14px 25px",
    fontSize: "14px",
    fontWeight: 750,
    boxShadow: "0 5px 14px rgba(79, 70, 229, 0.2)",
  },
  primaryLink: {
    display: "inline-block",
    textDecoration: "none",
    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
    color: "#ffffff",
    padding: "13px 21px",
    borderRadius: "10px",
    fontWeight: 700,
    marginTop: "18px",
  },
  secondaryLink: {
    textDecoration: "none",
    color: "#4338ca",
    border: "1px solid #dfe3f2",
    background: "#ffffff",
    padding: "12px 17px",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "13px",
  },
  cancelButton: {
    background: "#ffffff",
    border: "1px solid #dce1eb",
    borderRadius: "9px",
    padding: "11px 15px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    color: "#374151",
  },
  error: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#be123c",
    padding: "15px 18px",
    borderRadius: "11px",
    marginBottom: "22px",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  alertIcon: {
    width: "22px",
    height: "22px",
    flexShrink: 0,
    border: "1px solid #fda4af",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
  },
  success: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#047857",
    padding: "15px 18px",
    borderRadius: "11px",
    marginBottom: "22px",
    fontSize: "14px",
  },
  filters: {
    display: "flex",
    gap: "13px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: "1 1 250px",
    minWidth: 0,
    padding: "0 14px",
    border: "1px solid #dce1eb",
    borderRadius: "10px",
    background: "#fbfcff",
    boxSizing: "border-box",
  },
  searchIcon: {
    fontSize: "25px",
    lineHeight: 1,
    color: "#8791a3",
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    padding: "13px 0",
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#172033",
    background: "transparent",
  },
  select: {
    flex: "0 1 220px",
    minWidth: 0,
    padding: "13px 15px",
    border: "1px solid #dce1eb",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#374151",
    fontSize: "14px",
    outlineColor: "#6366f1",
    boxSizing: "border-box",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    border: "1px solid #edf0f6",
    borderRadius: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    textAlign: "left",
    fontSize: "13px",
    background: "#ffffff",
  },
  th: {
    padding: "16px 15px",
    background: "#f7f8fc",
    borderBottom: "1px solid #e7eaf2",
    color: "#596579",
    fontWeight: 750,
    whiteSpace: "nowrap",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  td: {
    padding: "16px 15px",
    borderBottom: "1px solid #f0f2f7",
    verticalAlign: "middle",
    color: "#374151",
  },
  productCell: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    minWidth: "230px",
  },
  productInfo: {
    minWidth: 0,
  },
  productName: {
    display: "block",
    color: "#172033",
    fontSize: "13px",
    lineHeight: 1.5,
  },
  thumbnail: {
    width: "58px",
    height: "58px",
    flexShrink: 0,
    objectFit: "contain",
    background: "#f8f9fd",
    border: "1px solid #e7eaf2",
    borderRadius: "11px",
    padding: "3px",
    boxSizing: "border-box",
  },
  descriptionPreview: {
    maxWidth: "270px",
    color: "#8791a3",
    fontSize: "12px",
    lineHeight: 1.6,
    margin: "5px 0 0",
  },
  categoryBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "7px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "12px",
    fontWeight: 650,
  },
  priceCell: {
    padding: "16px 15px",
    borderBottom: "1px solid #f0f2f7",
    verticalAlign: "middle",
    color: "#111827",
    fontWeight: 750,
    whiteSpace: "nowrap",
  },
  stockBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "7px",
    fontSize: "12px",
    fontWeight: 750,
  },
  inStock: {
    background: "#ecfdf5",
    color: "#047857",
  },
  lowStock: {
    background: "#fffbeb",
    color: "#b45309",
  },
  outOfStock: {
    background: "#fff1f2",
    color: "#be123c",
  },
  featuredBadge: {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: "7px",
    background: "#fffbeb",
    color: "#a16207",
    fontSize: "11px",
    fontWeight: 750,
    whiteSpace: "nowrap",
  },
  notFeatured: {
    color: "#98a1b2",
    fontSize: "12px",
  },
  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  editButton: {
    border: "1px solid #c7d2fe",
    borderRadius: "8px",
    padding: "9px 13px",
    background: "#eef2ff",
    color: "#4338ca",
    cursor: "pointer",
    fontWeight: 750,
    fontSize: "12px",
  },
  deleteButton: {
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "9px 13px",
    background: "#fff1f2",
    color: "#be123c",
    cursor: "pointer",
    fontWeight: 750,
    fontSize: "12px",
  },
  center: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "25px",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    background: "#f4f6fb",
    boxSizing: "border-box",
  },
  accessCard: {
    width: "100%",
    maxWidth: "440px",
    padding: "clamp(25px, 5vw, 40px)",
    borderRadius: "20px",
    background: "#ffffff",
    border: "1px solid #e7eaf2",
    boxShadow: "0 15px 45px rgba(31, 41, 55, 0.08)",
    textAlign: "center",
    boxSizing: "border-box",
  },
  lockIcon: {
    fontSize: "44px",
    marginBottom: "18px",
  },
  loadingCard: {
    width: "100%",
    maxWidth: "420px",
    padding: "35px",
    textAlign: "center",
    background: "#ffffff",
    border: "1px solid #e7eaf2",
    borderRadius: "18px",
    boxShadow: "0 10px 35px rgba(31, 41, 55, 0.06)",
    boxSizing: "border-box",
  },
  spinner: {
    width: "32px",
    height: "32px",
    margin: "0 auto 18px",
    border: "3px solid #e0e7ff",
    borderTop: "3px solid #4f46e5",
    borderRadius: "50%",
  },
  loadingTitle: {
    fontSize: "19px",
    margin: "0 0 10px",
    color: "#172033",
  },
  emptyState: {
    padding: "35px 15px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "36px",
    marginBottom: "12px",
  },
  emptyTitle: {
    color: "#172033",
    fontSize: "17px",
    margin: "0 0 8px",
  },
  centerText: {
    textAlign: "center",
    padding: "12px 10px",
    color: "#778196",
    fontSize: "14px",
    margin: 0,
  },
  footer: {
    textAlign: "center",
    padding: "12px 0 5px",
    color: "#98a1b2",
    fontSize: "12px",
  },
};

export default AdminProducts;
