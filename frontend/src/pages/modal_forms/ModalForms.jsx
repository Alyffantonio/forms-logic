import React, {useState} from 'react';
import CheckBox from './settings/CheckBox.jsx';
import Condicional from "./settings/Condicionais.jsx";
import Validacao from "./settings/Validacao.jsx";

export default function ModalForms({onClose}) {
    const [formState, setFormState] = useState({
        nome: '',
        descricao: '',
        campos: [],
    });

    const [visibilidadeCondicionais, setVisibilidadeCondicionais] = useState({});

    const [construtorCondicao, setConstrutorCondicao] = useState({});

    function adicionarCampo() {
        const novoCampo = {
            temp_id: `campo_${Date.now()}`,
            id: '',
            label: '',
            tipo: 'text',
            obrigatorio: false,
            capitalizar: false,
            multilinha: false,
            condicional: '',
        };
        setFormState(prevState => ({...prevState, campos: [...prevState.campos, novoCampo]}));
    };

    function alterarCampo(index, event) {
        const {name, value, type, checked} = event.target;
        const camposAtualizados = [...formState.campos];
        camposAtualizados[index][name] = type === 'checkbox' ? checked : value;
        setFormState(prevState => ({
            ...prevState,
            campos: camposAtualizados,
        }));
    }

    function removerCampo(index) {
        setFormState(prevState => ({
            ...prevState,
            campos: prevState.campos.filter((_, i) => i !== index),
        }));
    }

    function visibilidadeCondicional(index) {
        setVisibilidadeCondicionais(prevState => ({
            ...prevState,
            [index]: !prevState[index] // Inverte o valor atual (true -> false, false -> true)
        }));
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
        if (!condicao || !condicao.campo || !condicao.operador) {
            alert("Por favor, selecione o campo, o operador e o valor.");
            return;
        }

        // Formata o valor corretamente (com aspas para strings)
        let valorFormatado = condicao.valor;
        if (isNaN(valorFormatado) && valorFormatado !== 'true' && valorFormatado !== 'false') {
            valorFormatado = `'${valorFormatado}'`;
        }

        const novaCondicaoString = `${condicao.campo} ${condicao.operador} ${valorFormatado}`;

        const camposAtualizados = [...formState.campos];
        const condicionalAtual = camposAtualizados[targetIndex].condicional || '';

        // Adiciona a nova condição, usando '&&' se já houver uma
        camposAtualizados[targetIndex].condicional = (condicionalAtual ? condicionalAtual + ' && ' : '') + novaCondicaoString;

        setFormState(prevState => ({...prevState, campos: camposAtualizados}));

        // Limpa o construtor para a próxima condição
        setConstrutorCondicao(prevState => ({
            ...prevState,
            [targetIndex]: {}
        }));
    }

    function atualizarCampo(event) {
        const {name, value} = event.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    function adicionarValidacao(campoIndex) {
        const camposAtualizados = [...formState.campos];
        if (!camposAtualizados[campoIndex].validacoes) {
            camposAtualizados[campoIndex].validacoes = [];
        }
        camposAtualizados[campoIndex].validacoes.push({tipo: '', valor: ''});
        setFormState(prevState => ({...prevState, campos: camposAtualizados}));
    }

    function removerValidacao(campoIndex, validacaoIndex) {
        const camposAtualizados = [...formState.campos];
        camposAtualizados[campoIndex].validacoes.splice(validacaoIndex, 1);
        setFormState(prevState => ({...prevState, campos: camposAtualizados}));
    }

    function alterarValidacao(campoIndex, validacaoIndex, event) {
        const {name, value} = event.target;
        const camposAtualizados = [...formState.campos];
        camposAtualizados[campoIndex].validacoes[validacaoIndex][name] = value;
        setFormState(prevState => ({...prevState, campos: camposAtualizados}));
    }

    function adicionarOpcao(campoIndex) {
        const camposAtualizados = [...formState.campos];
        if (!camposAtualizados[campoIndex].opcoes) {
            camposAtualizados[campoIndex].opcoes = [];
        }
        camposAtualizados[campoIndex].opcoes.push({label: '', value: ''});
        setFormState(prevState => ({...prevState, campos: camposAtualizados}));
    }

    function removerOpcao(campoIndex, opcaoIndex) {
        const camposAtualizados = [...formState.campos];
        camposAtualizados[campoIndex].opcoes.splice(opcaoIndex, 1);
        setFormState(prevState => ({...prevState, campos: camposAtualizados}));
    }

    function alterarOpcao(campoIndex, opcaoIndex, event) {
        const {name, value} = event.target;
        const camposAtualizados = [...formState.campos];
        camposAtualizados[campoIndex].opcoes[opcaoIndex][name] = value;
        setFormState(prevState => ({...prevState, campos: camposAtualizados}));
    }

    function enviarFormulario(event) {
        event.preventDefault();
        const finalFormState = {
            ...formState,
            campos: formState.campos.map(({...resto}) => resto)
        };
        console.log("Estado final do formulário a ser enviado:", JSON.stringify(finalFormState, null, 2));
        alert('Formulário salvo! (Verifique o console)');
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">

            <div className="relative bg-white rounded-lg shadow-xl w-[1200px] h-[800px] flex overflow-hidden">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>


                {/* Painel do Formulário */}
                <div className="w-full lg:w-1/2 flex bg-white">

                    <div className="w-full h-full flex flex-col">

                        <div className="flex-grow p-8 overflow-y-auto">
                            <h1 className="text-2xl font-semibold mb-2 text-black text-center">Novo Formulário</h1>
                            <p className="text-sm mb-6 text-gray-500 text-center">Preencha os dados abaixo para criar um
                                novo formulário.</p>

                            <form id="meuFormulario" onSubmit={enviarFormulario} className="space-y-4">
                                {/* ... (campos nome e descricao) ... */}
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
                                                {/* ... (botão remover, id, label, tipo, checkboxes) ... */}
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
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">ID do
                                                            Campo</label>
                                                        <input type="text" name="id" value={campo.id}
                                                               onChange={e => alterarCampo(index, e)}
                                                               className="mt-1 p-2 w-full border rounded-md"
                                                               placeholder="ex: nome_usuario"/>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Rótulo
                                                            (Label)</label>
                                                        <input type="text" name="label" value={campo.label}
                                                               onChange={e => alterarCampo(index, e)}
                                                               className="mt-1 p-2 w-full border rounded-md"
                                                               placeholder="ex: Nome do Usuário"/>
                                                    </div>
                                                </div>

                                                {/*tipo de campo*/}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Tipo de
                                                        Campo</label>
                                                    <select name="tipo" value={campo.tipo}
                                                            onChange={e => alterarCampo(index, e)}
                                                            className="mt-1 p-2 w-full border rounded-md bg-white">
                                                        <option value="text">Texto</option>
                                                        <option value="number">Número</option>
                                                        <option value="date">Data</option>
                                                        <option value="select">Seleção</option>
                                                        <option value="boolean">Booleano (Sim/Não)</option>
                                                        <option value="calculated">Calculado</option>
                                                    </select>
                                                </div>

                                                {/*check box*/}
                                                <CheckBox
                                                    campo={campo}
                                                    index={index}
                                                    alterarCampo={alterarCampo}
                                                    visibilidadeCondicionais={visibilidadeCondicionais}
                                                    visibilidadeCondicional={visibilidadeCondicional}
                                                />

                                                <div className={`${visibilidadeCondicionais[index] ? '' : 'hidden'}`}>
                                                    <Condicional
                                                        formState={formState}
                                                        index={index}
                                                        construtorCondicao={construtorCondicao}
                                                        atualizarConstrutor={atualizarConstrutor}
                                                        inserirCondicao={inserirCondicao}
                                                    />
                                                </div>

                                                <div
                                                    className="mt-1 p-2 border-t grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                                    <Validacao
                                                        campo={campo}
                                                        index={index}
                                                        alterarCampo={alterarCampo}
                                                        adicionarValidacao={adicionarValidacao}
                                                        removerValidacao={removerValidacao}
                                                        alterarValidacao={alterarValidacao}
                                                        adicionarOpcao={adicionarOpcao}
                                                        removerOpcao={removerOpcao}
                                                        alterarOpcao={alterarOpcao}
                                                    />
                                                </div>
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
                            {/* ... (botões de ação) ... */}
                            <button type="button" onClick={onClose}
                                    className="w-auto bg-gray-200 text-gray-800 p-2 px-4 rounded-md hover:bg-gray-300">Cancelar
                            </button>
                            <button type="submit" form="meuFormulario"
                                    className="w-auto bg-black text-white p-2 px-4 rounded-md hover:bg-gray-800">Salvar
                                Formulário
                            </button>
                        </div>
                    </div>
                </div>


                {/* Painel direito (Decorativo) */}
                <div className="hidden lg:flex items-center justify-center flex-1 bg-gray-50 text-black p-8">
                    {/* ... */}
                </div>
            </div>
        </div>
    );
}