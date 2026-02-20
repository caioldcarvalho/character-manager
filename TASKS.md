# Psi Warrior Level 12 Implementation Tasks

## Overview
Add support for Fighter (Psi Warrior subclass) level 12 character to the D&D character sheet app.

---

## Task 1: Extend Types for Generic Class Resources
**File:** `src/lib/types.ts`

Replace Paladin-specific resources with a generic system:

```ts
// Add to types.ts
export interface ClassResource {
  name: string;
  current: number;
  max: number;
  rechargeOn: 'short' | 'long' | 'special';
  description?: string;
}

// For Psi Warrior specifically
export interface PsionicDice {
  current: number;
  max: number;  // 2 × proficiency bonus
  dieSize: number;  // 6 at level 3, 8 at level 5, 10 at level 11
}

// Update Character interface:
// - Add: classResources: ClassResource[];
// - Add: psionicDice?: PsionicDice;
// - Keep paladinResources for backwards compatibility
```

---

## Task 2: Add Fighter/Psi Warrior Constants
**File:** `src/lib/constants/fighter.ts` (new file)

Create constants for Fighter class:

```ts
// Fighter features by level (relevant up to 12)
export const FIGHTER_FEATURES: ClassFeature[] = [
  { name: 'Estilo de Luta', level: 1, description: '...' },
  { name: 'Retomar o Fôlego', level: 1, uses: { current: 1, max: 1 }, description: 'Ação bônus: recupera 1d10 + nível de HP. Recarrega em descanso curto.' },
  { name: 'Surto de Ação', level: 2, uses: { current: 1, max: 1 }, description: 'Uma ação adicional. Recarrega em descanso curto.' },
  { name: 'Ataque Extra', level: 5, description: 'Ataca 2 vezes com ação de Ataque.' },
  { name: 'Ataque Extra (2)', level: 11, description: 'Ataca 3 vezes com ação de Ataque.' },
  { name: 'Indomável', level: 9, uses: { current: 1, max: 1 }, description: 'Refaz teste de resistência falho. Recarrega em descanso longo.' },
];

// Psi Warrior features (level 3, 7, 10)
export const PSI_WARRIOR_FEATURES: ClassFeature[] = [
  { name: 'Campo Protetor', level: 3, description: 'Reação: reduz dano em 1d10 + INT mod quando você ou aliado a 9m leva dano.' },
  { name: 'Golpe Psiônico', level: 3, description: 'Dano extra 1d10 + INT mod de força em ataque com arma.' },
  { name: 'Movimento Telecinético', level: 3, description: 'Ação: move objeto Grande ou criatura voluntária até 9m.' },
  { name: 'Salto Psiônico', level: 7, description: 'Ação bônus: voa até 2× deslocamento.' },
  { name: 'Impulso Telecinético', level: 7, description: 'Após Golpe Psiônico, força FOR save ou empurra 3m + derruba.' },
  { name: 'Mente Guardada', level: 10, description: 'Resistência a dano psíquico. Gasta dado psiônico para terminar amedrontado/enfeitiçado.' },
];

// Psionic die size by level
export function getPsionicDieSize(level: number): number {
  if (level >= 11) return 10;
  if (level >= 5) return 8;
  return 6;
}

// Fighter fighting styles (different from Paladin)
export const FIGHTER_FIGHTING_STYLES = [
  { name: 'Defesa', description: '+1 CA com armadura' },
  { name: 'Duelo', description: '+2 dano com arma de uma mão' },
  { name: 'Luta com Arma Grande', description: 'Re-rola 1-2 em dano com armas de duas mãos' },
  { name: 'Combate com Duas Armas', description: 'Adiciona modificador ao dano do ataque bônus' },
  { name: 'Arqueria', description: '+2 em ataques à distância' },
  { name: 'Proteção', description: 'Reação: desvantagem em ataque contra aliado adjacente' },
];
```

---

## Task 3: Create Sample Psi Warrior Character
**File:** `src/lib/utils/sample-psi-warrior.ts` (new file)

Create factory function similar to `sample-paladin.ts`:

- Level 12 Fighter (Psi Warrior)
- Stats: STR 18, DEX 14, CON 16, INT 14, WIS 10, CHA 8
- Max HP: 10 + 3 + 11×(6+3) = 112
- Proficiency: +4
- AC: 18 (plate)
- Psionic Dice: 8 (2×4), d10
- Features: All Fighter + Psi Warrior up to level 12
- Resources: Second Wind (1), Action Surge (1), Indomitable (1)
- Weapons: Greatsword (2d6), Longbow
- Skills: Athletics, Perception (Fighter choices)

---

## Task 4: Update Character Store
**File:** `src/lib/stores/app.svelte.ts`

Add methods:

```ts
// Add to migrateCharacter():
classResources: char.classResources || [],
psionicDice: char.psionicDice || undefined,

// New methods:
useClassResource(id: string, resourceName: string)
usePsionicDie(id: string)
recoverPsionicDie(id: string)  // bonus action recovery (1/short rest)

// Update shortRest():
// - Recover resources with rechargeOn: 'short'
// - If has psionicDice and hasn't used bonus recovery, allow recovering 1 die

// Update longRest():
// - Recover all classResources
// - Restore all psionicDice
```

---

## Task 5: Create Psionic Dice Component
**File:** `src/lib/components/character/PsionicDice.svelte` (new file)

Display and track psionic energy dice:

- Show current/max dice count (e.g., "6/8")
- Display die size prominently (d10)
- Click dice to spend them
- Button to recover 1 die (bonus action, 1/short rest)
- Visual: row of d10 icons, filled = available

---

## Task 6: Create Generic Class Resources Component
**File:** `src/lib/components/character/ClassResourcesPanel.svelte` (new file)

Replaces hardcoded Paladin resources in ClassFeatures.svelte:

- Render each resource from `character.classResources[]`
- Show name, current/max, use button
- Color-code by recharge type (short=blue, long=purple)
- Expandable description

---

## Task 7: Update ClassFeatures Component
**File:** `src/lib/components/character/ClassFeatures.svelte`

Changes:
- Import and use ClassResourcesPanel for resources
- Conditionally show Paladin resources only if class is Paladin
- Show PsionicDice component if `character.psionicDice` exists
- Keep existing feature list logic

---

## Task 8: Conditional Spell UI
**File:** `src/lib/components/character/SpellSlots.svelte`

Add check at top:
```svelte
{#if character && character.spellSlots.level1.max > 0}
  <!-- existing content -->
{/if}
```

Also update `+page.svelte` to hide spell tab for martial classes:
- Check if `character.class?.index === 'fighter'` to hide spells tab

---

## Task 9: Update App Store Short Rest
**File:** `src/lib/stores/app.svelte.ts`

Enhance `shortRest()` method:

```ts
shortRest(characterId: string, diceSpent: number, healing: number) {
  // ... existing logic ...

  // Recover short-rest resources
  char.classResources?.forEach(res => {
    if (res.rechargeOn === 'short') {
      res.current = res.max;
    }
  });

  // Note: Psionic die bonus action recovery is separate (manual button)
}
```

---

## Task 10: Integration & Testing
**Files:** Various

1. Add "Criar Guerreiro Psi" button to create page or sidebar
2. Import sample-psi-warrior in relevant places
3. Test all features:
   - Psionic dice spending and recovery
   - Short rest recovers Second Wind, Action Surge
   - Long rest recovers Indomitable, all psionic dice
   - Class features display correctly
   - Spell UI hidden for Fighter

---

## File Dependencies

```
Task 1 (types)
  ↓
Task 2 (constants)
  ↓
Task 3 (sample character) ← needs Task 1, 2
  ↓
Task 4 (store) ← needs Task 1
  ↓
Task 5, 6 (components) ← needs Task 1, 4
  ↓
Task 7, 8 (update existing) ← needs Task 5, 6
  ↓
Task 9 (short rest) ← needs Task 4
  ↓
Task 10 (integration)
```

Execute in order: 1 → 2 → 3 → 4 → 5/6 (parallel) → 7/8 (parallel) → 9 → 10
