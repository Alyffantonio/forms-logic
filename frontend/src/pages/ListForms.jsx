import {useEffect, useState} from "react";
import ModalForms from "./modal_forms/ModalForms";

// npm install @fontsource/inter
export default function ListForms() {
    const [formularios, setFormularios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/api/formularios")
            .then((res) => res.json())
            .then((data) => {
                setFormularios(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erro ao buscar formulários:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg w-full h-[850px]">

            <div className="flex items-center justify-between px-1 mb-4">
                <h1 className="font-sans text-2xl font-bold text-gray-800">
                    Lista de Formulários
                </h1>
                <button type="button" onClick={() => setIsModalOpen(true)} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700  dark:border-gray-700">
                    Novo Formulário
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-600">Carregando...</p>
            ) : (
                <div className="relative overflow-x-auto rounded-lg ">
                    <table className="w-full text-sm text-left text-gray-300">
                        {/* Cabeçalho estilo cinza escuro */}
                        <thead className="text-xs uppercase bg-[#334155] text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nome</th>
                            <th scope="col" className="px-6 py-3">Versão</th>
                            <th scope="col" className="px-6 py-3">Criado em</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="bg-[#1E293B]">
                        {formularios.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                                    Nenhum formulário cadastrado
                                </td>
                            </tr>
                        ) : (
                            formularios.map((form) => (
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
                                        <a
                                            href={`/formularios/${form.id}`}
                                            className="font-medium text-blue-400 hover:underline"
                                        >
                                            Ver Detalhes
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}
            {isModalOpen && <ModalForms onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}
