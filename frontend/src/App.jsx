import {useState} from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import Forms from "./pages/Forms";

export default function App() {
    const [activePage, setActivePage] = useState("home");

    return (
        <DashboardLayout setActivePage={setActivePage}>
            <div className={activePage === "perfil" ? "block" : "hidden"}>
                Perfil do usuário
            </div>
            <div className={activePage === "formularios" ? "block" : "hidden"}>
                <Forms/>
            </div>
            <div className={activePage === "tema" ? "block" : "hidden"}>
                Escolha de Tema
            </div>
            <div className={activePage === "configuracoes" ? "block" : "hidden"}>
                Configurações do sistema
            </div>
        </DashboardLayout>
    );
}
