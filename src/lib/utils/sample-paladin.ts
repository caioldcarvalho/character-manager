import type { Character } from '$lib/types';
import { DND_SKILLS, LEVEL_5_PALADIN_FEATURES, getProficiencyBonus } from '$lib/constants/dnd';
import { PALADIN_SPELLS } from '$lib/constants/paladin-spells';

export function createSamplePaladin(): Character {
  const level = 5;
  const proficiencyBonus = getProficiencyBonus(level);

  // Ability scores: STR 16, DEX 10, CON 14, INT 8, WIS 12, CHA 14
  const abilityScores = {
    strength: 16,
    dexterity: 10,
    constitution: 14,
    intelligence: 8,
    wisdom: 12,
    charisma: 14
  };

  // CON modifier = +2
  // Max HP = 10 + 2 (CON) + 4×(6+2) = 44
  const maxHP = 44;

  // Initialize skills with Athletics and Persuasion proficient
  const skills: Record<string, any> = {};
  Object.entries(DND_SKILLS).forEach(([key, skillData]) => {
    skills[key] = {
      ...skillData,
      proficient: key === 'athletics' || key === 'persuasion'
    };
  });

  return {
    id: `paladin-${Date.now()}`,
    name: 'Sir Aldric',
    level,
    abilityScores,
    race: {
      index: 'human',
      name: 'Humano',
      speed: 30,
      ability_bonuses: [
        { ability_score: { index: 'str', name: 'STR', url: '' }, bonus: 1 },
        { ability_score: { index: 'cha', name: 'CHA', url: '' }, bonus: 1 }
      ],
      alignment: 'Humanos não tendem a nenhum alinhamento em particular',
      age: 'Humanos atingem a maturidade no final da adolescência e vivem menos de um século.',
      size: 'Médio',
      size_description:
        'Humanos variam muito em altura e compleição, de 1,50 m a 1,80 m. Independente da sua posição, seu tamanho é Médio.',
      starting_proficiencies: [],
      languages: [
        { index: 'common', name: 'Comum', url: '' },
        { index: 'elvish', name: 'Élfico', url: '' }
      ],
      language_desc:
        'Você pode falar, ler e escrever Comum e um idioma extra de sua escolha.',
      traits: [],
      subraces: []
    },
    class: {
      index: 'paladin',
      name: 'Paladino',
      hit_die: 10,
      proficiencies: [
        { index: 'all-armor', name: 'Todas as armaduras', url: '' },
        { index: 'shields', name: 'Escudos', url: '' },
        { index: 'simple-weapons', name: 'Armas simples', url: '' },
        { index: 'martial-weapons', name: 'Armas marciais', url: '' }
      ],
      saving_throws: [
        { index: 'wis', name: 'Sabedoria', url: '' },
        { index: 'cha', name: 'Carisma', url: '' }
      ],
      url: '/api/classes/paladin'
    },
    hitPoints: {
      current: maxHP,
      max: maxHP,
      temporary: 0
    },
    combatStats: {
      initiative: 0, // DEX modifier
      armorClass: 18, // Plate armor + Defense fighting style
      speed: 30,
      proficiencyBonus
    },
    skills,
    spellSlots: {
      level1: { current: 4, max: 4 },
      level2: { current: 2, max: 2 }
    },
    knownSpells: [...PALADIN_SPELLS],
    preparedSpells: [], // Player can prepare up to CHA mod + half level = 4 spells
    classFeatures: [...LEVEL_5_PALADIN_FEATURES],
    fightingStyle: 'Defesa',
    paladinResources: {
      layOnHands: { current: level * 5, max: level * 5 }, // 25 HP pool
      channelDivinity: { current: 1, max: 1 }
    },
    weapons: [
      {
        id: 'longsword-1',
        name: 'Espada Longa',
        type: 'melee',
        damageType: 'slashing',
        damageDice: '1d8',
        properties: ['versatile (1d10)'],
        equipped: true,
        finesse: false
      },
      {
        id: 'javelin-1',
        name: 'Azagaia',
        type: 'ranged',
        damageType: 'piercing',
        damageDice: '1d6',
        properties: ['thrown (range 30/120)'],
        equipped: false,
        finesse: false,
        range: '30/120 pés'
      }
    ],
    statusConditions: [],
    deathSaves: { successes: 0, failures: 0, stabilized: false },
    createdAt: new Date(),
    updatedAt: new Date()
  };
}
