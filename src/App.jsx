import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
// import Profile from "./pages/Profile";
import Profile from "./pages/Dashboards/FleetManagerDashboard";
import Layout from "./components/Layout";
import LayoutProfile from "./components/LayoutProfile";
function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        <Route path="/" element={<LayoutProfile />}>
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* Profile is rendered outside the Layout so it can take full viewport */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
