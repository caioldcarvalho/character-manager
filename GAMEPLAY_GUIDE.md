# D&D 5e Character Sheet - Gameplay Guide

## 🎮 Quick Start

### Option 1: Load Sample Paladin (Fastest)
1. Start the app: `npm run dev`
2. Visit http://localhost:5174
3. Click **"⚔️ Carregar Paladino de Teste"** button
4. You'll be taken to a fully-featured Level 5 Paladin character sheet

### Option 2: Create Your Own Character
1. Follow the character creation wizard
2. Choose name, ability scores, race, and class
3. Character will be created with default gameplay values
4. You can then customize HP, spells, and skills

---

## 📱 Character Sheet Layout

### Summary Tab (Main Gameplay Screen)

#### Combat Stats Row
- **HP Tracker**: Current/Max HP, temp HP, damage/heal inputs
- **Initiative**: DEX modifier, roll button
- **Spell Stats**: Save DC, attack bonus, armor class

#### Ability Scores
- All 6 abilities with modifiers
- Shows racial bonuses if applicable

#### Class Features
- Expandable list of all Paladin features
- Usage counters for limited abilities
- Lay on Hands and Channel Divinity resource pools

#### Resources
- **Spell Slots**: Visual dots for each slot (click to toggle)
- **Character Info**: Level, proficiency, speed, etc.

---

## 💊 HP Tracking

### Taking Damage
1. Enter damage amount in the "Dano" field
2. Click **"Receber Dano"**
3. Temporary HP absorbs damage first
4. Remaining damage reduces current HP
5. HP cannot go below 0

### Healing
1. Enter heal amount in the "Cura" field
2. Click **"Curar"**
3. HP increases up to maximum
4. Cannot exceed max HP

### Temporary HP
1. Enter temp HP amount
2. Click **"Definir Temp"**
3. Temp HP shown in blue banner
4. Absorbs damage before regular HP
5. Doesn't stack (new value replaces old)

### Long Rest
- Click **"⭐ Descanso Longo"** on Spell Slots card
- Restores: Full HP, all spell slots, all class features, all paladin resources

---

## 🎲 Initiative

1. View your initiative modifier (DEX modifier)
2. Click **"🎲 Rolar Iniciativa"**
3. Rolls d20 + modifier
4. Result displayed below button
5. Share result with DM

---

## ✨ Spell Management

### Spell Slots
- **Level 1**: 4 slots (blue dots)
- **Level 2**: 2 slots (purple dots)
- Click a dot to toggle used/available
- Filled dot = available, empty = used
- Long rest restores all slots

### Preparing Spells
Go to **Spells Tab**:
1. See max prepared spells (CHA mod + half level = 4 for sample paladin)
2. Click checkbox next to spell name to prepare
3. Cannot exceed preparation limit
4. Prepared spells can be cast when you have slots

### Spell Details
1. Click spell name or arrow to expand
2. View: School, casting time, range, duration
3. (C) indicates concentration spell
4. Read full description

### Spell List Filter
- Use dropdown to filter by level
- "Todos os Níveis" shows all spells

---

## 🎯 Skills (Abilities Tab)

### Viewing Skills
- All 18 D&D skills listed
- Grouped by ability score
- Shows calculated bonus for each

### Toggle Proficiency
1. Click any skill to toggle proficiency
2. Proficient skills highlighted in blue
3. Proficiency adds +3 to bonus (at level 5)
4. Example: Athletics (STR 16) = +3 (STR mod) + 3 (prof) = +6

### Skill Bonuses
- **Not Proficient**: Ability modifier only
- **Proficient**: Ability modifier + proficiency bonus

---

## ⚔️ Class Features

### Viewing Features
1. Listed on Summary tab
2. Click feature name to expand/collapse
3. Read description for how to use

### Limited-Use Features
- **Sentido Divino**: 5 uses (1 + CHA mod)
- **Canalizar Divindade**: 1 use
- Click **"Usar"** button to decrement counter
- Long rest restores uses

### Paladin Resources
- **Lay on Hands**: 25 HP pool (level × 5)
  - Use to heal allies or yourself
  - Track uses manually
  - Long rest restores full pool

- **Channel Divinity**: 1 use
  - Includes Voto de Inimizade
  - Long rest restores

### Fighting Style
- Displayed at top of features
- Sample paladin has "Defesa" (+1 AC)

---

## 💾 Data Persistence

### Auto-Save
- All changes save automatically to browser localStorage
- Refresh page and data persists
- No manual save needed

### Export Character
1. Click **"📥 Exportar JSON"** button (top-right of Summary)
2. Downloads character as JSON file
3. Use for backup or sharing

### Import Character
1. Click **"📤 Importar JSON"** button
2. Select saved JSON file
3. Character added to app
4. Validates file format

### Multiple Characters
- Create multiple characters
- Switch between them using sidebar (if implemented)
- Each saves independently

---

## 🎮 Common Gameplay Scenarios

### Starting Combat
1. Roll initiative
2. Track HP as you take damage
3. Use spell slots when casting
4. Toggle class feature uses

### Casting a Spell
1. Go to Spells tab
2. Check if spell is prepared
3. Note spell level
4. Go to Summary tab
5. Use appropriate spell slot (click dot)
6. Apply spell effects in game

### Using Lay on Hands
1. Decide HP to spend (max 25)
2. Note on scratch paper or subtract mentally
3. Can heal self or allies
4. Long rest to restore pool

### Using Divine Smite
1. Hit with melee attack
2. Decide to use spell slot
3. Click spell slot to use it
4. Roll 2d8 (level 1) or 3d8 (level 2) radiant damage
5. Add to attack damage

### Level Up
Currently not automated. To level up:
1. Export character JSON
2. Manually edit file
3. Update level, HP, spell slots, features
4. Import updated JSON

---

## 🔧 Troubleshooting

### Data Lost After Refresh
- Check if browser is clearing localStorage
- Use Private/Incognito? Data doesn't persist there
- Export regularly as backup

### Can't Prepare More Spells
- Check prepared spell count vs limit
- Unprepare a spell first
- Limit = CHA modifier + (level ÷ 2)

### HP Not Updating
- Check input field has value
- Use positive numbers only
- Max HP caps healing

### Spell Slots Not Restoring
- Click **"⭐ Descanso Longo"** button
- All slots should fill
- Refresh page if still broken

---

## 📊 Sample Paladin Stats Reference

**Sir Aldric - Level 5 Human Paladin**

| Stat | Value |
|------|-------|
| HP | 44/44 |
| AC | 18 |
| Proficiency | +3 |
| Initiative | +0 (DEX 10) |
| Spell Save DC | 13 |
| Spell Attack | +5 |
| Lay on Hands | 25 HP |
| Channel Divinity | 1/day |

**Ability Scores** (with racial bonuses):
- STR: 17 (+3) - +1 from human
- DEX: 10 (+0)
- CON: 14 (+2)
- INT: 8 (-1)
- WIS: 12 (+1)
- CHA: 15 (+2) - +1 from human

**Proficient Skills**:
- Atletismo (Athletics) - +6
- Persuasão (Persuasion) - +5

**Fighting Style**: Defesa (+1 AC, already included in AC 18)

**Spell Slots**:
- 1st Level: 4
- 2nd Level: 2

**Prepared Spells**: 4 max (CHA +2 + Level ÷ 2 = 2)

---

## 🎯 Pro Tips

1. **Prepare utility spells** like Bênção, Curar Ferimentos, Escudo da Fé
2. **Save spell slots** for Divine Smite on critical hits
3. **Use Lay on Hands** for out-of-combat healing
4. **Track concentration** - only one concentration spell at a time
5. **Export before major changes** to avoid data loss
6. **Long rest after every session** to restore resources

---

## 🚀 Next Steps

- Play through a combat encounter
- Try different spell combinations
- Toggle skill proficiencies for your playstyle
- Export and share character with party
- Create additional characters for multiclassing

Happy adventuring! ⚔️✨
