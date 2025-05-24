import Home from "./assets/Components/Home";
import Login_page from "./assets/Components/Login_page";
import { Route, Routes } from "react-router-dom";
import New from "./assets/Components/New";
import { AuthProvider } from "./assets/Components/AuthContext";
import PrivateRoute from "./assets/Components/PrivateRoute";
import StudentRegister from "./assets/Components/StudentRegister";
import VendorRegister from "./assets/Components/VendorRegister";
import BrowseVendors from "./assets/Components/BrowseVendors";
import VendorMenuManager from "./assets/Components/VendorMenuManager";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login_page />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/vendor" element={<VendorRegister />} />

        {/* Student-only route */}
        <Route
          path="/browse-vendors"
          element={
            <PrivateRoute roles={["Student"]}>
              <BrowseVendors />
            </PrivateRoute>
          }
        />

        {/* Vendor-only route */}
        <Route
          path="/vendor-menu"
          element={
            <PrivateRoute roles={["Vendor"]}>
              <VendorMenuManager />
            </PrivateRoute>
          }
        />

        {/* You can keep your existing private route as is */}
        <Route
          path="/new"
          element={
            <PrivateRoute>
              <New />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
