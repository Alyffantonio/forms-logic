import minhaFoto from "../../assets/baixados.png";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext'; // 1. Importe o useAuth

export default function Header() {
    // 2. Obtenha o estado de login e a função de logout do contexto
    const { isLoggedIn, user, logout } = useAuth();

    const handleGithubClick = () => {
        window.open("https://github.com/Alyffantonio", "_blank");
    };
    const handleLinkedinClick = () => {
        window.open("https://www.linkedin.com/in/alyff-antonio/", "_blank");
    };

    return (
        <header className="h-16 w-full flex items-center justify-end px-5 bg-gray-800">
            <div className="flex items-center space-x-4 text-white">

                {isLoggedIn() && (
                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
                    >
                        Logout
                    </button>
                )}

                <button
                    onClick={handleLinkedinClick}
                    className="flex items-center justify-center text-white bg-[#0A66C2] hover:bg-[#0A66C2]/90 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5"
                >
                    <FaLinkedin className="w-5 h-5"/>
                </button>


                <button
                    onClick={handleGithubClick}
                    className="flex items-center justify-center text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5"
                >
                    <FaGithub className="w-5 h-5"/>
                </button>


                <div className="flex flex-col items-end">
                    <div className="text-md font-medium">
                        Alyff Antonio
                    </div>
                    <div className="text-sm font-regular">Desenvolvedor</div>
                </div>

                <img
                    src={minhaFoto}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full cursor-pointer border-2 border-blue-400"
                />
            </div>
        </header>
    );
}