// Este arquivo define as propriedades e validações específicas para cada tipo de campo

export const configuracoesPorTipo = {
    text: {
        propriedades: ['capitalizar', 'multilinha'],
        validacoes: [
            {value: 'tamanho_minimo', label: 'Tamanho Mínimo'},
            {value: 'tamanho_maximo', label: 'Tamanho Máximo'},
            {value: 'regex', label: 'Regex'},
            {value: 'nao_vazio', label: 'nao vazio'},
            {value: 'nao_conter', label: 'nao conter'},
        ],
    },
    number: {
        propriedades: ['formato'],
        validacoes: [
            {value: 'minimo', label: 'Valor Mínimo'},
            {value: 'maximo', label: 'Valor Máximo'},
            {value: 'multiplo_de', label: 'Valor informado deve ser múltiplo exato.'},
            {value: 'formato', label: 'inteiro ou decimal.'},
            {value: 'nao_nulo', label: 'Não pode ser nulo.'},
        ],
    },
    select: {
        propriedades: ['multipla', 'opcoes'],
        validacoes: [
            {value: 'quantidade_minima', label: 'Qtd. Mínima'},
            {value: 'quantidade_maxima', label: 'Qtd. Máxima'},
        ],
    },
    date: {
        propriedades: ['minima', 'maxima'],
        validacoes: [
            {value: 'data_futura', label: 'Validação de Data Futura'},
            {value: 'anterior_a', label: 'Anterior a Outro Campo'},
            {value: 'nao_nulo', label: 'Não Nulo (Obrigatório)'},
            {value: 'formato_iso_estrito', label: 'Exigir Formato ISO (YYYY-MM-DD)'},
        ],
    },
    boolean: {
        propriedades: [],
        validacoes: [
            {value: 'nao_nulo', label: 'Não Nulo'},
            {value: 'valor_esperado', label: 'Valor Esperado'},
            {value: 'bloqueado_para_falso', label: 'Bloqueado se Falso (Avançado)'}
        ]
    },
    // 'calculated' não terão validações extras por enquanto
};