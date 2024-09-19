import React from "react";
import { useEffect } from 'react';
import {  Route, Routes, useNavigate } from "react-router-dom";
import Login from "./component/Login";
import AllUsersPage from "./component/AllUsers";
import NewUsersPage from "./component/NewUser";
import AddDesignPage from "./Pages/AddDesignPage";
import AddEvents from './Pages/AddEventsPage';
import ViewEvents from './component/ViewEvents';
import EventsList from "./Pages/EventsList";
// import Viewmore from './Pages/Viewmore';
import Forgot from './component/Forgotpass';
import VerifyOTP from './component/Verify-otp';
import ViewDesignsPage from './component/ViewDesigns';
import { setNavigate } from './Pages/Navigation';
import Resetpassword from './component/ResetPassword';
import Adddesign from './component/add_design';
function App() {

  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
   
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/EventsList" element={<EventsList />} />
        <Route path="/AddDesigns" element={<AddDesignPage />} />
        <Route path="/all-users" element={<AllUsersPage />} />
        <Route path="/new-user" element={<NewUsersPage />} />
        <Route path="/events" element={<AddEvents />} /> 
        <Route path="/forgot-pass" element={<Forgot />} /> 
        <Route path="/verify-otp" element={<VerifyOTP />} /> 
        <Route path="/reset-password" element={<Resetpassword />} /> 
        <Route path="/view-events" element={<ViewEvents />} /> 
        <Route path="/view-designs" element={<ViewDesignsPage />} /> 
        <Route path="/add-design" element={<Adddesign />} /> 
      </Routes>

  );
}

export default App;