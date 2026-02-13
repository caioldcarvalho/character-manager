import type { FeatDefinition } from '$lib/types';

export const FEAT_CATALOG: FeatDefinition[] = [
  {
    id: 'observant',
    name: 'Observador',
    description: 'Rápido em notar detalhes. +5 em Percepção Passiva e Investigação Passiva. +1 em Inteligência ou Sabedoria.',
    modifiers: [
      { target: 'passive:perception', value: 5 },
      { target: 'passive:investigation', value: 5 }
    ],
    proficiencies: [],
    resources: [],
    choices: [
      {
        id: 'ability',
        label: '+1 Atributo',
        options: [
          { id: 'int', label: '+1 Inteligência', modifiers: [{ target: 'ability:intelligence', value: 1 }] },
          { id: 'wis', label: '+1 Sabedoria', modifiers: [{ target: 'ability:wisdom', value: 1 }] }
        ]
      }
    ]
  },
  {
    id: 'alert',
    name: 'Alerta',
    description: 'Sempre alerta ao perigo. +5 na iniciativa. Não pode ser surpreendido enquanto estiver consciente.',
    modifiers: [
      { target: 'initiative', value: 5 }
    ],
    proficiencies: [],
    resources: [],
    choices: []
  },
  {
    id: 'tough',
    name: 'Resistente',
    description: 'Seu máximo de pontos de vida aumenta em 2 por nível.',
    modifiers: [
      { target: 'hitPointsMaxPerLevel', value: 2 }
    ],
    proficiencies: [],
    resources: [],
    choices: []
  },
  {
    id: 'resilient',
    name: 'Resiliente',
    description: '+1 em um atributo escolhido e proficiência em testes de resistência desse atributo.',
    modifiers: [],
    proficiencies: [],
    resources: [],
    choices: [
      {
        id: 'ability',
        label: 'Atributo',
        options: [
          { id: 'str', label: 'Força', modifiers: [{ target: 'ability:strength', value: 1 }], proficiencies: [{ type: 'savingThrow', target: 'strength' }] },
          { id: 'dex', label: 'Destreza', modifiers: [{ target: 'ability:dexterity', value: 1 }], proficiencies: [{ type: 'savingThrow', target: 'dexterity' }] },
          { id: 'con', label: 'Constituição', modifiers: [{ target: 'ability:constitution', value: 1 }], proficiencies: [{ type: 'savingThrow', target: 'constitution' }] },
          { id: 'int', label: 'Inteligência', modifiers: [{ target: 'ability:intelligence', value: 1 }], proficiencies: [{ type: 'savingThrow', target: 'intelligence' }] },
          { id: 'wis', label: 'Sabedoria', modifiers: [{ target: 'ability:wisdom', value: 1 }], proficiencies: [{ type: 'savingThrow', target: 'wisdom' }] },
          { id: 'cha', label: 'Carisma', modifiers: [{ target: 'ability:charisma', value: 1 }], proficiencies: [{ type: 'savingThrow', target: 'charisma' }] }
        ]
      }
    ]
  },
  {
    id: 'skilled-expert',
    name: 'Especialista em Perícia',
    description: '+1 em um atributo. Escolha uma perícia para ganhar expertise (dobro do bônus de proficiência).',
    modifiers: [],
    proficiencies: [],
    resources: [],
    choices: [
      {
        id: 'ability',
        label: '+1 Atributo',
        options: [
          { id: 'str', label: 'Força', modifiers: [{ target: 'ability:strength', value: 1 }] },
          { id: 'dex', label: 'Destreza', modifiers: [{ target: 'ability:dexterity', value: 1 }] },
          { id: 'con', label: 'Constituição', modifiers: [{ target: 'ability:constitution', value: 1 }] },
          { id: 'int', label: 'Inteligência', modifiers: [{ target: 'ability:intelligence', value: 1 }] },
          { id: 'wis', label: 'Sabedoria', modifiers: [{ target: 'ability:wisdom', value: 1 }] },
          { id: 'cha', label: 'Carisma', modifiers: [{ target: 'ability:charisma', value: 1 }] }
        ]
      },
      {
        id: 'expertise',
        label: 'Expertise',
        options: [
          { id: 'athletics', label: 'Atletismo', proficiencies: [{ type: 'expertise', target: 'athletics' }] },
          { id: 'acrobatics', label: 'Acrobacia', proficiencies: [{ type: 'expertise', target: 'acrobatics' }] },
          { id: 'stealth', label: 'Furtividade', proficiencies: [{ type: 'expertise', target: 'stealth' }] },
          { id: 'perception', label: 'Percepção', proficiencies: [{ type: 'expertise', target: 'perception' }] }
        ]
      }
    ]
  },
  {
    id: 'lucky',
    name: 'Sortudo',
    description: 'Você tem 3 pontos de sorte. Pode gastar 1 para rolar um d20 adicional em ataques, salvamentos ou testes.',
    modifiers: [],
    proficiencies: [],
    resources: [
      { name: 'Pontos de Sorte', current: 3, max: 3, rechargeOn: 'long' }
    ],
    choices: []
  },
  {
    id: 'heavy-armor-master',
    name: 'Mestre em Armadura Pesada',
    description: '+1 em Força. Enquanto usando armadura pesada, dano não-mágico de ataques é reduzido em 3.',
    modifiers: [
      { target: 'ability:strength', value: 1 }
    ],
    proficiencies: [],
    resources: [],
    choices: []
  },
  {
    id: 'sharpshooter',
    name: 'Atirador Aguçado',
    description: '+1 em Destreza. Ataques à distância ignoram meia e 3/4 de cobertura. Sem desvantagem em longo alcance.',
    modifiers: [
      { target: 'ability:dexterity', value: 1 }
    ],
    proficiencies: [],
    resources: [],
    choices: []
  },
  {
    id: 'sentinel',
    name: 'Sentinela',
    description: 'Criaturas que você ataca com ataque de oportunidade têm velocidade reduzida a 0. Pode atacar mesmo se desengajarem.',
    modifiers: [],
    proficiencies: [],
    resources: [],
    choices: []
  },
  {
    id: 'actor',
    name: 'Ator',
    description: '+1 em Carisma. Vantagem em Enganação e Performance ao se disfarçar.',
    modifiers: [
      { target: 'ability:charisma', value: 1 }
    ],
    proficiencies: [],
    resources: [],
    choices: []
  },
  {
    id: 'durable',
    name: 'Durão',
    description: '+1 em Constituição. Proficiência em testes de resistência de Constituição.',
    modifiers: [
      { target: 'ability:constitution', value: 1 }
    ],
    proficiencies: [
      { type: 'savingThrow', target: 'constitution' }
    ],
    resources: [],
    choices: []
  },
  {
    id: 'dual-wielder',
    name: 'Combate com Arma Dupla',
    description: '+1 na CA enquanto empunha armas em ambas as mãos. Pode usar armas não-leves com duas armas.',
    modifiers: [],
    proficiencies: [],
    resources: [],
    choices: []
  },
  {
    id: 'mounted-combatant',
    name: 'Arqueiro Montado',
    description: 'Vantagem em ataques contra criaturas menores que sua montaria. Pode redirecionar ataques da montaria para você.',
    modifiers: [],
    proficiencies: [],
    resources: [],
    choices: []
  },
  {
    id: 'war-caster',
    name: 'Mago de Guerra',
    description: 'Vantagem em testes de Constituição para manter concentração. Pode realizar componentes somáticos com armas.',
    modifiers: [],
    proficiencies: [],
    resources: [],
    choices: [
      {
        id: 'ability',
        label: '+1 Atributo',
        options: [
          { id: 'int', label: '+1 Inteligência', modifiers: [{ target: 'ability:intelligence', value: 1 }] },
          { id: 'wis', label: '+1 Sabedoria', modifiers: [{ target: 'ability:wisdom', value: 1 }] }
        ]
      }
    ]
  },
  {
    id: 'athlete',
    name: 'Atleta',
    description: 'Levantar-se de caído custa apenas 5 pés de movimento. Escalar não custa movimento extra.',
    modifiers: [],
    proficiencies: [],
    resources: [],
    choices: [
      {
        id: 'ability',
        label: '+1 Atributo',
        options: [
          { id: 'str', label: '+1 Força', modifiers: [{ target: 'ability:strength', value: 1 }] },
          { id: 'dex', label: '+1 Destreza', modifiers: [{ target: 'ability:dexterity', value: 1 }] }
        ]
      }
    ]
  }
];
