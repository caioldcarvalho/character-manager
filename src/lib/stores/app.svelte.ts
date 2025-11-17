import type { Character } from '$lib/types';

interface AppState {
  characters: Character[];
  activeCharacterId: string | null;
  activeTab: string;
  sidebarOpen: boolean;
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
      state.characters.push(character);
      // Auto-select if it's the first character
      if (state.characters.length === 1) {
        state.activeCharacterId = character.id;
      }
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
      }
    },
    deleteCharacter(id: string) {
      state.characters = state.characters.filter(c => c.id !== id);
      if (state.activeCharacterId === id) {
        state.activeCharacterId = state.characters[0]?.id || null;
      }
    }
  };
}

export const appStore = createAppStore();
