import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { BRANCH_NAME, CLINIC_NAME } from "./config";
import Dashboard from "./pages/Dashboard";
import RegisterPatient from "./pages/RegisterPatient";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import DailyReport from "./pages/DailyReport";

export default function App() {
  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">
          <strong>{CLINIC_NAME}</strong>
          <span className="muted">{BRANCH_NAME}</span>
        </div>
        <nav>
          <NavLink to="/" end>الرئيسية</NavLink>
          <NavLink to="/register">تسجيل مريض</NavLink>
          <NavLink to="/patients">المرضى</NavLink>
          <NavLink to="/report">تقرير اليوم</NavLink>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<RegisterPatient />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/report" element={<DailyReport />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
