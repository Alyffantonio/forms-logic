import React, { useState } from 'react';

function avaliarCondicao(condicaoString, respostas) {
    if (!condicaoString) {
        return true;
    }

    const condicoes = condicaoString.split('&&').map(s => s.trim());

    for (const cond of condicoes) {

        // Tenta extrair as partes: campo, operador, valor
        const match = cond.match(/(\w+)\s*([<>=!]+)\s*(.*)/);
        if (!match) continue;

        const [, campoId, operador, valorCondicao] = match;
        const valorResposta = respostas[campoId];

        // Remove aspas simples do valor da condição se houver
        const valorLimpo = valorCondicao.replace(/'/g, '');

        let resultado = false;
        switch (operador) {
            case '==':
                resultado = String(valorResposta) === valorLimpo;
                break;
            case '!=':
                resultado = String(valorResposta) !== valorLimpo;
                break;
            case '>=':
                resultado = Number(valorResposta) >= Number(valorLimpo);
                break;
            case '<=':
                resultado = Number(valorResposta) <= Number(valorLimpo);
                break;
            case '>':
                resultado = Number(valorResposta) > Number(valorLimpo);
                break;
            case '<':
                resultado = Number(valorResposta) < Number(valorLimpo);
                break;
            default:
                resultado = false;
        }
        if (!resultado) return false;
    }

    return true;
}


export default function FormularioPreview({ campos }) {
    const [respostas, setRespostas] = useState({});

    function handleRespostaChange(event) {
        const { name, value, type, checked } = event.target;
        setRespostas(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    return (
        <form className="w-full space-y-4">
            {campos.map(campo => {
                const isVisivel = avaliarCondicao(campo.condicionais.map(c => `${c.campo} ${c.operador} ${c.valor}`).join(' && '), respostas);

                if (!isVisivel) {
                    return null;
                }

                const attrsValidacao = { required: campo.obrigatorio };
                campo.validacoes.forEach(v => {
                    if (v.tipo === 'tamanho_minimo') attrsValidacao.minLength = v.valor;
                    if (v.tipo === 'tamanho_maximo') attrsValidacao.maxLength = v.valor;
                    if (v.tipo === 'minimo') attrsValidacao.min = v.valor;
                    if (v.tipo === 'maximo') attrsValidacao.max = v.valor;
                    if (v.tipo === 'regex') attrsValidacao.pattern = v.valor;
                });

                switch (campo.tipo) {
                    case 'text':
                        return (
                            <div key={campo.temp_id}>
                                <label htmlFor={campo.id} className="block text-sm font-medium text-gray-700">{campo.label}</label>
                                <input
                                    type="text"
                                    id={campo.id}
                                    name={campo.id}
                                    value={respostas[campo.id] || ''}
                                    onChange={handleRespostaChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    {...attrsValidacao}
                                />
                            </div>
                        );
                    case 'number':
                        return (
                            <div key={campo.temp_id}>
                                <label htmlFor={campo.id} className="block text-sm font-medium text-gray-700">{campo.label}</label>
                                <input
                                    type="number"
                                    id={campo.id}
                                    name={campo.id}
                                    value={respostas[campo.id] || ''}
                                    onChange={handleRespostaChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    {...attrsValidacao}
                                />
                            </div>
                        );
                    case 'select':
                         return (
                            <div key={campo.temp_id}>
                                <label htmlFor={campo.id} className="block text-sm font-medium text-gray-700">{campo.label}</label>
                                <select
                                    id={campo.id}
                                    name={campo.id}
                                    value={respostas[campo.id] || ''}
                                    onChange={handleRespostaChange}
                                    className="mt-1 p-2 w-full border rounded-md bg-white"
                                    {...attrsValidacao}
                                >
                                    <option value="" disabled>Selecione...</option>
                                    {campo.opcoes?.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                         );
                    case 'boolean':
                        return (
                            <div key={campo.temp_id} className="flex items-center">
                               <input
                                    type="checkbox"
                                    id={campo.id}
                                    name={campo.id}
                                    checked={respostas[campo.id] || false}
                                    onChange={handleRespostaChange}
                                    className="h-4 w-4 rounded border-gray-300"
                                    {...attrsValidacao}
                                />
                                <label htmlFor={campo.id} className="ml-2 block text-sm text-gray-700">{campo.label}</label>
                            </div>
                        )
                    default:
                        return null;
                }
            })}
        </form>
    );
}