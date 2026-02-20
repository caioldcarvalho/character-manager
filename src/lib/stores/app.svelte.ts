import type { Character, Skill, CharacterFeat } from '$lib/types';
import { DND_SKILLS, getProficiencyBonus } from '$lib/constants/dnd';
import { PALADIN_SPELLS } from '$lib/constants/paladin-spells';
import { MOON_DRUID_BEAST_FORMS } from '$lib/constants/druid';

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

// Derive saving throw proficiencies from class API data
function deriveSavingThrowProficiencies(char: any): Record<string, boolean> {
  const profs: Record<string, boolean> = {
    strength: false,
    dexterity: false,
    constitution: false,
    intelligence: false,
    wisdom: false,
    charisma: false
  };

  const indexToAbility: Record<string, string> = {
    str: 'strength', dex: 'dexterity', con: 'constitution',
    int: 'intelligence', wis: 'wisdom', cha: 'charisma'
  };

  if (char.class?.saving_throws) {
    for (const st of char.class.saving_throws) {
      const ability = indexToAbility[st.index];
      if (ability) profs[ability] = true;
    }
  }

  return profs;
}

// Migrate spell slots to dynamic format
function migrateSpellSlots(slots: any): Record<string, { current: number; max: number }> {
  if (!slots) return { level1: { current: 0, max: 0 } };
  return slots;
}

// Migrate character to add missing fields
function migrateCharacter(char: any): Character {
  const level = char.level || 5;
  const proficiencyBonus = getProficiencyBonus(level);

  // Get hit dice type from class
  const hitDiceType = char.class?.hit_die || 10;

  // Detect warlock
  const isWarlock = char.isWarlock ?? (char.class?.index === 'warlock');

  // Default spellcasting ability based on class
  const defaultSpellcastingAbility = (() => {
    const classIndex = char.class?.index;
    if (!classIndex) return null;
    const map: Record<string, 'charisma' | 'intelligence' | 'wisdom'> = {
      paladin: 'charisma', bard: 'charisma', sorcerer: 'charisma', warlock: 'charisma',
      wizard: 'intelligence',
      cleric: 'wisdom', druid: 'wisdom', ranger: 'wisdom',
    };
    return map[classIndex] || null;
  })();

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
    spellSlots: migrateSpellSlots(char.spellSlots),
    knownSpells: char.knownSpells || [...PALADIN_SPELLS],
    preparedSpells: char.preparedSpells || [],
    classFeatures: char.classFeatures || [],
    fightingStyle: char.fightingStyle || '',
    paladinResources: char.paladinResources || {
      layOnHands: { current: level * 5, max: level * 5 },
      channelDivinity: { current: 1, max: 1 }
    },
    classResources: char.classResources || [],
    savingThrowProficiencies: char.savingThrowProficiencies || deriveSavingThrowProficiencies(char),
    concentratingOn: char.concentratingOn ?? null,
    psionicDice: char.psionicDice || undefined,
    wildShape: char.wildShape || undefined,
    weapons: char.weapons || [],
    statusConditions: char.statusConditions || [],
    deathSaves: char.deathSaves || { successes: 0, failures: 0, stabilized: false },

    // New fields with defaults
    notes: char.notes || [],
    hitDice: char.hitDice || {
      current: level,
      max: level,
      type: hitDiceType
    },
    restResources: char.restResources || {
      lastShortRest: undefined,
      lastLongRest: undefined
    },
    inspiration: char.inspiration || false,

    // Spellcasting
    spellcastingAbility: char.spellcastingAbility ?? defaultSpellcastingAbility,
    isWarlock,

    // Inventory & currency
    inventory: char.inventory || [],
    currency: char.currency || { platinum: 0, gold: 0, silver: 0, copper: 0 },
    cantrips: char.cantrips || undefined,
    feats: char.feats || []
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
      // Always select the newly added character
      state.activeCharacterId = character.id;
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
    replaceCharacter(id: string, newData: Character) {
      const index = state.characters.findIndex(c => c.id === id);
      if (index !== -1) {
        state.characters[index] = migrateCharacter(newData);
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

      // Reset death saves when healed above 0
      if (char.hitPoints.current > 0) {
        char.deathSaves = { successes: 0, failures: 0, stabilized: false };
      }

      this.saveToLocalStorage();
    },

    // Spell Slot Management
    updateSpellSlot(id: string, level: number, current: number) {
      const char = state.characters.find(c => c.id === id);
      if (!char || level < 1 || level > 9) return;

      const slotKey = `level${level}`;
      if (!char.spellSlots[slotKey]) return;
      const maxSlots = char.spellSlots[slotKey].max;
      char.spellSlots[slotKey].current = Math.max(0, Math.min(current, maxSlots));
      this.saveToLocalStorage();
    },

    useSpellSlot(id: string, level: number) {
      const char = state.characters.find(c => c.id === id);
      if (!char || level < 1 || level > 9) return;

      const slotKey = `level${level}`;
      if (char.spellSlots[slotKey] && char.spellSlots[slotKey].current > 0) {
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

    useClassResource(id: string, resourceName: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;

      const resource = char.classResources.find(r => r.name === resourceName);
      if (resource && resource.current > 0) {
        resource.current--;
        this.saveToLocalStorage();
      }
    },

    usePsionicDie(id: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char || !char.psionicDice) return;

      if (char.psionicDice.current > 0) {
        char.psionicDice.current--;
        this.saveToLocalStorage();
      }
    },

    recoverPsionicDie(id: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char || !char.psionicDice) return;

      if (char.psionicDice.current < char.psionicDice.max) {
        char.psionicDice.current++;
        this.saveToLocalStorage();
      }
    },

    // Wild Shape
    useWildShape(id: string, formId: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char || !char.wildShape) return;

      const formDef = MOON_DRUID_BEAST_FORMS.find(f => f.id === formId);
      if (!formDef) return;

      const cost = formDef.isElemental ? 2 : 1;
      if (char.wildShape.usesRemaining < cost) return;

      char.wildShape.usesRemaining -= cost;
      char.wildShape.activeForm = {
        formId: formDef.id,
        name: formDef.name,
        nameIxalan: formDef.nameIxalan,
        cr: formDef.cr,
        currentHP: formDef.maxHP,
        maxHP: formDef.maxHP,
        armorClass: formDef.armorClass,
        speed: formDef.speed,
        attacks: [...formDef.attacks],
        specialAbilities: [...formDef.specialAbilities],
        isElemental: formDef.isElemental
      };
      this.saveToLocalStorage();
    },

    revertWildShape(id: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char || !char.wildShape) return;

      char.wildShape.activeForm = null;
      this.saveToLocalStorage();
    },

    takeBeastDamage(id: string, damage: number) {
      const char = state.characters.find(c => c.id === id);
      if (!char || !char.wildShape?.activeForm) return;

      const form = char.wildShape.activeForm;
      const remaining = form.currentHP - damage;

      if (remaining <= 0) {
        // Overflow damage to humanoid HP
        const overflow = Math.abs(remaining);
        char.wildShape.activeForm = null;
        char.hitPoints.current = Math.max(0, char.hitPoints.current - overflow);
      } else {
        form.currentHP = remaining;
      }
      this.saveToLocalStorage();
    },

    healBeastForm(id: string, amount: number) {
      const char = state.characters.find(c => c.id === id);
      if (!char || !char.wildShape?.activeForm) return;

      const form = char.wildShape.activeForm;
      form.currentHP = Math.min(form.maxHP, form.currentHP + amount);
      this.saveToLocalStorage();
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
    },

    // Weapons
    addWeapon(id: string, weapon: any) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;
      char.weapons.push(weapon);
      this.saveToLocalStorage();
    },

    removeWeapon(id: string, weaponId: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;
      char.weapons = char.weapons.filter(w => w.id !== weaponId);
      this.saveToLocalStorage();
    },

    toggleWeaponEquipped(id: string, weaponId: string) {
      const char = state.characters.find(c => c.id === id);
      const weapon = char?.weapons.find(w => w.id === weaponId);
      if (weapon) {
        weapon.equipped = !weapon.equipped;
        this.saveToLocalStorage();
      }
    },

    // Status Conditions
    toggleStatusCondition(id: string, conditionName: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;

      const index = char.statusConditions.indexOf(conditionName);
      if (index > -1) {
        char.statusConditions.splice(index, 1);
      } else {
        char.statusConditions.push(conditionName);
      }
      this.saveToLocalStorage();
    },

    clearStatusConditions(id: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;
      char.statusConditions = [];
      this.saveToLocalStorage();
    },

    // Death Saves
    recordDeathSave(id: string, type: 'success' | 'failure') {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;

      if (type === 'success') {
        char.deathSaves.successes = Math.min(3, char.deathSaves.successes + 1);
        if (char.deathSaves.successes >= 3) char.deathSaves.stabilized = true;
      } else {
        char.deathSaves.failures = Math.min(3, char.deathSaves.failures + 1);
      }
      this.saveToLocalStorage();
    },

    removeDeathSave(id: string, type: 'success' | 'failure') {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;

      if (type === 'success') {
        char.deathSaves.successes = Math.max(0, char.deathSaves.successes - 1);
        if (char.deathSaves.successes < 3) char.deathSaves.stabilized = false;
      } else {
        char.deathSaves.failures = Math.max(0, char.deathSaves.failures - 1);
      }
      this.saveToLocalStorage();
    },

    resetDeathSaves(id: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;
      char.deathSaves = { successes: 0, failures: 0, stabilized: false };
      this.saveToLocalStorage();
    },

    // Note management
    addNote(characterId: string, note: import('$lib/types').Note) {
      const char = state.characters.find(c => c.id === characterId);
      if (!char) return;

      char.notes = [...(char.notes || []), note];
      char.updatedAt = new Date();
      this.saveToLocalStorage();
    },

    updateNote(characterId: string, noteId: string, updates: Partial<import('$lib/types').Note>) {
      const char = state.characters.find(c => c.id === characterId);
      if (!char) return;

      char.notes = char.notes.map(note =>
        note.id === noteId
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      );
      char.updatedAt = new Date();
      this.saveToLocalStorage();
    },

    deleteNote(characterId: string, noteId: string) {
      const char = state.characters.find(c => c.id === characterId);
      if (!char) return;

      char.notes = char.notes.filter(note => note.id !== noteId);
      char.updatedAt = new Date();
      this.saveToLocalStorage();
    },

    toggleNotePin(characterId: string, noteId: string) {
      const char = state.characters.find(c => c.id === characterId);
      if (!char) return;

      char.notes = char.notes.map(note =>
        note.id === noteId
          ? { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() }
          : note
      );
      this.saveToLocalStorage();
    },

    // Rest management
    shortRest(characterId: string, diceSpent: number, healing: number) {
      const char = state.characters.find(c => c.id === characterId);
      if (!char) return;

      // Heal HP
      char.hitPoints.current = Math.min(
        char.hitPoints.current + healing,
        char.hitPoints.max
      );

      // Spend hit dice
      char.hitDice.current = Math.max(0, char.hitDice.current - diceSpent);

      // Recover short-rest resources
      char.classResources?.forEach(res => {
        if (res.rechargeOn === 'short') {
          res.current = res.max;
        }
      });

      // Warlock: restore all spell slots on short rest (Pact Magic)
      if (char.isWarlock) {
        Object.keys(char.spellSlots).forEach(key => {
          const slotKey = key as keyof typeof char.spellSlots;
          char.spellSlots[slotKey].current = char.spellSlots[slotKey].max;
        });
      }

      // Recover Wild Shape uses
      if (char.wildShape) {
        char.wildShape.usesRemaining = char.wildShape.maxUses;
        char.wildShape.activeForm = null;
      }

      // Recover feat short-rest resources
      char.feats?.forEach(feat => {
        if (!feat.enabled) return;
        feat.resources.forEach(res => {
          if (res.rechargeOn === 'short') res.current = res.max;
        });
      });

      // Update timestamp
      char.restResources.lastShortRest = new Date().toISOString();

      char.updatedAt = new Date();
      this.saveToLocalStorage();
    },

    longRest(characterId: string) {
      const char = state.characters.find(c => c.id === characterId);
      if (!char) return;

      // Restore HP
      char.hitPoints.current = char.hitPoints.max;
      char.hitPoints.temporary = 0;

      // Restore spell slots
      Object.keys(char.spellSlots).forEach(key => {
        const slotKey = key as keyof typeof char.spellSlots;
        char.spellSlots[slotKey].current = char.spellSlots[slotKey].max;
      });

      // Restore hit dice (half, min 1)
      const diceRestored = Math.max(1, Math.floor(char.hitDice.max / 2));
      char.hitDice.current = Math.min(
        char.hitDice.current + diceRestored,
        char.hitDice.max
      );

      // Restore class features
      if (char.paladinResources) {
        char.paladinResources.layOnHands.current = char.paladinResources.layOnHands.max;
        char.paladinResources.channelDivinity.current = char.paladinResources.channelDivinity.max;
      }

      char.classFeatures.forEach(feature => {
        if (feature.uses) {
          feature.uses.current = feature.uses.max;
        }
      });

      // Restore all class resources
      char.classResources?.forEach(res => {
        res.current = res.max;
      });

      // Restore all psionic dice
      if (char.psionicDice) {
        char.psionicDice.current = char.psionicDice.max;
      }

      // Restore Wild Shape uses
      if (char.wildShape) {
        char.wildShape.usesRemaining = char.wildShape.maxUses;
        char.wildShape.activeForm = null;
      }

      // Reset death saves
      char.deathSaves = { successes: 0, failures: 0, stabilized: false };

      // Recover feat resources (both short and long rest)
      char.feats?.forEach(feat => {
        if (!feat.enabled) return;
        feat.resources.forEach(res => {
          res.current = res.max;
        });
      });

      // Clear concentration
      char.concentratingOn = null;

      // Update timestamp
      char.restResources.lastLongRest = new Date().toISOString();

      char.updatedAt = new Date();
      this.saveToLocalStorage();
    },

    // Saving Throws
    toggleSavingThrowProficiency(id: string, ability: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char || !(ability in char.savingThrowProficiencies)) return;
      (char.savingThrowProficiencies as any)[ability] = !(char.savingThrowProficiencies as any)[ability];
      this.saveToLocalStorage();
    },

    // Concentration
    setConcentration(id: string, spellName: string | null) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;
      char.concentratingOn = spellName;
      this.saveToLocalStorage();
    },

    // Armor Class
    updateArmorClass(id: string, ac: number) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;
      char.combatStats.armorClass = Math.max(0, ac);
      this.saveToLocalStorage();
    },

    // Inventory
    addInventoryItem(id: string, item: import('$lib/types').InventoryItem) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;
      if (!char.inventory) char.inventory = [];
      char.inventory.push(item);
      this.saveToLocalStorage();
    },

    updateInventoryItem(id: string, itemId: string, updates: Partial<import('$lib/types').InventoryItem>) {
      const char = state.characters.find(c => c.id === id);
      if (!char || !char.inventory) return;
      const index = char.inventory.findIndex(i => i.id === itemId);
      if (index !== -1) {
        char.inventory[index] = { ...char.inventory[index], ...updates };
        this.saveToLocalStorage();
      }
    },

    removeInventoryItem(id: string, itemId: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char || !char.inventory) return;
      char.inventory = char.inventory.filter(i => i.id !== itemId);
      this.saveToLocalStorage();
    },

    updateCurrency(id: string, currency: Partial<import('$lib/types').Currency>) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;
      if (!char.currency) char.currency = { platinum: 0, gold: 0, silver: 0, copper: 0 };
      char.currency = { ...char.currency, ...currency };
      this.saveToLocalStorage();
    },

    toggleInspiration(characterId: string) {
      const char = state.characters.find(c => c.id === characterId);
      if (!char) return;
      char.inspiration = !char.inspiration;
      char.updatedAt = new Date();
      this.saveToLocalStorage();
    },

    // Feats
    addFeat(id: string, feat: CharacterFeat) {
      const char = state.characters.find(c => c.id === id);
      if (!char) return;
      if (!char.feats) char.feats = [];
      char.feats.push(feat);
      this.saveToLocalStorage();
    },

    removeFeat(id: string, featIndex: number) {
      const char = state.characters.find(c => c.id === id);
      if (!char || !char.feats) return;
      char.feats.splice(featIndex, 1);
      this.saveToLocalStorage();
    },

    toggleFeatEnabled(id: string, featIndex: number) {
      const char = state.characters.find(c => c.id === id);
      if (!char || !char.feats || !char.feats[featIndex]) return;
      char.feats[featIndex].enabled = !char.feats[featIndex].enabled;
      this.saveToLocalStorage();
    },

    useFeatResource(id: string, featIndex: number, resourceName: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char || !char.feats || !char.feats[featIndex]) return;
      const resource = char.feats[featIndex].resources.find(r => r.name === resourceName);
      if (resource && resource.current > 0) {
        resource.current--;
        this.saveToLocalStorage();
      }
    },

    updateFeatChoice(id: string, featIndex: number, choiceId: string, optionId: string) {
      const char = state.characters.find(c => c.id === id);
      if (!char || !char.feats || !char.feats[featIndex]) return;
      const choice = char.feats[featIndex].choices.find(c => c.id === choiceId);
      if (choice) {
        choice.selectedOptionId = optionId;
        this.saveToLocalStorage();
      }
    }
  };
}

export const appStore = createAppStore();
