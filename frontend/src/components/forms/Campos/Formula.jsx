import React from "react";

// 1. Corrija a assinatura da função para receber as props
export default function Formula({ campo, index, alterarCampo }) {
    return (
        <div className="mt-1 p-2 border-t grid grid-cols-1 md:grid-cols-1 gap-4 items-start">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Fórmula
                </label>
                <textarea
                    name="formula"
                    // 2. Agora 'campo' existe e pode ser usado aqui sem erro
                    value={campo.formula || ''}
                    onChange={e => alterarCampo(index, e)}
                    className="p-2 mt-1 w-full border rounded-md font-mono text-sm"
                    placeholder="Ex: idade >= 18"
                    rows={2}
                />
            </div>
        </div>
    )
}