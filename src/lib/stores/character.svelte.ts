import type { Character, AbilityScores } from '$lib/types';

function generateId(): string {
  return `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createCharacterStore() {
  let character = $state<Character>({
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
    createdAt: new Date(),
    updatedAt: new Date()
  });

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
      character = {
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
        createdAt: new Date(),
        updatedAt: new Date()
      };
    },
    getCharacter() {
      return { ...character };
    }
  };
}

export const characterStore = createCharacterStore();
