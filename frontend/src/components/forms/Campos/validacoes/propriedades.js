export const  validacoesPorTipo = {
  text: [
    { value: "tamanho_minimo", label: "Tamanho mínimo", campos: ["valor"] },
    { value: "tamanho_maximo", label: "Tamanho máximo", campos: ["valor"] },
    { value: "regex", label: "Expressão regular", campos: ["valor"] },
    { value: "nao_vazio", label: "Não vazio", campos: [] },
    { value: "nao_conter", label: "Não conter (palavras)", campos: ["valor"] }
  ],
  number: [
    { value: "minimo", label: "Mínimo", campos: ["valor"] },
    { value: "maximo", label: "Máximo", campos: ["valor"] },
    { value: "multiplo_de", label: "Múltiplo de", campos: ["valor"] },
    { value: "nao_nulo", label: "Não nulo", campos: [] }
  ],
  boolean: [
    { value: "nao_nulo", label: "Não nulo", campos: [] },
    { value: "valor_esperado", label: "Valor esperado", campos: ["valor"] }
  ],
  date: [
    { value: "data_futura", label: "Permitir data futura", campos: ["permitido"] },
    { value: "formato_iso_estrito", label: "Formato ISO estrito", campos: [] },
    { value: "nao_nulo", label: "Não nulo", campos: [] },
    { value: "anterior_a", label: "Anterior a outro campo", campos: ["campo"] }
  ],
  select: [
    { value: "valor_na_lista", label: "Valor na lista", campos: [] },
    { value: "quantidade_minima", label: "Quantidade mínima", campos: ["valor"] },
    { value: "quantidade_maxima", label: "Quantidade máxima", campos: ["valor"] }
  ],
  calculated: [
    { value: "igual_a", label: "Igual a", campos: ["valor"] },
    { value: "intervalo_valido", label: "Intervalo válido", campos: ["min", "max"] },
  ]
};
