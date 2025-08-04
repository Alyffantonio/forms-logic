import React, {useState} from 'react';

function avaliarCondicao(condicaoString, respostas) {
    if (!condicaoString) {
        return true;
    }

    const condicoes = condicaoString.split('&&').map(s => s.trim());

    for (const cond of condicoes) {

        const match = cond.match(/(\w+)\s*([<>=!]+)\s*(.*)/);
        if (!match) continue;

        const [, campoId, operador, valorCondicao] = match;
        const valorResposta = respostas[campoId];

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

function tituloUpper(string) {
    if (!string) return "";
    return string.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

export default function FormularioPreview({campos}) {
    const [respostas, setRespostas] = useState({});

    function respostaChange(event, campoDefinicao) {
        const {name, value, type, checked} = event.target;

        let valorFinal = type === 'checkbox' ? checked : value;

        if (campoDefinicao && campoDefinicao.tipo === 'text' && campoDefinicao.capitalizar) {
            valorFinal = tituloUpper(value)
        }

        setRespostas(prev => ({
            ...prev,
            [name]: valorFinal
        }));
    }

    return (
        <form className="w-full space-y-4">
            {campos.map(campo => {
                const isVisivel = avaliarCondicao(campo.condicional, respostas);
                if (!isVisivel) {
                    return null;
                }

                const attrsValidacao = {required: campo.obrigatorio};

                campo.validacoes.forEach(v => {
                    if (v.tipo === 'tamanho_minimo') attrsValidacao.minLength = v.valor;
                    if (v.tipo === 'tamanho_maximo') attrsValidacao.maxLength = v.valor;
                    if (v.tipo === 'minimo') attrsValidacao.min = v.valor;
                    if (v.tipo === 'maximo') attrsValidacao.max = v.valor;
                    if (v.tipo === 'regex') attrsValidacao.pattern = v.valor;
                });

                switch (campo.tipo) {
                    case 'text':

                        const textArea = campo.multilinha

                        const InputComponent = textArea ? 'textarea' : 'input';

                        return (
                            <div key={campo.temp_id} className={textArea ? 'md:col-span-2' : ''}>
                                <label htmlFor={campo.id}
                                       className="block text-sm font-medium text-gray-700">{campo.label}</label>
                                <InputComponent
                                    type={textArea ? undefined : 'text'}
                                    id={campo.id}
                                    name={campo.id}
                                    value={respostas[campo.id] || ''}
                                    onChange={respostaChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    rows={textArea ? 3 : undefined}
                                    {...attrsValidacao}
                                />
                            </div>
                        );
                    case 'number':
                        return (
                            <div key={campo.temp_id}>
                                <label htmlFor={campo.id}
                                       className="block text-sm font-medium text-gray-700">{campo.label}</label>
                                <input
                                    type="number"
                                    id={campo.id}
                                    name={campo.id}
                                    value={respostas[campo.id] || ''}
                                    onChange={e => respostaChange(e, campo)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    {...attrsValidacao}
                                />
                            </div>
                        );
                    case 'select':
                        return (
                            <div key={campo.temp_id}>
                                <label htmlFor={campo.id}
                                       className="block text-sm font-medium text-gray-700">{campo.label}</label>
                                <select
                                    id={campo.id}
                                    name={campo.id}
                                    value={respostas[campo.id] || ''}
                                    onChange={e => respostaChange(e, campo)}
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
                                {/* 1. A label vem primeiro, como você pediu, com uma margem à direita (mr-2) */}
                                <label htmlFor={campo.id} className="mr-2 block text-sm font-medium text-gray-700">
                                    {campo.label}
                                </label>

                                {/* 2. O input vem depois, com as classes de tamanho corrigidas */}
                                <input
                                    type="checkbox"
                                    id={campo.id}
                                    name={campo.id}
                                    checked={respostas[campo.id] || false}
                                    onChange={e => respostaChange(e, campo)}
                                    // Classes corrigidas para um checkbox (tamanho fixo, sem largura total)
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    {...attrsValidacao}
                                />
                            </div>
                        )
                    case 'date':
                        return (
                            <div key={campo.temp_id}>
                                <label htmlFor={campo.id}
                                       className="block text-sm font-medium text-gray-700">{campo.label}</label>
                                <input
                                    type="date"
                                    id={campo.id}
                                    name={campo.id}
                                    value={respostas[campo.id] || ''}
                                    onChange={e => respostaChange(e, campo)}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    {...attrsValidacao}
                                />
                            </div>
                        )
                    default:
                        return null;
                }
            })}
        </form>
    );
}