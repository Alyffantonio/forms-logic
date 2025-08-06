import {useEffect, useState} from "react";
import Modal from "../../components/forms/Modal.jsx";

export default function Lista() {
    const [formularios, setFormularios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [dadosFormulario, setDadosFormulario] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/v1/formularios/")
            .then((res) => res.json())
            .then((data) => {
                setFormularios(data.results || data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erro ao buscar formulários:", error);
                setLoading(false);
            });
    }, []);
    
    const detalhesForms = async (formId) => {
        const idNumerico = parseInt(formId.replace('formulario_', ''), 10);
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/v1/formularios/${idNumerico}/`);
            const data = await res.json();
            setDadosFormulario(data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Erro ao buscar detalhes do formulário:", error);
        }
    };

    const clickOpen = () => {
        setDadosFormulario(null);
        setIsModalOpen(true);
    };

    const clickClose = () => {
        setIsModalOpen(false);
        setDadosFormulario(null);
    };

    return (
        <div className="p-6 bg-white rounded-lg w-full h-full">

            <div className="flex items-center justify-between px-1 mb-4">
                <h1 className="font-sans text-2xl font-bold text-gray-800">
                    Lista de Formulários
                </h1>

                <button type="button" onClick={clickOpen} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700  dark:border-gray-700">
                    Novo Formulário
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-600">Carregando...</p>
            ) : (
                <div className="relative overflow-x-auto rounded-lg ">
                    <table className="w-full text-sm text-left text-gray-300">
                        <tbody className="bg-[#1E293B]">
                        {formularios.map((form) => (
                                <tr key={form.id} className="border-b border-gray-700 hover:bg-[#334155]">
                                    <td className="px-6 py-4 font-medium text-white">{form.nome}</td>
                                    <td className="px-6 py-4">{form.schema_version}</td>
                                    <td className="px-6 py-4">
                                        {new Date(form.criado_em).toLocaleDateString()}
                                    </td>
                                    <td className={`px-6 py-4 ${form.ativo ? "text-green-400" : "text-red-400"}`}>
                                        {form.ativo ? "Ativo" : "Inativo"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {/* A tag <a> foi trocada por <button> */}
                                        <button
                                            onClick={() => detalhesForms(form.id)}
                                            className="font-medium text-blue-400 hover:underline"
                                        >
                                            Ver Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            )}
            {/* O Modal agora recebe os dados do formulário como uma prop */}
            {isModalOpen && <Modal onClose={clickClose} dadosIniciais={dadosFormulario} />}
        </div>
    );
}