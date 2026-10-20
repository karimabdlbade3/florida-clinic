import { NavLink, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { BRANCH_NAME, CLINIC_NAME } from "./config";
import Dashboard from "./admin/Dashboard";
import RegisterPatient from "./admin/RegisterPatient";
import Patients from "./admin/Patients";
import PatientDetail from "./admin/PatientDetail";
import DailyReport from "./admin/DailyReport";
import SiteLayout from "./site/Layout";
import Home from "./site/pages/Home";
import About from "./site/pages/About";
import Services from "./site/pages/Services";
import Team from "./site/pages/Team";
import BeforeAfter from "./site/pages/BeforeAfter";
import Reviews from "./site/pages/Reviews";
import Contact from "./site/pages/Contact";
import Book from "./site/pages/Book";

function AdminLayout() {
  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">
          <strong>{CLINIC_NAME}</strong>
          <span className="muted">{BRANCH_NAME}</span>
        </div>
        <nav>
          <NavLink to="/admin" end>الرئيسية</NavLink>
          <NavLink to="/admin/register">تسجيل مريض</NavLink>
          <NavLink to="/admin/patients">المرضى</NavLink>
          <NavLink to="/admin/report">تقرير اليوم</NavLink>
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/team" element={<Team />} />
        <Route path="/before-after" element={<BeforeAfter />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book" element={<Book />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="register" element={<RegisterPatient />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="report" element={<DailyReport />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
