import React from "react";
import  { createRoot } from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
import "./styles/global.css";
import { UserProvider } from "./context/UserContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
