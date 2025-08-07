import React from "react";
import {validacoesPorTipo} from "./validacoes/propriedades.js";

export default function Validacao({campo, index, adicionarValidacao, alterarValidacao, removerValidacao}) {

    const regras = validacoesPorTipo[campo.tipo] || [];

    return (
        <div className="mt-1 p-2 border-t grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="col-span-full space-y-3">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm text-gray-700">Validações</h4>
                    <button
                        type="button"
                        onClick={() => adicionarValidacao(index)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        + Adicionar
                    </button>
                </div>

                {campo.validacoes?.map((validacao, i) => {
                    const regraSelecionada = regras.find(r => r.value === validacao.tipo);

                    return (
                        <div key={validacao.id} className="flex flex-col gap-2 border p-2 rounded-md bg-gray-50">
                            <div className="flex gap-2 items-start">
                                <select name="tipo" value={validacao.tipo}
                                        onChange={e => alterarValidacao(index, i, e)}
                                        className="flex-1 p-2 border rounded-md bg-white text-sm"
                                >
                                    <option value="">Selecione a validação</option>
                                    {regras.map(r => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    onClick={() => removerValidacao(index, i)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold w-8 h-9 flex items-center justify-center rounded transition-colors"
                                    title="Remover Validação"
                                >
                                    ✕
                                </button>

                            </div>

                            {/* campos extras dinâmicos */}
                            {regraSelecionada?.campos?.map(campoExtra => (
                                <input
                                    key={campoExtra}
                                    type="text"
                                    name={campoExtra}
                                    value={validacao[campoExtra] || ""}
                                    onChange={e => alterarValidacao(index, i, e)}
                                    placeholder={campoExtra}
                                    className="p-2 border rounded-md text-sm"
                                />
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
