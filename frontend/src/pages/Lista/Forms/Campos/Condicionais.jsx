import React from "react";

export default function Condicional({ campo, index, adicionarCondicional, alterarCondicional, removerCondicional, camposDisponiveis }) {
    return (
        <div className="col-span-full space-y-3">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold text-sm text-gray-700">Condicionais</h4>
                <button
                    type="button"
                    onClick={() => adicionarCondicional(index)}
                    className="text-sm text-blue-600 hover:underline"
                >
                    + Adicionar Condicional
                </button>
            </div>

            {campo.condicionais?.map((condicional, i) => (
                <div key={condicional.id} className="flex items-center gap-2 border p-2 rounded-md bg-gray-50"
                >
                    {/* Campo alvo */}
                    <select
                        name="campo"
                        value={condicional.campo}
                        onChange={e => alterarCondicional(index, i, e)}
                        className="w-1/3 p-2 border rounded-md bg-white text-sm"
                    >
                        <option value="">Campo...</option>
                        {camposDisponiveis.map(c => (
                            <option key={c.temp_id} value={c.id}>
                                {c.id}
                            </option>
                        ))}
                    </select>

                    {/* Operador */}
                    <select
                        name="operador"
                        value={condicional.operador}
                        onChange={e => alterarCondicional(index, i, e)}
                        className="w-1/4 p-2 border rounded-md bg-white text-sm"
                    >
                        <option value="">Operador...</option>
                        <option value="==">Igual a (==)</option>
                        <option value="!=">Diferente de (!=)</option>
                        <option value=">">Maior que (&gt;)</option>
                        <option value="<">Menor que (&lt;)</option>
                        <option value=">=">Maior ou igual (&gt;=)</option>
                        <option value="<=">Menor ou igual (&lt;=)</option>
                    </select>

                    {/* Valor */}
                    <input
                        type="text"
                        name="valor"
                        value={condicional.valor}
                        onChange={e => alterarCondicional(index, i, e)}
                        placeholder="Valor..."
                        className="w-1/3 p-2 border rounded-md text-sm"
                    />

                    {/* Botão remover */}
                    <button
                        type="button"
                        onClick={() => removerCondicional(index, i)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold w-8 h-9 flex items-center justify-center rounded transition-colors"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
