import CheckBox from './campos/CheckBox.jsx';
import Condicional from "./campos/Condicionais.jsx";
import Validacao from "./campos/Validacao.jsx";
import CamposFixos from "./campos/CamposFixos.jsx";
import FormularioPreview from './visualizar/FormularioPreview.jsx';
import Formula from "./campos/formula/Formula.jsx";
import Opcoes from "./campos/opcoes/Opcoes.jsx"

import React, {useState, useEffect} from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Modal({onClose, dadosIniciais}) {
    const [formState, setFormState] = useState({
        nome: '',
        descricao: '',
        campos: [],
    });

    const [construtorCondicao, setConstrutorCondicao] = useState({});

    useEffect(() => {
        if (dadosIniciais) {
            setFormState(dadosIniciais);
        }

    }, []);


    function adicionarCampo() {
        const novoCampo = {
            temp_id: `campo_${Date.now()}`,
            id: '',
            label: '',
            tipo: 'text',
            formula: '',
            obrigatorio: false,
            capitalizar: false,
            multilinha: false,
            validacoes: [],
            condicional: "",
            dependencias: [],
        };
        setFormState(prev => ({...prev, campos: [...prev.campos, novoCampo]}));
    }

    function alterarCampo(index, event) {
        const {name, value, type, checked} = event.target;
        const camposAtualizados = [...formState.campos];
        camposAtualizados[index][name] = type === 'checkbox' ? checked : value;
        setFormState(prev => ({
            ...prev,
            campos: camposAtualizados,
        }));
    }

    function removerCampo(index) {
        setFormState(prev => ({
            ...prev,
            campos: prev.campos.filter((_, i) => i !== index),
        }));
    }


    /** ==================== CONDICIONAIS ==================== **/
    function limparCondicional(campoIndex) {
        const camposAtualizados = [...formState.campos];
        camposAtualizados[campoIndex].condicional = '';
        setFormState(prev => ({...prev, campos: camposAtualizados}));
    }

    function atualizarConstrutor(targetIndex, parte, valor) {
        setConstrutorCondicao(prevState => ({
            ...prevState,
            [targetIndex]: {
                ...prevState[targetIndex],
                [parte]: valor
            }
        }));
    }

    function inserirCondicao(targetIndex) {
        const condicao = construtorCondicao[targetIndex];
        if (!condicao || !condicao.campo || !condicao.operador || !condicao.valor) {
            alert("Por favor, preencha todas as partes da condição.");
            return;
        }

        let valorFormatado = condicao.valor;
        if (isNaN(valorFormatado) && valorFormatado !== 'true' && valorFormatado !== 'false') {
            valorFormatado = `'${valorFormatado}'`;
        }

        const novaRegra = `${condicao.campo} ${condicao.operador} ${valorFormatado}`;
        const camposAtualizados = [...formState.campos];
        const condicionalAtual = camposAtualizados[targetIndex].condicional || '';
        camposAtualizados[targetIndex].condicional = (condicionalAtual ? condicionalAtual + ' && ' : '') + novaRegra;
        setFormState(prev => ({...prev, campos: camposAtualizados}));

        setConstrutorCondicao(prevState => ({
            ...prevState,
            [targetIndex]: {}
        }));
    }

    /** ==================== VALIDAÇÕES ==================== **/
    function adicionarValidacao(campoIndex) {
        const camposAtualizados = [...formState.campos];
        camposAtualizados[campoIndex].validacoes = camposAtualizados[campoIndex].validacoes || [];
        camposAtualizados[campoIndex].validacoes.push({
            tipo: "",
        });
        setFormState(prev => ({...prev, campos: camposAtualizados}));
    }

    function removerValidacao(campoIndex, validacaoIndex) {
        const camposAtualizados = [...formState.campos];
        camposAtualizados[campoIndex].validacoes.splice(validacaoIndex, 1);
        setFormState(prev => ({...prev, campos: camposAtualizados}));
    }

    function alterarValidacao(campoIndex, validacaoIndex, event) {
        const {name, value} = event.target;
        const camposAtualizados = [...formState.campos];
        camposAtualizados[campoIndex].validacoes[validacaoIndex][name] = value;
        setFormState(prev => ({...prev, campos: camposAtualizados}));
    }

    /** ==================== campos ==================== **/
    function atualizarCampo(event) {
        const {name, value} = event.target;
        setFormState(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    async function enviarFormulario(event) {
    event.preventDefault();
    const formStateLimpo = JSON.parse(JSON.stringify(formState));

    formStateLimpo.campos.forEach(campo => {
        delete campo.temp_id;
        if (campo.validacoes) {
            campo.validacoes.forEach(validacao => {
                delete validacao.id;
            });
        }
        if (campo.opcoes) {
            campo.opcoes.forEach(opcao => {
                delete opcao.id;
                if ('valor' in opcao) {
                    opcao.value = opcao.valor;
                    delete opcao.valor;
                }
            });
        }
    });

    const isEditing = formState.id;

    const idNumerico = isEditing ? parseInt(formState.id.replace('formulario_', ''), 10) : null;

    const endpoint = isEditing
        ? `${apiUrl}/api/v1/formularios/update/${idNumerico}/`
        : `${apiUrl}/api/v1/formularios/save/`;

    const method = isEditing ? 'PUT' : 'POST';

    console.log(`Enviando para a API (${method}):`, JSON.stringify(formStateLimpo, null, 2));

    try {
        const response = await fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formStateLimpo)
        });
        const result = await response.json();

        if (response.ok) {
            const successMessage = isEditing
                ? `Formulário atualizado com sucesso! Nova versão: ${result.schema_version}`
                : `Formulário criado! ID: ${result.id}`;

            console.log(successMessage, result);
            alert(successMessage);
            onClose();
        } else {
            console.error('Erro de validação ou do servidor:', result);
            alert(`Erro: ${JSON.stringify(result)}`);
        }
    } catch (error) {
        console.error('Falha na conexão com a API:', error);
        alert('Não foi possível conectar ao servidor.');
    }
}

    /** ==================== opções ==================== **/
    function adicionarOpcao(campoIndex) {
        const camposAtualizados = [...formState.campos];
        camposAtualizados[campoIndex].opcoes = camposAtualizados[campoIndex].opcoes || [];
        camposAtualizados[campoIndex].opcoes.push({
            label: "",
            value: ""
        });
        setFormState(prev => ({...prev, campos: camposAtualizados}));
    }

    function removerOpcao(campoIndex, opcaoIndex) {
        const camposAtualizados = [...formState.campos];
        camposAtualizados[campoIndex].opcoes.splice(opcaoIndex, 1);
        setFormState(prev => ({...prev, campos: camposAtualizados}));
    }

    function alterarOpcao(campoIndex, opcaoIndex, event) {
        const {name, value} = event.target;
        const camposAtualizados = [...formState.campos];
        camposAtualizados[campoIndex].opcoes[opcaoIndex][name] = value;
        setFormState(prev => ({...prev, campos: camposAtualizados}));
    }

    /** ==================== dependencia ==================== **/
    function adicionarDependencia(campoIndex) {
        const camposAtualizados = [...formState.campos];
        if (!camposAtualizados[campoIndex].dependencias) {
            camposAtualizados[campoIndex].dependencias = [];
        }
        camposAtualizados[campoIndex].dependencias.push("");
        setFormState(prev => ({...prev, campos: camposAtualizados}));
    }

    function removerDependencia(campoIndex, dependenciaIndex) {
        const camposAtualizados = [...formState.campos]
        camposAtualizados[campoIndex].dependencias.splice(dependenciaIndex, 1)
        setFormState(prev => ({...prev, campos: camposAtualizados}));
    }

    function alterarDependencia(campoIndex, dependenciaIndex, event) {
        const {value} = event.target
        const camposAtualizados = [...formState.campos]
        camposAtualizados[campoIndex].dependencias[dependenciaIndex] = value;
        setFormState(prev => ({...prev, campos: camposAtualizados}))
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-[1200px] h-[800px] flex overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>

                <div className="w-full lg:w-1/2 flex bg-white">
                    <div className="w-full h-full flex flex-col">
                        <div className="flex-grow p-8 overflow-y-auto">
                            <h1 className="text-2xl font-semibold mb-2 text-black text-center">Novo Formulário</h1>
                            <p className="text-sm mb-6 text-gray-500 text-center">Preencha os dados abaixo para criar um
                                novo formulário.</p>

                            <form id="meuFormulario" onSubmit={enviarFormulario} className="space-y-4">
                                <div>
                                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do
                                        Formulário</label>
                                    <input type="text" id="nome" name="nome" value={formState.nome}
                                           onChange={atualizarCampo} className="mt-1 p-2 w-full border rounded-md"
                                           required/>
                                </div>
                                <div>
                                    <label htmlFor="descricao"
                                           className="block text-sm font-medium text-gray-700">Descrição</label>
                                    <textarea id="descricao" name="descricao" value={formState.descricao}
                                              onChange={atualizarCampo} rows="3"
                                              className="mt-1 p-2 w-full border rounded-md"/>
                                </div>
                                <hr/>

                                <div>
                                    <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">Campos</h3>
                                    <div className="space-y-4">
                                        {formState.campos.map((campo, index) => (
                                            <div key={campo.temp_id}
                                                 className="p-4 border rounded-md bg-gray-50 space-y-3 relative">

                                                <button type="button" onClick={() => removerCampo(index)}
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                        title="Remover Campo">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                         viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd"
                                                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                </button>

                                                <CamposFixos
                                                    campo={campo}
                                                    index={index}
                                                    alterarCampo={alterarCampo}
                                                />

                                                <CheckBox campo={campo} index={index} alterarCampo={alterarCampo}/>

                                                {campo.tipo === 'calculated' && <Formula
                                                    campo={campo}
                                                    index={index}
                                                    alterarCampo={alterarCampo}
                                                    camposDisponiveis={formState.campos.filter((c, i) => i !== index && c.id)}
                                                    adicionarDependencia={adicionarDependencia}
                                                    removerDependencia={removerDependencia}
                                                    alterarDependencia={alterarDependencia}
                                                />}

                                                {campo.tipo === 'select' && <Opcoes
                                                    campo={campo}
                                                    index={index}
                                                    adicionarOpcao={adicionarOpcao}
                                                    alterarOpcao={alterarOpcao}
                                                    removerOpcao={removerOpcao}
                                                />}

                                                <Condicional
                                                    campo={campo}
                                                    index={index}
                                                    camposDisponiveis={formState.campos.filter((c, i) => i !== index && c.id)}
                                                    construtorCondicao={construtorCondicao}
                                                    atualizarConstrutor={atualizarConstrutor}
                                                    inserirCondicao={inserirCondicao}
                                                    limparCondicional={limparCondicional}
                                                />

                                                <Validacao
                                                    campo={campo}
                                                    index={index}
                                                    adicionarValidacao={adicionarValidacao}
                                                    alterarValidacao={alterarValidacao}
                                                    removerValidacao={removerValidacao}
                                                />

                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex justify-center p-4 border-2 border-dashed rounded-md">
                                        <button type="button" onClick={adicionarCampo}
                                                className="bg-blue-500 text-white font-semibold p-2 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                 viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd"
                                                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="flex justify-end gap-4 p-4 border-t border-gray-200">
                            <button type="button" onClick={onClose}
                                    className="w-auto bg-gray-200 text-gray-800 p-2 px-4 rounded-md hover:bg-gray-300">
                                Cancelar
                            </button>
                            <button type="submit" form="meuFormulario"
                                    className="w-auto bg-black text-white p-2 px-4 rounded-md hover:bg-gray-800">
                                Salvar Formulário
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className="hidden lg:flex flex-col items-center justify-start flex-1 bg-gray-50 text-black p-8 overflow-y-auto">
                    <div className="text-center w-full">
                        <h1 className="text-2xl font-semibold mb-2 text-black text-center">
                            {formState.nome || "Nome do formulário"}
                        </h1>
                        <p className="text-sm mb-6 text-gray-500 text-center">
                            {formState.descricao || "Descrição do formulário aqui"}
                        </p>
                    </div>
                    <FormularioPreview campos={formState.campos}/>
                </div>
            </div>
        </div>
    );
}
