import type { Skill, ClassFeature, AbilityScores } from '$lib/types';

// D&D 5e Skills with ability mappings
export const DND_SKILLS: Record<string, Omit<Skill, 'proficient'>> = {
  acrobatics: { name: 'Acrobacia', ability: 'dexterity' },
  animalHandling: { name: 'Lidar com Animais', ability: 'wisdom' },
  arcana: { name: 'Arcanismo', ability: 'intelligence' },
  athletics: { name: 'Atletismo', ability: 'strength' },
  deception: { name: 'Enganação', ability: 'charisma' },
  history: { name: 'História', ability: 'intelligence' },
  insight: { name: 'Intuição', ability: 'wisdom' },
  intimidation: { name: 'Intimidação', ability: 'charisma' },
  investigation: { name: 'Investigação', ability: 'intelligence' },
  medicine: { name: 'Medicina', ability: 'wisdom' },
  nature: { name: 'Natureza', ability: 'intelligence' },
  perception: { name: 'Percepção', ability: 'wisdom' },
  performance: { name: 'Atuação', ability: 'charisma' },
  persuasion: { name: 'Persuasão', ability: 'charisma' },
  religion: { name: 'Religião', ability: 'intelligence' },
  sleightOfHand: { name: 'Prestidigitação', ability: 'dexterity' },
  stealth: { name: 'Furtividade', ability: 'dexterity' },
  survival: { name: 'Sobrevivência', ability: 'wisdom' }
};

// Paladin skill options
export const PALADIN_SKILL_OPTIONS = [
  'athletics',
  'insight',
  'intimidation',
  'medicine',
  'persuasion',
  'religion'
];

// Paladin fighting styles
export const PALADIN_FIGHTING_STYLES = [
  {
    name: 'Defesa',
    description: 'Enquanto estiver usando armadura, você ganha +1 de bônus em CA.'
  },
  {
    name: 'Duelo',
    description: 'Quando você empunha uma arma corpo a corpo em uma mão e nenhuma outra arma, você ganha +2 de bônus nas jogadas de dano com essa arma.'
  },
  {
    name: 'Luta com Arma Grande',
    description: 'Quando você rolar 1 ou 2 num dado de dano de um ataque com arma corpo a corpo empunhada com duas mãos, você pode rolar o dado novamente e usar a nova rolagem. A arma deve ter a propriedade duas mãos ou versátil.'
  },
  {
    name: 'Proteção',
    description: 'Quando uma criatura que você possa ver ataca um alvo que esteja a até 1,5m de você, você pode usar sua reação para impor desvantagem na jogada de ataque. Você deve estar empunhando um escudo.'
  }
];

// Level 5 Paladin class features
export const LEVEL_5_PALADIN_FEATURES: ClassFeature[] = [
  {
    name: 'Sentido Divino',
    description: 'A presença de um mal poderoso é registrada nos seus sentidos como um odor nocivo e um bem poderoso toca seus ouvidos como música celestial. Com uma ação, você pode expandir sua consciência para detectar tais forças. Até o final do seu próximo turno, você sabe a localização de qualquer celestial, corruptor ou morto-vivo a até 18 metros de você que não esteja com cobertura total.',
    level: 1,
    uses: { current: 5, max: 5 } // 1 + CHA modifier (assuming +2)
  },
  {
    name: 'Cura pelas Mãos',
    description: 'Seu toque abençoado pode curar ferimentos. Você possui uma reserva de poder curativo que se enche quando você faz um descanso longo. Com essa reserva, você pode restaurar um total de pontos de vida igual ao seu nível de paladino x 5.',
    level: 1
    // Uses tracked separately in paladinResources
  },
  {
    name: 'Estilo de Luta',
    description: 'Você adota um estilo de combate particular que será sua especialidade.',
    level: 2
  },
  {
    name: 'Conjuração',
    description: 'Você aprendeu a extrair magia divina através de meditação e oração para conjurar magias, como um clérigo faz.',
    level: 2
  },
  {
    name: 'Destruição Divina',
    description: 'Quando você acertar uma criatura com um ataque corpo a corpo com arma, você pode gastar um espaço de magia de paladino para causar dano radiante no alvo, além do dano normal da arma. O dano extra é 2d8 para um espaço de magia de 1º nível, mais 1d8 para cada nível de magia acima do 1º, até o máximo de 5d8.',
    level: 2
  },
  {
    name: 'Saúde Divina',
    description: 'A magia divina fluindo através de você o torna imune a doenças.',
    level: 3
  },
  {
    name: 'Canalizar Divindade',
    description: 'Você ganha a habilidade de canalizar energia divina diretamente de sua divindade, usando essa energia para abastecer efeitos mágicos. Você começa com um efeito: Voto de Inimizade.',
    level: 3,
    uses: { current: 1, max: 1 }
  },
  {
    name: 'Voto de Inimizade',
    description: 'Como uma ação bônus, você profere um voto de inimizade contra uma criatura que você possa ver a até 3 metros de você, usando seu Canalizar Divindade. Você ganha vantagem em jogadas de ataque contra essa criatura por 1 minuto ou até ela cair a 0 pontos de vida ou ficar inconsciente.',
    level: 3
  },
  {
    name: 'Incremento no Valor de Habilidade',
    description: 'Você pode aumentar um valor de habilidade à sua escolha em 2 ou pode aumentar dois valores de habilidade à sua escolha em 1. Você não pode elevar um valor de habilidade acima de 20 usando essa característica.',
    level: 4
  },
  {
    name: 'Ataque Adicional',
    description: 'Você pode atacar duas vezes, ao invés de uma, sempre que você realizar a ação de Ataque durante seu turno.',
    level: 5
  }
];

// Calculate proficiency bonus based on level
export function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

// Calculate Paladin max HP
export function calculatePaladinMaxHP(level: number, conModifier: number): number {
  // First level: 10 + CON modifier
  // Each additional level: d10 (average 6) + CON modifier
  return 10 + conModifier + (level - 1) * (6 + conModifier);
}

// D&D 5e Conditions
export const DND_CONDITIONS = [
  {
    name: 'Cego',
    description: 'Falha automaticamente em testes que requerem visão. Ataques contra você têm vantagem. Seus ataques têm desvantagem.',
    icon: '👁️'
  },
  {
    name: 'Surdo',
    description: 'Falha automaticamente em testes que requerem audição.',
    icon: '🔇'
  },
  {
    name: 'Amedrontado',
    description: 'Desvantagem em testes de atributo e ataques enquanto a fonte do medo estiver em seu campo de visão. Não pode se mover voluntariamente para perto da fonte.',
    icon: '😨'
  },
  {
    name: 'Agarrado',
    description: 'Velocidade se torna 0 e não pode se beneficiar de bônus de velocidade. Condição termina se o agarrador estiver incapacitado.',
    icon: '🤝'
  },
  {
    name: 'Incapacitado',
    description: 'Não pode realizar ações ou reações.',
    icon: '💫'
  },
  {
    name: 'Invisível',
    description: 'Impossível de ver sem auxílio de magia ou sentido especial. Ataques contra você têm desvantagem. Seus ataques têm vantagem.',
    icon: '👻'
  },
  {
    name: 'Paralisado',
    description: 'Incapacitado, não pode se mover ou falar. Falha automaticamente em testes de Força e Destreza. Ataques contra você têm vantagem. Qualquer ataque que acerte é crítico se estiver a 1,5m.',
    icon: '🥶'
  },
  {
    name: 'Petrificado',
    description: 'Transformado em substância sólida inanimada junto com objetos não-mágicos que estiver vestindo ou carregando. Peso multiplicado por 10. Resistência a todo dano. Imune a veneno e doença.',
    icon: '🗿'
  },
  {
    name: 'Envenenado',
    description: 'Desvantagem em jogadas de ataque e testes de atributo.',
    icon: '☠️'
  },
  {
    name: 'Caído',
    description: 'Só pode rastejar ou levantar (gasta metade do movimento). Desvantagem em ataques. Ataques corpo a corpo contra você têm vantagem. Ataques à distância têm desvantagem.',
    icon: '🤕'
  },
  {
    name: 'Contido',
    description: 'Velocidade 0. Ataques contra você têm vantagem. Seus ataques têm desvantagem. Desvantagem em Destreza.',
    icon: '⛓️'
  },
  {
    name: 'Atordoado',
    description: 'Incapacitado, não pode se mover e fala apenas hesitantemente. Falha automaticamente em testes de Força e Destreza. Ataques contra você têm vantagem.',
    icon: '😵'
  },
  {
    name: 'Inconsciente',
    description: 'Incapacitado, não pode se mover ou falar e está inconsciente do entorno. Solta o que estiver segurando e cai. Falha em testes de Força e Destreza. Ataques têm vantagem. Qualquer ataque que acerte é crítico se estiver a 1,5m.',
    icon: '😴'
  },
  {
    name: 'Exausto',
    description: 'Níveis crescentes de penalidades. Nível 1: Desvantagem em testes. Nível 2: Velocidade reduzida pela metade. Nível 3: Desvantagem em ataques e salvamentos. Nível 4: HP máximo reduzido pela metade. Nível 5: Velocidade reduzida a 0. Nível 6: Morte.',
    icon: '😫'
  }
];
