import React from "react";
import Formula from "./formula/Formula.jsx";
import Opcoes from "./opcoes/Opcoes.jsx"
import CheckBox from "./CheckBox.jsx";

export default function CamposFixos({campo, index, alterarCampo}) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        ID do Campo
                    </label>
                    <input
                        type="text"
                        name="id"
                        value={campo.id}
                        onChange={e => alterarCampo(index, e)}
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder="ex: nome_usuario"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Rótulo (Label)
                    </label>
                    <input
                        type="text"
                        name="label"
                        value={campo.label}
                        onChange={e => alterarCampo(index, e)}
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder="ex: Nome do Usuário"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Tipo de Campo
                </label>
                <select
                    name="tipo"
                    value={campo.tipo}
                    onChange={e => alterarCampo(index, e)}
                    className="mt-1 p-2 w-full border rounded-md bg-white"
                >
                    <option value="text">Texto</option>
                    <option value="number">Número</option>
                    <option value="date">Data</option>
                    <option value="select">Seleção</option>
                    <option value="boolean">Booleano (Sim/Não)</option>
                    <option value="calculated">Calculado</option>
                </select>
            </div>
        </>
    );
}
