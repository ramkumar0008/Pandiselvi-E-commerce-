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
    ...new Set(products.map((product) => product.category).filter(Boolean)),
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
      setError("Stock must be a whole number greater than or equal to zero.");
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
          Checking authentication...
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
            <h1 style={styles.heading}>Admin Login Required</h1>
            <p style={styles.muted}>
              Please log in with your authorized admin account to
              manage products.
            </p>
            <Link to="/login" style={styles.primaryLink}>
              Go to Login
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
        <div style={styles.topBar}>
          <div>
            <p style={styles.eyebrow}>SHOPZONE ADMIN PANEL</p>
            <h1 style={styles.heading}>Product Management</h1>
            <p style={styles.muted}>
              Add, update and manage your store products.
            </p>
          </div>

          <Link to="/admin" style={styles.secondaryLink}>
            ← Admin Dashboard
          </Link>
        </div>

        {error && (
          <div role="alert" style={styles.error}>
            {error}
          </div>
        )}

        {message && (
          <div role="status" style={styles.success}>
            {message}
          </div>
        )}

        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <div>
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
                Cancel Edit
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
                />
                Mark as featured product
              </label>
            </div>

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
                  ? "Save Changes"
                  : "Add Product"}
            </button>
          </form>
        </section>

        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <div>
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
            <input
              style={styles.searchInput}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
            />

            <select
              style={styles.select}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
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
            <p style={styles.centerText}>Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p style={styles.centerText}>No products found.</p>
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
                          <div>
                            <strong>{product.name}</strong>
                            <p style={styles.descriptionPreview}>
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td style={styles.td}>{product.category}</td>

                      <td style={styles.td}>
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </td>

                      <td style={styles.td}>{product.stock}</td>

                      <td style={styles.td}>
                        {product.featured ? "⭐ Yes" : "No"}
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
      </main>
    </>
  );
}

const styles = {
  page: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "40px 5%",
    background: "#f8fafc",
    minHeight: "90vh",
    fontFamily: "Poppins, Arial, sans-serif",
    color: "#111827",
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
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: "#64748b",
    marginBottom: "8px",
  },
  heading: {
    fontSize: "clamp(27px, 4vw, 36px)",
    fontWeight: 800,
    margin: "0 0 8px",
  },
  sectionTitle: {
    fontSize: "21px",
    fontWeight: 750,
    margin: "0 0 6px",
  },
  muted: {
    color: "#64748b",
    fontSize: "14px",
    margin: "0",
    lineHeight: 1.6,
  },
  card: {
    background: "#ffffff",
    padding: "25px",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    marginBottom: "25px",
    boxShadow: "0 5px 20px rgba(15, 23, 42, 0.04)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "20px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "13px",
    fontWeight: 650,
    color: "#374151",
  },
  labelFull: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "13px",
    fontWeight: 650,
    color: "#374151",
    gridColumn: "1 / -1",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    fontSize: "14px",
    outlineColor: "#4f46e5",
    background: "#fff",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
    outlineColor: "#4f46e5",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  },
  primaryButton: {
    marginTop: "24px",
    border: "none",
    borderRadius: "9px",
    background: "#111827",
    color: "#fff",
    padding: "13px 24px",
    fontSize: "14px",
    fontWeight: 700,
  },
  primaryLink: {
    display: "inline-block",
    textDecoration: "none",
    background: "#111827",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "9px",
    fontWeight: 600,
    marginTop: "15px",
  },
  secondaryLink: {
    textDecoration: "none",
    color: "#111827",
    border: "1px solid #d1d5db",
    background: "#fff",
    padding: "11px 16px",
    borderRadius: "9px",
    fontWeight: 600,
    fontSize: "13px",
  },
  cancelButton: {
    background: "#fff",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "10px 13px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },
  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "14px 16px",
    borderRadius: "9px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  success: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#166534",
    padding: "14px 16px",
    borderRadius: "9px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  filters: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  searchInput: {
    flex: "1 1 240px",
    minWidth: "0",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    fontSize: "14px",
  },
  select: {
    flex: "0 1 220px",
    minWidth: "0",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    background: "#fff",
    fontSize: "14px",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "13px",
  },
  th: {
    padding: "14px 12px",
    background: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
    color: "#475569",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  td: {
    padding: "14px 12px",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  },
  productCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "220px",
  },
  thumbnail: {
    width: "55px",
    height: "55px",
    flexShrink: 0,
    objectFit: "contain",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  },
  descriptionPreview: {
    maxWidth: "260px",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.5,
    margin: "5px 0 0",
  },
  actions: {
    display: "flex",
    gap: "7px",
    flexWrap: "wrap",
  },
  editButton: {
    border: "none",
    borderRadius: "7px",
    padding: "8px 11px",
    background: "#e0e7ff",
    color: "#3730a3",
    cursor: "pointer",
    fontWeight: 650,
  },
  deleteButton: {
    border: "none",
    borderRadius: "7px",
    padding: "8px 11px",
    background: "#fee2e2",
    color: "#b91c1c",
    cursor: "pointer",
    fontWeight: 650,
  },
  center: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "25px",
    fontFamily: "Poppins, Arial, sans-serif",
    background: "#f8fafc",
  },
  accessCard: {
    width: "100%",
    maxWidth: "420px",
    padding: "35px",
    borderRadius: "16px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    textAlign: "center",
  },
  lockIcon: {
    fontSize: "42px",
    marginBottom: "15px",
  },
  centerText: {
    textAlign: "center",
    padding: "30px 10px",
    color: "#64748b",
    fontSize: "14px",
  },
};

export default AdminProducts;