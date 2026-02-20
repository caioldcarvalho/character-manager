import type { Character } from '$lib/types';
import { DND_SKILLS, getProficiencyBonus } from '$lib/constants/dnd';
import { FIGHTER_FEATURES, PSI_WARRIOR_FEATURES, getPsionicDieSize } from '$lib/constants/fighter';

export function createSamplePsiWarrior(): Character {
  const level = 12;
  const proficiencyBonus = getProficiencyBonus(level);

  // Ability scores: STR 18, DEX 14, CON 16, INT 14, WIS 10, CHA 8
  const abilityScores = {
    strength: 18,
    dexterity: 14,
    constitution: 16,
    intelligence: 14,
    wisdom: 10,
    charisma: 8
  };

  // CON modifier = +3
  // Max HP = 10 + 3 + 11×(6+3) = 10 + 3 + 11×9 = 112
  const maxHP = 112;

  // Initialize skills with Athletics and Perception proficient
  const skills: Record<string, any> = {};
  Object.entries(DND_SKILLS).forEach(([key, skillData]) => {
    skills[key] = {
      ...skillData,
      proficient: key === 'athletics' || key === 'perception'
    };
  });

  // Psionic Dice: 2 × proficiency bonus (2 × 4 = 8), d10 at level 12
  const psionicDiceMax = 2 * proficiencyBonus;

  return {
    id: `psi-warrior-${Date.now()}`,
    name: 'Kael Ironmind',
    level,
    abilityScores,
    race: {
      index: 'human',
      name: 'Humano',
      speed: 30,
      ability_bonuses: [
        { ability_score: { index: 'str', name: 'STR', url: '' }, bonus: 1 },
        { ability_score: { index: 'int', name: 'INT', url: '' }, bonus: 1 }
      ],
      alignment: 'Humanos não tendem a nenhum alinhamento em particular',
      age: 'Humanos atingem a maturidade no final da adolescência e vivem menos de um século.',
      size: 'Médio',
      size_description:
        'Humanos variam muito em altura e compleição, de 1,50 m a 1,80 m. Independente da sua posição, seu tamanho é Médio.',
      starting_proficiencies: [],
      languages: [
        { index: 'common', name: 'Comum', url: '' }
      ],
      language_desc:
        'Você pode falar, ler e escrever Comum.',
      traits: [],
      subraces: []
    },
    class: {
      index: 'fighter',
      name: 'Guerreiro',
      hit_die: 10,
      proficiencies: [
        { index: 'all-armor', name: 'Todas as armaduras', url: '' },
        { index: 'shields', name: 'Escudos', url: '' },
        { index: 'simple-weapons', name: 'Armas simples', url: '' },
        { index: 'martial-weapons', name: 'Armas marciais', url: '' }
      ],
      saving_throws: [
        { index: 'str', name: 'Força', url: '' },
        { index: 'con', name: 'Constituição', url: '' }
      ],
      url: '/api/classes/fighter'
    },
    hitPoints: {
      current: maxHP,
      max: maxHP,
      temporary: 0
    },
    combatStats: {
      initiative: 2, // DEX modifier
      armorClass: 18, // Plate armor + Defense fighting style
      speed: 30,
      proficiencyBonus
    },
    skills,
    spellSlots: {
      level1: { current: 0, max: 0 },
      level2: { current: 0, max: 0 },
      level3: { current: 0, max: 0 },
      level4: { current: 0, max: 0 },
      level5: { current: 0, max: 0 },
      level6: { current: 0, max: 0 },
      level7: { current: 0, max: 0 },
      level8: { current: 0, max: 0 },
      level9: { current: 0, max: 0 },
    },
    knownSpells: [],
    preparedSpells: [],
    classFeatures: [
      ...FIGHTER_FEATURES,
      ...PSI_WARRIOR_FEATURES
    ],
    fightingStyle: 'Defesa',
    paladinResources: {
      layOnHands: { current: 0, max: 0 },
      channelDivinity: { current: 0, max: 0 }
    },
    classResources: [
      {
        name: 'Retomar o Fôlego',
        current: 1,
        max: 1,
        rechargeOn: 'short',
        description: 'Ação bônus: recupera 1d10 + 12 de HP.'
      },
      {
        name: 'Surto de Ação',
        current: 1,
        max: 1,
        rechargeOn: 'short',
        description: 'Uma ação adicional em seu turno.'
      },
      {
        name: 'Indomável',
        current: 1,
        max: 1,
        rechargeOn: 'long',
        description: 'Refaz um teste de resistência que falhou.'
      }
    ],
    psionicDice: {
      current: psionicDiceMax,
      max: psionicDiceMax,
      dieSize: getPsionicDieSize(level)
    },
    weapons: [
      {
        id: 'greatsword-1',
        name: 'Espada Grande',
        type: 'melee',
        damageType: 'slashing',
        damageDice: '2d6',
        properties: ['two-handed'],
        equipped: true,
        finesse: false
      },
      {
        id: 'longbow-1',
        name: 'Arco Longo',
        type: 'ranged',
        damageType: 'piercing',
        damageDice: '1d8',
        properties: ['ammunition (range 150/600)', 'heavy', 'two-handed'],
        equipped: false,
        finesse: false,
        range: '150/600 pés'
      }
    ],
    savingThrowProficiencies: {
      strength: true, dexterity: false, constitution: true,
      intelligence: false, wisdom: false, charisma: false
    },
    concentratingOn: null,
    statusConditions: [],
    deathSaves: { successes: 0, failures: 0, stabilized: false },
    notes: [],
    hitDice: {
      current: level,
      max: level,
      type: 10
    },
    restResources: {},
    inspiration: false,
    spellcastingAbility: null,
    isWarlock: false,
    inventory: [],
    currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
    createdAt: new Date(),
    updatedAt: new Date()
  };
}
