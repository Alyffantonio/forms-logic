import React from 'react';

export default function Condicional({ formState, index, construtorCondicao, atualizarConstrutor, inserirCondicao }) {

  return (
    <div className="mt-2 p-3 border-t grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
        <select
            value={construtorCondicao[index]?.campo || ''}
            onChange={e => atualizarConstrutor(index, 'campo', e.target.value)}
            className="p-2 w-full border rounded-md bg-white text-sm"
        >
            <option value="" disabled>Campo...</option>
            {formState.campos.filter((c, i) => i !== index && c.id).map(c => (
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
            <option value=">=">Maior ou igual a (&gt;=)</option>
            <option value="<=">Menor ou igual a (&lt;=)</option>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                     viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"/>
                </svg>
            </button>
        </div>
    </div>
  );
}