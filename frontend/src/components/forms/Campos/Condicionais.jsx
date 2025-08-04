import React, {useState} from "react";

export default function Condicional({campo, index, camposDisponiveis, construtorCondicao, atualizarConstrutor, inserirCondicao, limparCondicional,}) {

    const [construtoVisivel, setConstrutoVisivel] = useState(!!campo.condicional);

    function limparConstrutor() {
        limparCondicional(index);
        setConstrutoVisivel(false);
    }

    return (
        <div className="mt-1 p-2 border-t grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="col-span-full space-y-3">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm text-gray-700">Condicional</h4>

                    {construtoVisivel ? (
                        <button
                            type="button"
                            onClick={limparConstrutor}
                            className="text-sm text-red-600 hover:underline"
                        >
                            - Remover
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setConstrutoVisivel(true)}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            + Adicionar
                        </button>
                    )}
                </div>

                {construtoVisivel && (
                    <>
                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value={campo.condicional || "Nenhuma condição definida."}
                                className="w-full p-2 pr-20 border rounded-md bg-gray-200 text-sm text-gray-600 italic"
                            />
                            {campo.condicional && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={limparCondicional}
                                        className="text-sm text-red-600 hover:underline"
                                    >
                                        Limpar
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                            <select
                                value={construtorCondicao[index]?.campo || ''}
                                onChange={e => atualizarConstrutor(index, 'campo', e.target.value)}
                                className="p-2 w-full border rounded-md bg-white text-sm"
                            >
                                <option value="" disabled>Campo...</option>
                                {camposDisponiveis.map(c => (
                                    <option key={c.temp_id} value={c.id}>{c.id}</option>
                                ))}
                            </select>

                            <select
                                value={construtorCondicao[index]?.operador || ''}
                                onChange={e => atualizarConstrutor(index, 'operador', e.target.value)}
                                className="p-2 w-full border rounded-md bg-white text-sm"
                            >
                                <option value="" disabled>Operador...</option>
                                <option value="==">Igual a (==)</option>
                                <option value="!=">Diferente de (!=)</option>
                                <option value=">">Maior que (&gt;)</option>
                                <option value="<">Menor que (&lt;)</option>
                                <option value=">=">Maior ou igual (&gt;=)</option>
                                <option value="<=">Menor ou igual (&lt;=)</option>
                            </select>

                            <div className="flex gap-1">
                                <input
                                    type="text"
                                    value={construtorCondicao[index]?.valor || ''}
                                    onChange={e => atualizarConstrutor(index, 'valor', e.target.value)}
                                    className="p-2 w-full border rounded-md text-sm"
                                    placeholder="Valor..."
                                />
                                <button type="button" onClick={() => inserirCondicao(index)}
                                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                    +
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}