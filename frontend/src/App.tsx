import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Layout from "./layouts/layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <>Main Page</>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
