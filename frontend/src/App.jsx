import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";

import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Pages */}
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/account" element={<Account />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<Admin />} />

        {/* Admin Product Management */}
        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />

        {/* Admin Order Management */}
        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />

        {/* Admin Customer Management */}
        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        {/* Fallback for unknown URLs */}
        <Route
          path="*"
          element={
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <h1>404 - Page Not Found</h1>
              <a href="/">Return to Home</a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
