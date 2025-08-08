import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Importe o toast

const apiUrl = import.meta.env.VITE_API_URL;

export default function RespostaModal({ formParaResponder, onClose }) {
    const [respostas, setRespostas] = useState({});
    const [formularioCompleto, setFormularioCompleto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!formParaResponder) return;

        const idNumerico = parseInt(formParaResponder.id.replace('formulario_', ''), 10);
        const versao = formParaResponder.schema_version;

        fetch(`${apiUrl}/api/v1/formularios/${idNumerico}/versao/${versao}/`)
            .then(res => res.json())
            .then(data => {
                setFormularioCompleto(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar campos do formulário:", error);
                setLoading(false);
            });
    }, [formParaResponder]);

    const sendRespostas = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('authToken');
        const idNumerico = parseInt(formParaResponder.id.replace('formulario_', ''), 10);
        const endPoint = `${apiUrl}/api/v1/formularios/${idNumerico}/respostas/`;

        const payload = {
            respostas: respostas,
        };

        try {
            const response = await fetch(endPoint, { // Corrigido
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(`Resposta enviada com sucesso! ID: ${result.id_resposta}`);
                onClose();
            } else {
                console.error('Erro de validação:', result);
                toast.error(`Erro ao enviar resposta: ${JSON.stringify(result)}`);
            }
        } catch (error) {
            console.error('Falha na conexão:', error);
            toast.error('Não foi possível conectar ao servidor.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-semibold text-gray-800">{formularioCompleto?.nome || 'Carregando...'}</h2>
                    <p className="text-sm text-gray-500">{formularioCompleto?.descricao}</p>
                    <p className="text-xs text-gray-400 mt-1">Versão: {formParaResponder?.schema_version}</p>
                </div>

                <form id="meuFormulario"  onSubmit={sendRespostas} className="p-6 space-y-4 overflow-y-auto">
                    {loading ? (
                        <p>Carregando campos...</p>
                    ) : (

                        formularioCompleto?.campos.map(campo => {
                            return (
                                <div key={campo.id}>
                                    <label htmlFor={campo.id} className="block text-sm font-medium text-gray-700">
                                        {campo.label} {campo.obrigatorio && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type={campo.tipo === 'number' ? 'number' : 'text'}
                                        id={campo.id}
                                        name={campo.id}
                                        required={campo.obrigatorio}
                                        onChange={(e) => setRespostas(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                </div>
                            );
                        })
                    )}
                </form>

                <div className="flex justify-end gap-4 p-4 border-t bg-gray-50">
                    <button type="button" onClick={onClose}
                            className="w-auto bg-gray-200 text-gray-800 p-2 px-4 rounded-md hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button type="submit" form="meuFormulario"
                            className="w-auto bg-black text-white p-2 px-4 rounded-md hover:bg-gray-800">
                        Enviar Respostas
                    </button>
                </div>
            </div>
        </div>
    );
}