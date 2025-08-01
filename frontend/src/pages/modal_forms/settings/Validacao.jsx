import React from 'react';
import { configuracoesPorTipo } from './validacoes/propriedades.js';

export default function Validacao({ campo, index, alterarCampo, adicionarValidacao, alterarValidacao, removerValidacao, adicionarOpcao, removerOpcao, alterarOpcao }) {

  const config = configuracoesPorTipo[campo.tipo];

  if (!config) {
    return null;
  }

  const EditorDeOpcoes = () => (
    <div className="col-span-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">Opções</label>
      {campo.opcoes?.map((opcao, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <input type="text" name="label" value={opcao.label} onChange={(e) => alterarOpcao(index, i, e)} className="p-2 w-full border rounded-md text-sm" placeholder="Texto da Opção"/>
          <input type="text" name="value" value={opcao.value} onChange={(e) => alterarOpcao(index, i, e)} className="p-2 w-full border rounded-md text-sm" placeholder="Valor da Opção"/>
          <button type="button" onClick={() => removerOpcao(index, i)} className="text-red-500 hover:text-red-700">Remover</button>
        </div>
      ))}
      <button type="button" onClick={() => adicionarOpcao(index)} className="text-sm text-blue-600 hover:underline mt-1">+ Adicionar Opção</button>
    </div>
  );

  const EditorDeValidacoes = () => (
    <div className="col-span-full">
        {campo.validacoes?.map((v, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
                <select name="tipo" value={v.tipo} onChange={e => alterarValidacao(index, i, e)} className="p-2 w-1/2 border rounded-md bg-white text-sm">
                    {config.validacoes.map(regra => (
                        <option key={regra.value} value={regra.value}>{regra.label}</option>
                    ))}
                </select>
                <input type="text" name="valor" value={v.valor} onChange={e => alterarValidacao(index, i, e)} className="p-2 w-1/2 border rounded-md text-sm" placeholder="Valor"/>
                <button type="button" onClick={() => removerValidacao(index, i)} className="text-red-500 hover:text-red-700">Remover</button>
            </div>
        ))}
        <button type="button" onClick={() => adicionarValidacao(index)} className="text-sm text-blue-600 hover:underline mt-1">+ Adicionar Validação</button>
    </div>
  );


  return (
    <>
      {config.propriedades.includes('formato') && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Formato</label>
          <select name="formato" value={campo.formato || 'decimal'} onChange={e => alterarCampo(index, e)} className="mt-1 p-2 w-full border rounded-md bg-white">
            <option value="decimal">Decimal</option>
            <option value="inteiro">Inteiro</option>
          </select>
        </div>
      )}
       {config.propriedades.includes('multipla') && (
        <div className="flex items-center col-span-full">
            <input type="checkbox" name="multipla" id={`multipla_${index}`} checked={campo.multipla || false} onChange={e => alterarCampo(index, e)} className="h-4 w-4 rounded border-gray-300"/>
            <label htmlFor={`multipla_${index}`} className="ml-2 block text-sm text-gray-900">Permitir Múltipla Seleção</label>
        </div>
      )}

      {campo.tipo === 'select' && <EditorDeOpcoes />}

      {config.validacoes.length > 0 && <EditorDeValidacoes />}
    </>
  );
}