import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

type MainLayoutProps = {
    children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
    const location = useLocation();

    const navLinks = [
        { path: "/", label: "Inicio" },
        { path: "/actions", label: "Actiones" },
    ];

    return (
        <div className="flex flex-col h-dvh overflow-hidden bg-gray-100 text-gray-800">
            <header className="bg-white shadow sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-blue-600">Fondo Voluntario de Pensión (FPV)</h1>
                    <nav className="flex gap-6">
                        {navLinks.map((link) => (
                            <h3 key={link.path} className="text-xl font-bold text-blue-600">
                                <Link
                                    to={link.path}
                                    className={`text-sm font-medium transition ${location.pathname === link.path
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-blue-500"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </h3>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="flex-1 min-h-0 max-w-7xl mx-auto w-full px-6 overflow-hidden">
                {children}
            </main>

            <footer className="bg-white shadow sticky bottom-0 z-20">
                <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500 text-center">
                    &copy;<strong> {new Date().getFullYear()} Fondo Voluntario de Pensión (FPV). Todos los derechos reservados.</strong>
                </div>
            </footer>
        </div>
    );
}
