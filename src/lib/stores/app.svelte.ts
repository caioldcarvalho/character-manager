import type { Character, Skill } from '$lib/types';
import { DND_SKILLS, getProficiencyBonus } from '$lib/constants/dnd';
import { PALADIN_SPELLS } from '$lib/constants/paladin-spells';

interface AppState {
  characters: Character[];
  activeCharacterId: string | null;
  activeTab: string;
  sidebarOpen: boolean;
}

// Initialize default skills
function initializeSkills(proficientSkills: string[] = []): Record<string, Skill> {
  const skills: Record<string, Skill> = {};
  Object.entries(DND_SKILLS).forEach(([key, skillData]) => {
    skills[key] = {
      ...skillData,
      proficient: proficientSkills.includes(key)
    };
  });
  return skills;
}

// Migrate character to add missing fields
function migrateCharacter(char: any): Character {
  const level = char.level || 5;
  const proficiencyBonus = getProficiencyBonus(level);

  return {
    ...char,
    hitPoints: char.hitPoints || { current: 40, max: 40, temporary: 0 },
    combatStats: char.combatStats || {
      initiative: 0,
      armorClass: 16,
      speed: 30,
      proficiencyBonus
    },
    skills: char.skills || initializeSkills([]),
    spellSlots: char.spellSlots || {
      level1: { current: 4, max: 4 },
      level2: { current: 2, max: 2 }
    },
    knownSpells: char.knownSpells || [...PALADIN_SPELLS],
    preparedSpells: char.preparedSpells || [],
    classFeatures: char.classFeatures || [],
    fightingStyle: char.fightingStyle || '',
    paladinResources: char.paladinResources || {
      layOnHands: { current: level * 5, max: level * 5 },
      channelDivinity: { current: 1, max: 1 }
    }
  };
}

function createAppStore() {
  let state = $state<AppState>({
    characters: [],
    activeCharacterId: null,
    activeTab: 'summary',
    sidebarOpen: true
  });

  return {
    get state() {
      return state;
    },
    get activeCharacter(): Character | null {
      return state.characters.find(c => c.id === state.activeCharacterId) || null;
    },
    addCharacter(character: Character) {
      state.characters.push(migrateCharacter(character));
      // Auto-select if it's the first character
      if (state.characters.length === 1) {
        state.activeCharacterId = character.id;
      }
      this.saveToLocalStorage();
    },
    setActiveCharacter(id: string | null) {
      state.activeCharacterId = id;
    },
    setActiveTab(tab: string) {
      state.activeTab = tab;
    },
    toggleSidebar() {
      state.sidebarOpen = !state.sidebarOpen;
    },
    updateCharacter(id: string, updates: Partial<Character>) {
      const index = state.characters.findIndex(c => c.id === id);
      if (index !== -1) {
        state.characters[index] = { ...state.characters[index], ...updates };
        this.saveToLocalStorage();
      }
    },
    deleteCharacter(id: string) {
      state.characters = state.characters.filter(c => c.id !== id);
      if (state.activeCharacterId === id) {
        state.activeCharacterId = state.characters[0]?.id || null;
      }
      this.saveToLocalStorage();
    },

    // HP Management
    updateHP(id: string, current: number, temporary: number = 0) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;

      char.hitPoints.current = Math.max(0, Math.min(current, char.hitPoints.max));
      char.hitPoints.temporary = Math.max(0, temporary);
      this.saveToLocalStorage();
    },

    takeDamage(id: string, damage: number) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;

      let remainingDamage = damage;

      // Temp HP absorbs damage first
      if (char.hitPoints.temporary > 0) {
        if (char.hitPoints.temporary >= remainingDamage) {
          char.hitPoints.temporary -= remainingDamage;
          remainingDamage = 0;
        } else {
          remainingDamage -= char.hitPoints.temporary;
          char.hitPoints.temporary = 0;
        }
      }

      // Apply remaining damage to current HP
      if (remainingDamage > 0) {
        char.hitPoints.current = Math.max(0, char.hitPoints.current - remainingDamage);
      }

      this.saveToLocalStorage();
    },

    heal(id: string, amount: number) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;

      char.hitPoints.current = Math.min(char.hitPoints.max, char.hitPoints.current + amount);
      this.saveToLocalStorage();
    },

    // Spell Slot Management
    updateSpellSlot(id: string, level: 1 | 2, current: number) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;

      const slotKey = `level${level}` as keyof typeof char.spellSlots;
      const maxSlots = char.spellSlots[slotKey].max;
      char.spellSlots[slotKey].current = Math.max(0, Math.min(current, maxSlots));
      this.saveToLocalStorage();
    },

    useSpellSlot(id: string, level: 1 | 2) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;

      const slotKey = `level${level}` as keyof typeof char.spellSlots;
      if (char.spellSlots[slotKey].current > 0) {
        char.spellSlots[slotKey].current--;
        this.saveToLocalStorage();
      }
    },

    toggleSpellPrepared(id: string, spellName: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;

      const spellIndex = char.preparedSpells.indexOf(spellName);
      if (spellIndex > -1) {
        // Unprepare
        char.preparedSpells.splice(spellIndex, 1);
      } else {
        // Prepare
        char.preparedSpells.push(spellName);
      }
      this.saveToLocalStorage();
    },

    // Resource Management
    longRest(id: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;

      // Restore HP
      char.hitPoints.current = char.hitPoints.max;
      char.hitPoints.temporary = 0;

      // Restore spell slots
      char.spellSlots.level1.current = char.spellSlots.level1.max;
      char.spellSlots.level2.current = char.spellSlots.level2.max;

      // Restore class features
      char.classFeatures.forEach(feature => {
        if (feature.uses) {
          feature.uses.current = feature.uses.max;
        }
      });

      // Restore paladin resources
      char.paladinResources.layOnHands.current = char.paladinResources.layOnHands.max;
      char.paladinResources.channelDivinity.current = char.paladinResources.channelDivinity.max;

      this.saveToLocalStorage();
    },

    useClassFeature(id: string, featureName: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;

      const feature = char.classFeatures.find(f => f.name === featureName);
      if (feature?.uses && feature.uses.current > 0) {
        feature.uses.current--;
        this.saveToLocalStorage();
      }
    },

    usePaladinResource(id: string, resource: 'layOnHands' | 'channelDivinity', amount: number = 1) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;

      const res = char.paladinResources[resource];
      if (res.current >= amount) {
        res.current -= amount;
        this.saveToLocalStorage();
      }
    },

    // Skills
    toggleSkillProficiency(id: string, skillKey: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char || !char.skills[skillKey]) return;

      char.skills[skillKey].proficient = !char.skills[skillKey].proficient;
      this.saveToLocalStorage();
    },

    // Persistence
    saveToLocalStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('dnd-characters', JSON.stringify(state.characters));
      }
    },

    loadFromLocalStorage() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('dnd-characters');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            state.characters = parsed.map(migrateCharacter);
            if (state.characters.length > 0 && !state.activeCharacterId) {
              state.activeCharacterId = state.characters[0].id;
            }
          } catch (e) {
            console.error('Failed to load characters from localStorage:', e);
          }
        }
      }
    },

    exportCharacter(id: string): string {
      const char = state.characters.find(c => c.id === id);
      if (!char) return '';
      return JSON.stringify(char, null, 2);
    },

    importCharacter(json: string): { success: boolean; error?: string } {
      try {
        const parsed = JSON.parse(json);
        if (!parsed.id || !parsed.name) {
          return { success: false, error: 'Invalid character data: missing required fields' };
        }

        const migrated = migrateCharacter(parsed);
        state.characters.push(migrated);
        state.activeCharacterId = migrated.id;
        this.saveToLocalStorage();

        return { success: true };
      } catch (e) {
        return { success: false, error: 'Invalid JSON format' };
      }
    }
  };
}

export const appStore = createAppStore();
