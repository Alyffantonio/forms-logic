import Sidebar from "../../components/layout/Sidebar.jsx";
import Navbar from "../../components/layout/Navbar.jsx";

export default function Home({children, setActivePage}) {
    return (
        <div className="h-screen w-full bg-white flex overflow-hidden">
            <Sidebar setActivePage={setActivePage}/>
            <div className="w-full h-full flex flex-col justify-between">
                <Navbar/>
                <main className="max-w-full h-full flex relative overflow-y-hidden">
                    <div className="h-full w-full p-4 overflow-y-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
