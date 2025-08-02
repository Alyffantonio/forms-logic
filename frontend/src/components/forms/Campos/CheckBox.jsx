import React from 'react';

export default function CheckBox({campo, index, alterarCampo}) {

    return (
        <div className="mt-1 p-2 border-t grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="flex items-center space-x-3 ml-10 mt-2 gap-10">
                <div className="flex items-center">
                    <input type="checkbox" name="capitalizar"
                           id={`capitalizar_${index}`} checked={campo.capitalizar || false}
                           onChange={e => alterarCampo(index, e)}
                           className="h-4 w-4 rounded border-gray-300"/>
                    <label htmlFor={`capitalizar_${index}`}
                           className="ml-2 block text-sm text-gray-900">Capitalizar</label>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" name="obrigatorio"
                           id={`obrigatorio_${index}`} checked={campo.obrigatorio || false}
                           onChange={e => alterarCampo(index, e)}
                           className="h-4 w-4 rounded border-gray-300"/>
                    <label htmlFor={`obrigatorio_${index}`}
                           className="ml-2 block text-sm text-gray-900">Obrigatório</label>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" name="multilinha"
                           id={`multilinha_${index}`} checked={campo.multilinha || false}
                           onChange={e => alterarCampo(index, e)}
                           className="h-4 w-4 rounded border-gray-300"/>
                    <label htmlFor={`multilinha_${index}`}
                           className="ml-2 block text-sm text-gray-900">Multilinha</label>
                </div>
            </div>
        </div>
    );
}