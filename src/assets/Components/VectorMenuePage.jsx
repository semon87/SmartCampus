import React from "react";
import { useAuth } from "./AuthContext";
import VendorMenuManager from "./VendorMenuManager";

export default function VendorMenuPage() {
  const { userId, userType, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <div>Please login to access vendor features.</div>;
  }

  if (userType !== "Vendor") {
    return <div>Access denied. Only vendors can manage menu items.</div>;
  }

  // Pass the userId as vendorId prop to your menu manager
  return <VendorMenuManager vendorId={userId} />;
}
