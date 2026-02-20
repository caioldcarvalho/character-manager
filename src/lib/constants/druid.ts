import type { ClassFeature, BeastFormDefinition, Spell } from '../types';

// Moon Druid class features (all in Portuguese)
export const DRUID_MOON_FEATURES: ClassFeature[] = [
  {
    name: 'Druídico',
    level: 1,
    description: 'Você conhece o Druídico, a linguagem secreta dos druidas. Pode falar e usá-la para deixar mensagens ocultas.'
  },
  {
    name: 'Conjuração',
    level: 1,
    description: 'Você pode conjurar magias de druida usando Sabedoria como habilidade de conjuração. CD = 8 + proficiência + mod SAB.'
  },
  {
    name: 'Forma Selvagem',
    level: 2,
    uses: { current: 2, max: 2 },
    description: 'Ação: você se transforma em uma besta que já viu. 2 usos por descanso curto ou longo. Dura nível/2 horas.'
  },
  {
    name: 'Forma Selvagem de Combate',
    level: 2,
    description: 'Ação bônus para se transformar (em vez de ação). Pode gastar espaço de magia para recuperar 1d8 PV por nível do espaço.'
  },
  {
    name: 'Formas do Círculo',
    level: 2,
    description: 'Círculo da Lua: pode se transformar em bestas de ND 1 (nível 2), ND 2 (nível 6), ND 3 (nível 9), ND 4 (nível 12), ND 5 (nível 15).'
  },
  {
    name: 'Golpe Primal',
    level: 6,
    description: 'Seus ataques em forma de besta contam como mágicos para superar resistência e imunidade a ataques não-mágicos.'
  },
  {
    name: 'Forma Selvagem Elemental',
    level: 10,
    description: 'Gaste 2 usos de Forma Selvagem para se transformar em um elemental da terra, água, fogo ou ar.'
  },
  {
    name: 'Mil Formas',
    level: 14,
    description: 'Você pode conjurar Alterar-se à vontade, sem gastar espaço de magia.'
  }
];

// Beast forms with Ixalan flavor
export const MOON_DRUID_BEAST_FORMS: BeastFormDefinition[] = [
  {
    id: 'brontosaurus',
    name: 'Brontossauro',
    nameIxalan: 'Herbívoro Gigante',
    cr: 5,
    maxHP: 121,
    armorClass: 15,
    speed: '9m',
    attacks: [
      { name: 'Pisão', attackBonus: 8, damage: '3d8+5', damageType: 'concussão', description: 'Alvo Grande ou menor deve ter sucesso em teste FOR CD 14 ou ficar derrubado.' },
      { name: 'Cauda', attackBonus: 8, damage: '2d8+5', damageType: 'concussão' }
    ],
    specialAbilities: []
  },
  {
    id: 'triceratops',
    name: 'Triceratops',
    nameIxalan: 'Investidor Chifrado',
    cr: 5,
    maxHP: 95,
    armorClass: 13,
    speed: '15m',
    attacks: [
      { name: 'Investida com Chifre', attackBonus: 9, damage: '4d8+6', damageType: 'perfuração', description: 'Se mover 6m+ em linha reta, bônus 3d8 perfuração. Alvo deve ter sucesso em teste FOR CD 15 ou ficar derrubado.' },
      { name: 'Pisão', attackBonus: 9, damage: '3d10+6', damageType: 'concussão', description: 'Contra alvo derrubado.' }
    ],
    specialAbilities: ['Investida Trampling: se mover 6m+ e acertar chifrada, alvo faz FOR CD 13 ou cai. Se cair, pisão como ação bônus.']
  },
  {
    id: 'giant-crocodile',
    name: 'Crocodilo Gigante',
    nameIxalan: 'Sailback',
    cr: 5,
    maxHP: 85,
    armorClass: 14,
    speed: '9m, nado 15m',
    attacks: [
      { name: 'Mordida', attackBonus: 8, damage: '3d10+5', damageType: 'perfuração', description: 'Alvo agarrado (CD fuga 16). Até soltar, não pode morder outro alvo.' },
      { name: 'Cauda', attackBonus: 8, damage: '2d8+5', damageType: 'concussão', description: 'Alvo deve ter sucesso em teste FOR CD 16 ou ficar derrubado.' }
    ],
    specialAbilities: ['Prender Fôlego: 30 minutos']
  },
  {
    id: 'stegosaurus',
    name: 'Estegossauro',
    nameIxalan: 'Herbívoro de Placas',
    cr: 4,
    maxHP: 76,
    armorClass: 13,
    speed: '12m',
    attacks: [
      { name: 'Cauda', attackBonus: 7, damage: '6d6+5', damageType: 'perfuração' }
    ],
    specialAbilities: []
  },
  {
    id: 'ankylosaurus',
    name: 'Anchilossauro',
    nameIxalan: 'Cauda-de-Clava',
    cr: 3,
    maxHP: 68,
    armorClass: 15,
    speed: '9m',
    attacks: [
      { name: 'Cauda', attackBonus: 7, damage: '4d6+4', damageType: 'concussão', description: 'Alvo Grande ou menor deve ter sucesso em teste FOR CD 14 ou ficar derrubado.' }
    ],
    specialAbilities: []
  },
  {
    id: 'allosaurus',
    name: 'Alossauro',
    nameIxalan: 'Ferocidon',
    cr: 2,
    maxHP: 51,
    armorClass: 13,
    speed: '18m',
    attacks: [
      { name: 'Garra', attackBonus: 6, damage: '1d8+4', damageType: 'cortante' },
      { name: 'Mordida', attackBonus: 6, damage: '2d10+4', damageType: 'perfuração' }
    ],
    specialAbilities: ['Investida: se mover 9m+ e acertar garra, alvo faz FOR CD 13 ou cai. Se cair, mordida como ação bônus.']
  },
  {
    id: 'earth-elemental',
    name: 'Elemental da Terra',
    nameIxalan: 'Elemental (2 usos)',
    cr: 5,
    maxHP: 126,
    armorClass: 17,
    speed: '9m, escavar 9m',
    attacks: [
      { name: 'Pancada', attackBonus: 8, damage: '2d8+5', damageType: 'concussão', description: 'Multiataque: 2 pancadas por turno.' }
    ],
    specialAbilities: [
      'Deslizar pela Terra: pode escavar através de terra e pedra não-trabalhada sem perturbá-la.',
      'Vulnerável a Trovão',
      'Resistente a ataques não-mágicos'
    ],
    isElemental: true
  },
  {
    id: 'deathspitter',
    name: 'Cuspidor de Morte',
    nameIxalan: 'Cuspidor de Ixalan',
    cr: 0.5,
    maxHP: 18,
    armorClass: 12,
    speed: '12m',
    attacks: [
      { name: 'Mordida', attackBonus: 4, damage: '1d6+2', damageType: 'perfuração' },
      { name: 'Cuspe Venenoso', attackBonus: 4, damage: '2d6', damageType: 'veneno', description: 'Alcance 4,5m. Alvo deve ter sucesso em teste CON CD 12 ou fica cego por 1 rodada.' }
    ],
    specialAbilities: ['Furtividade: +4']
  }
];

// Druid spells (full caster, Portuguese)
export const DRUID_SPELLS: Spell[] = [
  // Cantrips (level 0)
  {
    name: 'Chicote de Espinhos',
    level: 0,
    school: 'Transmutação',
    castingTime: '1 ação',
    range: '9 metros',
    duration: 'Instantânea',
    concentration: false,
    description: 'Você cria um chicote de espinhos que açoita o alvo. Faça um ataque mágico corpo a corpo. Se acertar, o alvo sofre 1d6 de dano perfurante. Aumenta para 2d6 no 5º, 3d6 no 11º, 4d6 no 17º.',
    prepared: false
  },
  {
    name: 'Druidismo',
    level: 0,
    school: 'Transmutação',
    castingTime: '1 ação',
    range: '9 metros',
    duration: 'Instantânea',
    concentration: false,
    description: 'Cria um efeito natural inofensivo: prever o clima, fazer uma flor desabrochar, criar efeito sensorial ou acender/apagar uma chama.',
    prepared: false
  },
  {
    name: 'Chama Produzida',
    level: 0,
    school: 'Conjuração',
    castingTime: '1 ação',
    range: 'Pessoal',
    duration: '10 minutos',
    concentration: false,
    description: 'Uma chama aparece na sua mão. Ilumina 3m e escuridão 3m adicionais. Pode arremessá-la para causar 1d8 de dano de fogo.',
    prepared: false
  },
  // 1st level
  {
    name: 'Curar Ferimentos',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação',
    range: 'Toque',
    duration: 'Instantânea',
    concentration: false,
    description: 'Uma criatura que você tocar recupera 1d8 + mod SAB pontos de vida. Não afeta mortos-vivos ou constructos.',
    prepared: false
  },
  {
    name: 'Palavra Curativa',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação bônus',
    range: '18 metros',
    duration: 'Instantânea',
    concentration: false,
    description: 'Uma criatura à sua escolha dentro do alcance recupera 1d4 + mod SAB pontos de vida.',
    prepared: false
  },
  {
    name: 'Detectar Magia',
    level: 1,
    school: 'Adivinhação',
    castingTime: '1 ação',
    range: 'Pessoal',
    duration: 'Concentração, até 10 minutos',
    concentration: true,
    description: 'Você sente a presença de magia a até 9m. Pode usar ação para ver aura e escola de magia em criaturas ou objetos visíveis.',
    prepared: false
  },
  {
    name: 'Falar com Animais',
    level: 1,
    school: 'Adivinhação',
    castingTime: '1 ação',
    range: 'Pessoal',
    duration: '10 minutos',
    concentration: false,
    description: 'Você ganha a habilidade de compreender e se comunicar verbalmente com bestas pela duração.',
    prepared: false
  },
  {
    name: 'Onda Trovejante',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação',
    range: 'Pessoal (4,5m cubo)',
    duration: 'Instantânea',
    concentration: false,
    description: 'Cada criatura num cubo de 4,5m faz teste CON. Falha: 2d8 trovão e empurrada 3m. Sucesso: metade do dano.',
    prepared: false
  },
  {
    name: 'Névoa Obscurecente',
    level: 1,
    school: 'Conjuração',
    castingTime: '1 ação',
    range: '36 metros',
    duration: 'Concentração, até 1 hora',
    concentration: true,
    description: 'Cria uma esfera de névoa de 6m de raio. A área é fortemente obscurecida.',
    prepared: false
  },
  // 2nd level
  {
    name: 'Luar',
    level: 2,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '36 metros',
    duration: 'Concentração, até 1 minuto',
    concentration: true,
    description: 'Luz prateada num cilindro de 1,5m raio, 12m altura. Criatura que entrar: teste CON ou 2d10 radiante. Metamorfos fazem save com desvantagem.',
    prepared: false
  },
  {
    name: 'Metal Escaldante',
    level: 2,
    school: 'Transmutação',
    castingTime: '1 ação',
    range: '18 metros',
    duration: 'Concentração, até 1 minuto',
    concentration: true,
    description: 'Escolha um objeto metálico. Qualquer criatura em contato sofre 2d8 fogo. Não pode soltar o objeto. Dano recorrente com ação bônus.',
    prepared: false
  },
  {
    name: 'Pele de Árvore',
    level: 2,
    school: 'Transmutação',
    castingTime: '1 ação',
    range: 'Toque',
    duration: 'Concentração, até 1 hora',
    concentration: true,
    description: 'Alvo tem CA mínima de 16 enquanto não usar armadura.',
    prepared: false
  },
  {
    name: 'Restauração Menor',
    level: 2,
    school: 'Abjuração',
    castingTime: '1 ação',
    range: 'Toque',
    duration: 'Instantânea',
    concentration: false,
    description: 'Toque uma criatura e termine uma doença ou condição: cego, surdo, paralisado ou envenenado.',
    prepared: false
  },
  // 3rd level
  {
    name: 'Conjurar Animais',
    level: 3,
    school: 'Conjuração',
    castingTime: '1 ação',
    range: '18 metros',
    duration: 'Concentração, até 1 hora',
    concentration: true,
    description: 'Conjura espíritos feéricos em forma de bestas. Escolha: 1 besta ND 2, 2 ND 1, 4 ND 1/2 ou 8 ND 1/4. Obedecem comandos verbais.',
    prepared: false
  },
  {
    name: 'Dissipar Magia',
    level: 3,
    school: 'Abjuração',
    castingTime: '1 ação',
    range: '36 metros',
    duration: 'Instantânea',
    concentration: false,
    description: 'Escolha uma criatura, objeto ou efeito mágico. Magias de 3º nível ou inferior terminam. Para mais alto, teste de habilidade CD 10 + nível da magia.',
    prepared: false
  },
  {
    name: 'Chamar Relâmpagos',
    level: 3,
    school: 'Conjuração',
    castingTime: '1 ação',
    range: '36 metros',
    duration: 'Concentração, até 10 minutos',
    concentration: true,
    description: 'Nuvem de tempestade. Ação: relâmpago num ponto. Criaturas em 1,5m fazem teste DEX: falha 3d10 relâmpago, sucesso metade.',
    prepared: false
  },
  // 4th level
  {
    name: 'Polimorfar',
    level: 4,
    school: 'Transmutação',
    castingTime: '1 ação',
    range: '18 metros',
    duration: 'Concentração, até 1 hora',
    concentration: true,
    description: 'Transforma uma criatura em uma besta de ND igual ou inferior ao nível dela. Assume PV da besta. Ao chegar a 0 PV, reverte.',
    prepared: false
  },
  {
    name: 'Muralha de Fogo',
    level: 4,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '36 metros',
    duration: 'Concentração, até 1 minuto',
    concentration: true,
    description: 'Cria parede de fogo de 18m comprimento, 6m altura, 30cm espessura. Um lado causa 5d8 fogo.',
    prepared: false
  },
  // 5th level
  {
    name: 'Curar',
    level: 5,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '18 metros',
    duration: 'Instantânea',
    concentration: false,
    description: 'Escolha uma criatura. Ela recupera 70 pontos de vida e é curada de cegueira, surdez e doenças.',
    prepared: false
  },
  {
    name: 'Restauração Maior',
    level: 5,
    school: 'Abjuração',
    castingTime: '1 ação',
    range: 'Toque',
    duration: 'Instantânea',
    concentration: false,
    description: 'Encerre um efeito no alvo: redução de atributo, efeito de encantamento, petrificação, maldição ou redução de PV máximo.',
    prepared: false
  },
  // 6th level
  {
    name: 'Curar em Massa',
    level: 6,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '18 metros',
    duration: 'Instantânea',
    concentration: false,
    description: 'Até 6 criaturas à sua escolha dentro do alcance recuperam 3d8 + mod SAB pontos de vida cada.',
    prepared: false
  },
  // 7th level
  {
    name: 'Mudança de Plano',
    level: 7,
    school: 'Conjuração',
    castingTime: '1 ação',
    range: 'Toque',
    duration: 'Instantânea',
    concentration: false,
    description: 'Você e até 8 criaturas voluntárias de mãos dadas são transportados para outro plano de existência.',
    prepared: false
  },
  // 8th level
  {
    name: 'Formas Animais',
    level: 8,
    school: 'Transmutação',
    castingTime: '1 ação',
    range: '9 metros',
    duration: 'Concentração, até 24 horas',
    concentration: true,
    description: 'Até 10 criaturas voluntárias se transformam em bestas de ND 4 ou inferior. Cada uma pode escolher sua forma. PV da besta como PV temporários.',
    prepared: false
  },
  {
    name: 'Debilitar Mente',
    level: 8,
    school: 'Encantamento',
    castingTime: '1 ação',
    range: '45 metros',
    duration: 'Instantânea',
    concentration: false,
    description: 'Alvo faz teste INT: falha 4d6 dano psíquico, INT e CHA ficam 1 por 30 dias. Sucesso: metade do dano, sem efeito adicional.',
    prepared: false
  }
];

// Max beast CR by druid level (Circle of the Moon)
export function getMaxBeastCR(level: number): number {
  if (level >= 15) return 5;
  if (level >= 12) return 4;
  if (level >= 9) return 3;
  if (level >= 6) return 2;
  return 1;
}

// Druid skill options
export const DRUID_SKILL_OPTIONS = [
  'arcana', 'animal_handling', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival'
];
