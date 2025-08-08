import {useEffect, useState} from "react";
import Modal from "../../components/forms/Modal.jsx";
import RespostaModal from "../../components/forms/respostas/RespostaModal.jsx";
import {FaEdit, FaTrash, FaWpforms} from "react-icons/fa";
import {useAuth} from "../../context/AuthContext.jsx";
import {toast} from "react-toastify";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Lista() {
    const {requireAuth} = useAuth();

    const [formularios, setFormularios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dadosFormulario, setDadosFormulario] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [isRespostaModalOpen, setIsRespostaModalOpen] = useState(false);
    const [formParaResponder, setFormParaResponder] = useState(null);

    const [filtros, setFiltros] = useState({
        nome: '',
        schema_version: '',
        data_criacao: '',
    });
    const [ordenacao, setOrdenacao] = useState({
        ordenar_por: 'data_criacao',
        ordem: 'desc'
    });

    useEffect(() => {
        setLoading(true);

        const params = new URLSearchParams({
            pagina: paginaAtual,
            tamanho_pagina: 10,
            ordenar_por: ordenacao.ordenar_por,
            ordem: ordenacao.ordem
        });

        if (filtros.nome) params.append('nome', filtros.nome);
        if (filtros.schema_version) params.append('schema_version', filtros.schema_version);
        if (filtros.data_criacao) params.append('data_criacao', filtros.data_criacao);


        fetch(`${apiUrl}/api/v1/formularios/?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setFormularios(data.results || []);
                if (data.count) {
                    const itensPorPagina = 10;
                    setTotalPaginas(Math.ceil(data.count / itensPorPagina));
                } else {
                    setTotalPaginas(0);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erro ao buscar formulários:", error);
                setLoading(false);
            });
    }, [paginaAtual, filtros, ordenacao])


    const detalhesForms = async (form) => {
        requireAuth(async () => {
            const idNumerico = parseInt(form.id.replace('formulario_', ''), 10);
            const versao = form.schema_version;

            try {
                // CORRIGIDO: Removido o excesso na URL
                const response = await fetch(`${apiUrl}/api/v1/formularios/${idNumerico}/versao/${versao}/`);
                const data = await response.json();
                setDadosFormulario(data);
                setIsModalOpen(true);
            } catch (error) {
                console.error("Erro ao buscar detalhes do formulário:", error);
            }
        })
    };

    const deletarForm = async (formId) => {
        requireAuth(async () => {
            const idNumerico = parseInt(formId.replace('formulario_', ''), 10);

            if (!confirm(`Tem certeza que deseja deletar o formulário "${formId}"?`)) {
                return;
            }
            const token = localStorage.getItem('authToken');

            try {
                const response = await fetch(`${apiUrl}/api/v1/formularios/delete/${idNumerico}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                });
                if (response.ok) {
                    toast.success("Formulário deletado com sucesso!");
                    setFormularios(formularios.filter(form => form.id !== formId));
                } else {
                    console.error("Falha ao deletar o formulário. Status:", response.status);
                    toast.error("Não foi possível deletar o formulário.");
                }
            } catch (error) {
                console.error("Erro ao desativar formulário:", error);
                toast.error("Ocorreu um erro de conexão ao tentar deletar.");
            }
        });
    };

    const clickOpen = () => {
        requireAuth(() => {
            setDadosFormulario(null);
            setIsModalOpen(true);
        });
    };

    const clickClose = () => {
        setIsModalOpen(false);
        setDadosFormulario(null);
    };

    const pageChange = (novaPagina) => {
        requireAuth(async () => {
            if (novaPagina > 0 && novaPagina <= totalPaginas) {
                setPaginaAtual(novaPagina);
            }
        });
    };

    const filtroChange = (e) => {
        requireAuth(async () => {
            const {name, value} = e.target;
            setFiltros(prev => ({...prev, [name]: value}));
            setPaginaAtual(1);
        });
    };

    const ordenacaoChange = (e) => {
        requireAuth(async () => {
            const {name, value} = e.target;
            setOrdenacao(prev => ({...prev, [name]: value}));
            setPaginaAtual(1);
        });
    };

    const limparFiltros = () => {
        requireAuth(async () => {
            setFiltros({nome: '', schema_version: '', data_criacao: '',});
            setOrdenacao({ordenar_por: 'data_criacao', ordem: 'desc'});
            setPaginaAtual(1);
        });
    };

    const abrirModalResposta = (form) => {
        requireAuth(async () => {
            setFormParaResponder(form);
            setIsRespostaModalOpen(true);
        });
    };

    const fecharModalResposta = () => {
        setFormParaResponder(null);
        setIsRespostaModalOpen(false);
    };
    return (
        <div className="p-6 bg-white rounded-lg w-full h-full flex flex-col">
            <div className="flex items-center justify-between px-1 mb-4">
                <h1 className="font-sans text-2xl font-bold text-gray-800">
                    Lista de Formulários
                </h1>
                <button
                    type="button"
                    onClick={clickOpen}
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    Novo Formulário
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 p-4 border rounded-lg bg-gray-50 items-end">
                <div className="md:col-span-2">
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Filtrar por nome</label>
                    <input type="text" name="nome" id="nome"
                           className="mt-1 p-2 w-full border rounded-md"
                           value={filtros.nome}
                           onChange={filtroChange}/>
                </div>
                <div>
                    <label htmlFor="data_criacao" className="block text-sm font-medium text-gray-700">Criado em</label>
                    <input
                        type="date"
                        name="data_criacao"
                        id="data_criacao"
                        className="mt-1 p-2 w-full border rounded-md"
                        value={filtros.data_criacao}
                        onChange={filtroChange}
                    />
                </div>
                <div>
                    <label htmlFor="ordenar_por" className="block text-sm font-medium text-gray-700">Ordenar por</label>
                    <select name="ordenar_por" id="ordenar_por"
                            className="mt-1 p-2 w-full border rounded-md"
                            value={ordenacao.ordenar_por}
                            onChange={ordenacaoChange}>
                        <option value="data_criacao">Data de Criação</option>
                        <option value="nome">Nome</option>
                    </select>
                </div>
                <div>
                    <button onClick={limparFiltros}
                            className="p-2 w-full bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                        Limpar Filtros
                    </button>
                </div>
            </div>
            {loading ? (
                <p className="text-center text-gray-600 flex-grow">Carregando...</p>
            ) : (
                <div className="relative overflow-x-auto rounded-lg flex-grow">
                    <table className="w-full text-sm text-left text-gray-300">
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
                        {formularios.map((form) => (
                            <tr key={form.id} className="border-b border-gray-700 hover:bg-[#334155]">
                                <td className="px-6 py-4 font-medium text-white">{form.nome}</td>
                                <td className="px-6 py-4">{form.schema_version}</td>
                                <td className="px-6 py-4">
                                    {new Date(form.criado_em).toLocaleDateString()}
                                </td>
                                <td className={`px-6 py-4 ${form.is_ativo ? "text-green-400" : "text-red-400"}`}>
                                    {form.is_ativo ? "Ativo" : "Inativo"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end items-center space-x-2">
                                        <button
                                            onClick={() => abrirModalResposta(form)}
                                            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                            title="Responder Formulário"
                                        >
                                            <FaWpforms/>
                                        </button>
                                        <button
                                            onClick={() => detalhesForms(form)}
                                            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                            title="Editar Formulário"
                                        >
                                            <FaEdit/>
                                        </button>
                                        <button
                                            onClick={() => deletarForm(form.id)}
                                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                            title="Deletar Formulário"
                                        >
                                            <FaTrash/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && totalPaginas > 1 && (
                <div className="flex justify-end items-center mt-4 p-2">
                    <button
                        onClick={() => pageChange(paginaAtual - 1)}
                        disabled={paginaAtual === 1}
                        className="px-3 py-1 text-sm font-medium text-gray-400 bg-[#334155] rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                    >
                        Anterior
                    </button>

                    <span className="px-4 py-1 text-sm text-gray-300 bg-[#1E293B]">
                    Página {paginaAtual} de {totalPaginas}
                </span>

                    <button
                        onClick={() => pageChange(paginaAtual + 1)}
                        disabled={paginaAtual === totalPaginas}
                        className="px-3 py-1 text-sm font-medium text-gray-400 bg-[#334155] rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                    >
                        Próxima
                    </button>
                </div>
            )}

            {isModalOpen && <Modal onClose={clickClose} dadosIniciais={dadosFormulario}/>}
            {isRespostaModalOpen &&
                <RespostaModal formParaResponder={formParaResponder} onClose={fecharModalResposta}/>}
        </div>
    );
}
