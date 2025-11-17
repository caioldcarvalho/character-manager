export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  abilityScores: AbilityScores;
  race: Race | null;
  class: CharacterClass | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface APIReference {
  index: string;
  name: string;
  url: string;
}

export interface AbilityBonus {
  ability_score: APIReference;
  bonus: number;
}

export interface Trait {
  index: string;
  name: string;
  url: string;
}

export interface Race {
  index: string;
  name: string;
  speed: number;
  ability_bonuses: AbilityBonus[];
  alignment: string;
  age: string;
  size: string;
  size_description: string;
  starting_proficiencies: APIReference[];
  languages: APIReference[];
  language_desc: string;
  traits: Trait[];
  subraces: APIReference[];
}

export interface CharacterClass {
  index: string;
  name: string;
  hit_die: number;
  proficiencies: APIReference[];
  saving_throws: APIReference[];
  url: string;
}
