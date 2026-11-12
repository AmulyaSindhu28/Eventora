import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import EventRegistrations from "./pages/EventRegistrations";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Home />} />
        <Route
  path="/organizer/events/edit/:id"
  element={<EditEvent />}
/>

<Route
  path="/organizer/events/:id/registrations"
  element={<EventRegistrations />}
/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
  path="/organizer/events/create"
  element={<CreateEvent />}
/>
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;