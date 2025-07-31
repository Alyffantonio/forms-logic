import minhaFoto from "../assets/baixados.png";
import {FaGithub, FaLinkedin} from "react-icons/fa";

export default function Header() {
    const handleGithubClick = () => {
        window.open("https://github.com/Alyffantonio", "_blank");
    };
    const handleLinkedinClick = () => {
        window.open("https://www.linkedin.com/in/alyff-antonio/", "_blank");
    };

    return (
        <header className="h-16 w-full flex items-center justify-end px-5 bg-gray-800">
            <div className="flex items-center space-x-4 text-white">

                {/* Botão LinkedIn */}
                <button
                    onClick={handleLinkedinClick}
                    className="flex items-center justify-center text-white bg-[#0A66C2]
                    hover:bg-[#0A66C2]/90 focus:outline-none font-medium
                    rounded-lg text-sm px-4 py-2.5 dark:hover:bg-[#004182]/30"
                >
                    <FaLinkedin className="w-5 h-5"/>
                </button>


                {/* Botão GitHub */}
                <button
                    onClick={handleGithubClick}
                    className="flex items-center justify-center text-white bg-[#24292F]
                    hover:bg-[#24292F]/90 focus:outline-none font-medium
                    rounded-lg text-sm px-4 py-2.5 dark:hover:bg-[#050708]/30"
                >
                    <FaGithub className="w-5 h-5"/>
                </button>


                {/* Nome e cargo */}
                <div className="flex flex-col items-end">
                    <div className="text-md font-medium">Alyff Antonio</div>
                    <div className="text-sm font-regular">Desenvolvedor</div>
                </div>

                {/* Avatar */}
                <img
                    src={minhaFoto}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full cursor-pointer border-2 border-blue-400"
                />
            </div>
        </header>
    );
}
