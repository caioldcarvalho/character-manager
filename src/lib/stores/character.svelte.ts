import type { Character, AbilityScores } from '$lib/types';

function createCharacterStore() {
  let character = $state<Character>({
    name: '',
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    race: null,
    class: null
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
        name: '',
        abilityScores: {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10
        },
        race: null,
        class: null
      };
    }
  };
}

export const characterStore = createCharacterStore();
