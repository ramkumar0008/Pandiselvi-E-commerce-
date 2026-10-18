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

        <Route path="/admin" element={<Admin />} />
        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />
        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />
        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

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