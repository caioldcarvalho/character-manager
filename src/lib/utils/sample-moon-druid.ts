import type { Character } from '$lib/types';
import { DND_SKILLS, getProficiencyBonus } from '$lib/constants/dnd';
import { DRUID_MOON_FEATURES } from '$lib/constants/druid';
import { DRUID_SPELLS } from '$lib/constants/druid';
import { FEAT_CATALOG } from '$lib/constants/feats';

export function createSampleMoonDruid(): Character {
  const level = 15;
  const proficiencyBonus = getProficiencyBonus(level);

  // Ability scores: STR 10, DEX 14, CON 16, INT 8, WIS 20, CHA 12
  // (racial bonuses already baked in, empty ability_bonuses on race)
  const abilityScores = {
    strength: 10,
    dexterity: 14,
    constitution: 16,
    intelligence: 8,
    wisdom: 20,
    charisma: 12
  };

  // CON modifier = +3
  // Max HP = 8 + 3 + 14×(5+3) = 8 + 3 + 14×8 = 123
  const maxHP = 123;

  // Initialize skills
  const skills: Record<string, any> = {};
  Object.entries(DND_SKILLS).forEach(([key, skillData]) => {
    skills[key] = {
      ...skillData,
      proficient: ['nature', 'perception', 'survival', 'animal_handling'].includes(key)
    };
  });

  // Build feats
  const warCasterDef = FEAT_CATALOG.find(f => f.id === 'war-caster')!;
  const resilientDef = FEAT_CATALOG.find(f => f.id === 'resilient')!;

  const warCasterFeat = {
    definitionId: warCasterDef.id,
    name: warCasterDef.name,
    description: warCasterDef.description,
    enabled: true,
    modifiers: [...warCasterDef.modifiers],
    proficiencies: [...warCasterDef.proficiencies],
    resources: [...warCasterDef.resources],
    choices: warCasterDef.choices.map(c => ({ ...c, options: [...c.options] }))
  };

  const resilientFeat = {
    definitionId: resilientDef.id,
    name: resilientDef.name,
    description: resilientDef.description,
    enabled: true,
    modifiers: [...resilientDef.modifiers],
    proficiencies: [...resilientDef.proficiencies],
    resources: [...resilientDef.resources],
    choices: resilientDef.choices.map(c => ({
      ...c,
      options: [...c.options],
      selectedOptionId: 'con'
    }))
  };

  return {
    id: `moon-druid-${Date.now()}`,
    name: 'Ixchel Solcrest',
    level,
    abilityScores,
    race: {
      index: 'human',
      name: 'Humano (Variante)',
      speed: 30,
      ability_bonuses: [],
      alignment: 'Neutro bom — protetor da natureza de Ixalan',
      age: 'Humanos atingem a maturidade no final da adolescência e vivem menos de um século.',
      size: 'Médio',
      size_description:
        'Humanos variam muito em altura e compleição. Independente da posição, seu tamanho é Médio.',
      starting_proficiencies: [],
      languages: [
        { index: 'common', name: 'Comum', url: '' },
        { index: 'druidic', name: 'Druídico', url: '' }
      ],
      language_desc: 'Você pode falar, ler e escrever Comum e Druídico.',
      traits: [],
      subraces: []
    },
    class: {
      index: 'druid',
      name: 'Druida',
      hit_die: 8,
      proficiencies: [
        { index: 'light-armor', name: 'Armaduras leves', url: '' },
        { index: 'medium-armor', name: 'Armaduras médias', url: '' },
        { index: 'shields', name: 'Escudos', url: '' },
        { index: 'simple-weapons', name: 'Armas simples', url: '' }
      ],
      saving_throws: [
        { index: 'int', name: 'Inteligência', url: '' },
        { index: 'wis', name: 'Sabedoria', url: '' }
      ],
      url: '/api/classes/druid'
    },
    hitPoints: {
      current: maxHP,
      max: maxHP,
      temporary: 0
    },
    combatStats: {
      initiative: 2, // DEX modifier
      armorClass: 16, // Hide 12 + DEX 2 + Shield 2
      speed: 30,
      proficiencyBonus
    },
    skills,
    spellSlots: {
      level1: { current: 4, max: 4 },
      level2: { current: 3, max: 3 },
      level3: { current: 3, max: 3 },
      level4: { current: 3, max: 3 },
      level5: { current: 2, max: 2 },
      level6: { current: 1, max: 1 },
      level7: { current: 1, max: 1 },
      level8: { current: 1, max: 1 },
      level9: { current: 0, max: 0 },
    },
    knownSpells: [...DRUID_SPELLS],
    preparedSpells: [],
    classFeatures: [...DRUID_MOON_FEATURES],
    fightingStyle: '',
    paladinResources: {
      layOnHands: { current: 0, max: 0 },
      channelDivinity: { current: 0, max: 0 }
    },
    classResources: [],
    weapons: [
      {
        id: 'scimitar-1',
        name: 'Cimitarra',
        type: 'melee',
        damageType: 'slashing',
        damageDice: '1d6',
        properties: ['finesse', 'light'],
        equipped: true,
        finesse: true
      },
      {
        id: 'quarterstaff-1',
        name: 'Bastão',
        type: 'melee',
        damageType: 'bludgeoning',
        damageDice: '1d6',
        properties: ['versatile (1d8)'],
        equipped: false,
        finesse: false
      }
    ],
    savingThrowProficiencies: {
      strength: false, dexterity: false, constitution: false,
      intelligence: true, wisdom: true, charisma: false
    },
    concentratingOn: null,
    psionicDice: undefined,
    wildShape: {
      usesRemaining: 2,
      maxUses: 2,
      activeForm: null
    },
    statusConditions: [],
    deathSaves: { successes: 0, failures: 0, stabilized: false },
    notes: [],
    hitDice: {
      current: level,
      max: level,
      type: 8
    },
    restResources: {},
    inspiration: false,
    spellcastingAbility: 'wisdom',
    isWarlock: false,
    inventory: [
      {
        id: 'hide-armor',
        name: 'Armadura de Couro Batido',
        quantity: 1,
        weight: 12,
        description: 'CA 12 + modificador de Destreza (máx 2). Não contém metal.',
        type: 'armor',
        equipped: true
      },
      {
        id: 'wooden-shield',
        name: 'Escudo de Madeira',
        quantity: 1,
        weight: 6,
        description: '+2 CA. Escudo não-metálico para druidas.',
        type: 'armor',
        equipped: true
      },
      {
        id: 'druidic-focus',
        name: 'Foco Druídico (Totem Solar Ixalan)',
        quantity: 1,
        weight: 1,
        description: 'Totem de madeira esculpido com símbolos do Império Solar de Ixalan. Serve como foco de conjuração.',
        type: 'equipment',
        equipped: true
      }
    ],
    currency: { platinum: 0, gold: 50, silver: 0, copper: 0 },
    cantrips: ['Chicote de Espinhos', 'Druidismo', 'Chama Produzida'],
    feats: [warCasterFeat, resilientFeat],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}
