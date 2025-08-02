import React from "react";

export default function Opcoes({campo, index, adicionarOpcao, alterarOpcao, removerOpcao}) {
    return (
        <div className="mt-1 p-2 border-t grid grid-cols-1 gap-4 items-start">
            <div className="col-span-full space-y-3">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm text-gray-700">Opções</h4>
                    <button
                        type="button"
                        onClick={() => adicionarOpcao(index)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        + Adicionar
                    </button>
                </div>

                {campo.opcoes?.map((opcao, i) => (
                    <div
                        key={opcao.id}
                        className="flex items-center gap-2 border p-2 rounded-md bg-gray-50"
                    >
                        <input
                            type="text"
                            name="valor"
                            placeholder="Valor..."
                            value={opcao.valor}
                            onChange={e => alterarOpcao(index, i, e)}
                            className="w-48 p-2 border rounded-md text-sm"
                        />
                        <input
                            type="text"
                            name="label"
                            placeholder="Label..."
                            value={opcao.label}
                            onChange={e => alterarOpcao(index, i, e)}
                            className="w-52 p-2 border rounded-md bg-white text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => removerOpcao(index, i)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold w-8 h-9 flex items-center justify-center rounded transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                ))}
            </div>
        </div>
    );
}
