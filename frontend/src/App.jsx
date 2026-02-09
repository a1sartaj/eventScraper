import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import LoginSuccess from "./pages/LoginSuccess";
import PrivateRoute from "./utils/PrivateRoutes";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-success" element={<LoginSuccess />} />

        <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
