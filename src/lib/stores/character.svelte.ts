import type { Character, AbilityScores } from '$lib/types';
import { DND_SKILLS } from '$lib/constants/dnd';

function generateId(): string {
  return `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getDefaultCharacter(): Character {
  const skills: Record<string, any> = {};
  Object.entries(DND_SKILLS).forEach(([key, skillData]) => {
    skills[key] = { ...skillData, proficient: false };
  });

  return {
    id: generateId(),
    name: '',
    level: 1,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    race: null,
    class: null,
    hitPoints: { current: 10, max: 10, temporary: 0 },
    combatStats: { initiative: 0, armorClass: 10, speed: 30, proficiencyBonus: 2 },
    skills,
    spellSlots: { level1: { current: 0, max: 0 }, level2: { current: 0, max: 0 } },
    knownSpells: [],
    preparedSpells: [],
    classFeatures: [],
    fightingStyle: '',
    paladinResources: { layOnHands: { current: 0, max: 0 }, channelDivinity: { current: 0, max: 0 } },
    weapons: [],
    statusConditions: [],
    deathSaves: { successes: 0, failures: 0, stabilized: false },
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

function createCharacterStore() {
  let character = $state<Character>(getDefaultCharacter());

  return {
    get character() {
      return character;
    },
    setName(name: string) {
      character.name = name;
    },
    setAbilityScores(scores: AbilityScores) {
      character.abilityScores = scores;
    },
    setRace(race: any) {
      character.race = race;
    },
    setClass(characterClass: any) {
      character.class = characterClass;
    },
    reset() {
      character = getDefaultCharacter();
    },
    getCharacter() {
      return { ...character };
    }
  };
}

export const characterStore = createCharacterStore();
