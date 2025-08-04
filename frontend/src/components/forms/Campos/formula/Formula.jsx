import React, {useState} from "react";
import {FaQuestionCircle} from "react-icons/fa";

export default function Formula({
                                    campo,
                                    index,
                                    alterarCampo,
                                    camposDisponiveis,
                                    adicionarDependencia,
                                    removerDependencia,
                                    alterarDependencia
                                }) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="mt-1 border-t grid grid-cols-1 gap-4 items-start relative">
            <div>
                <label className="block mt-3 text-sm font-medium text-gray-700 flex items-center gap-1 relative">
                    Fórmula
                    <span
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        className="relative"
                    >
                        <FaQuestionCircle className="h-4 w-4 text-gray-400 cursor-pointer"/>
                        {showTooltip && (
                            <div
                                className="absolute left-6 top-0 z-10 w-72 p-3 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-md">
                                <h3 className="font-semibold text-gray-900">Campo Calculado</h3>
                                <p className="mb-2">
                                    Este campo não aceita entrada manual. Seu valor é calculado automaticamente com base
                                    em uma fórmula definida.
                                    A fórmula pode usar outros campos do formulário, por exemplo:
                                    <code className="bg-gray-100 px-1">{'idade >= 18'}</code> ou
                                    <code className="bg-gray-100 px-1">salario_base + bonus</code>.
                                </p>
                                <h3 className="font-semibold text-gray-900">Como usar</h3>
                                <p className="mb-2">
                                    Use nomes de campos existentes e operadores matemáticos ou lógicos. O valor final é
                                    atualizado automaticamente
                                    quando os campos dependentes são alterados.
                                </p>
                            </div>
                        )}
                    </span>
                </label>
                <textarea
                    name="formula"
                    value={campo.formula || ""}
                    onChange={e => alterarCampo(index, e)}
                    className="p-2 mt-1 w-full border rounded-md font-mono text-sm"
                    placeholder="Ex: idade >= 18"
                    rows={2}
                />
            </div>
            <div className="mt-1 p-2 border-t grid grid-cols-1 gap-4 items-start">
                <div className="col-span-full space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-sm text-gray-700">Dependências</h4>
                        <button
                            type="button"
                            onClick={() => adicionarDependencia(index)}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            + Adicionar
                        </button>
                    </div>

                    {campo.dependencias?.map((dependencia, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <select
                                value={dependencia}
                                onChange={e => alterarDependencia(index, i, e)} // <-- Usa a função correta
                                className="w-full p-2 border rounded-md bg-white text-sm"
                            >
                                <option value="" disabled>Selecione um campo...</option>
                                {camposDisponiveis.map(c => (
                                    <option key={c.temp_id} value={c.id}>
                                        {c.id} ({c.label})
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={() => removerDependencia(index, i)} // <-- Usa a função correta
                                className="bg-red-500 hover:bg-red-600 text-white font-bold w-9 h-9 flex items-center justify-center rounded transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}