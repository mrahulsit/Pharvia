import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";

const Medicine = lazy(() => import("@/pages/Medicine"));
const Healthcare = lazy(() => import("@/pages/Healthcare"));
const Category = lazy(() => import("@/pages/Category"));
const Cart = lazy(() => import("@/pages/Cart"));
const Auth = lazy(() => import("@/pages/Auth"));
const Plus = lazy(() => import("@/pages/Plus"));
const Offers = lazy(() => import("@/pages/Offers"));
const UploadPrescription = lazy(() => import("@/pages/UploadPrescription"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="medicine" element={<Medicine />} />
                <Route path="healthcare" element={<Healthcare />} />
                <Route path="category/:slug" element={<Category />} />
                <Route path="cart" element={<Cart />} />
                <Route path="login" element={<Auth mode="login" />} />
                <Route path="signup" element={<Auth mode="signup" />} />
                <Route path="plus" element={<Plus />} />
                <Route path="offers" element={<Offers />} />
                <Route path="upload-prescription" element={<UploadPrescription />} />

                {/* Old URLs from the previous version of the site */}
                <Route path="musthave" element={<Navigate to="/category/musthave" replace />} />
                <Route path="fitness" element={<Navigate to="/category/fitness" replace />} />
                <Route path="women-baby" element={<Navigate to="/category/mother-baby" replace />} />
                <Route path="women&baby" element={<Navigate to="/category/mother-baby" replace />} />
                <Route path="member" element={<Navigate to="/plus" replace />} />
                <Route path="medicines" element={<Navigate to="/medicine" replace />} />

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster position="top-center" richColors closeButton />
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
