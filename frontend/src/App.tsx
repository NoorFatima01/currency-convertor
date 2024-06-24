import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Layout from "./layouts/layout";
import ConversionPage from "./pages/conversion-page";
import HistoryPage from "./pages/my-history";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";
import { ToastContainer } from 'react-toastify';

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <ConversionPage/>
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Signup />
            </Layout>
          }
        />
                <Route
          path="/my-history"
          element={
            <Layout>
              <HistoryPage />
            </Layout>
          }
        />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
