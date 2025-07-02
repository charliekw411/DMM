// src/components/pages/AppPages.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "../context/appContext";
import Navbar from "../layout/Navbar";
import ProjectTab from "../tabs/project";
import ModulesTab from "../tabs/modules";
import ArchitectureDiagramTab from "../tabs/architectureDiagram";
import PatternsTab from "../tabs/patterns";

const AppPages: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Navbar />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/project" replace />} />
            <Route path="/project" element={<ProjectTab />} />
            <Route path="/diagram" element={<ArchitectureDiagramTab />} />
            <Route path="/modules" element={<ModulesTab />} />
            <Route path="/patterns" element={<PatternsTab />} />
          </Routes>
        </main>
      </Router>
    </AppProvider>
  );
};

export default AppPages;
