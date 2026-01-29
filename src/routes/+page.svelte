<script lang="ts">
  import { characterStore } from '$lib/stores/character.svelte';
  import { appStore } from '$lib/stores/app.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Label from '$lib/components/ui/label.svelte';
  import { getRaces, getRaceDetails, getClasses, getClassDetails } from '$lib/api';
  import type { APIReference, Race, CharacterClass } from '$lib/types';
  import { goto } from '$app/navigation';
  import { createSamplePaladin } from '$lib/utils/sample-paladin';

  let currentStep = $state(0);
  let nameInput = $state(characterStore.character.name);
  let showSummary = $state(false);

  // Race selection
  let availableRaces = $state<APIReference[]>([]);
  let selectedRaceIndex = $state<string | null>(null);
  let selectedRaceDetails = $state<Race | null>(null);
  let loadingRaces = $state(false);
  let loadingRaceDetails = $state(false);

  // Class selection
  let availableClasses = $state<APIReference[]>([]);
  let selectedClassIndex = $state<string | null>(null);
  let selectedClassDetails = $state<CharacterClass | null>(null);
  let loadingClasses = $state(false);
  let loadingClassDetails = $state(false);

  // Ability scores
  let abilityScores = $state({
    strength: characterStore.character.abilityScores.strength,
    dexterity: characterStore.character.abilityScores.dexterity,
    constitution: characterStore.character.abilityScores.constitution,
    intelligence: characterStore.character.abilityScores.intelligence,
    wisdom: characterStore.character.abilityScores.wisdom,
    charisma: characterStore.character.abilityScores.charisma,
  });

  const abilities = [
    { key: 'strength', label: 'Força (STR)', description: 'Poder físico, atletismo' },
    { key: 'dexterity', label: 'Destreza (DEX)', description: 'Agilidade, reflexos, equilíbrio' },
    { key: 'constitution', label: 'Constituição (CON)', description: 'Saúde, resistência' },
    { key: 'intelligence', label: 'Inteligência (INT)', description: 'Raciocínio, memória' },
    { key: 'wisdom', label: 'Sabedoria (WIS)', description: 'Percepção, intuição' },
    { key: 'charisma', label: 'Carisma (CHA)', description: 'Força de personalidade' },
  ];

  const steps = [
    { title: 'Nome do Personagem', component: 'name' },
    { title: 'Atributos', component: 'abilities' },
    { title: 'Raça', component: 'race' },
    { title: 'Classe', component: 'class' }
  ];

  function calculateModifier(score: number): string {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  async function nextStep() {
    if (currentStep === 0) {
      characterStore.setName(nameInput);
    } else if (currentStep === 1) {
      characterStore.setAbilityScores(abilityScores);
    } else if (currentStep === 2) {
      characterStore.setRace(selectedRaceDetails);
    } else if (currentStep === 3) {
      characterStore.setClass(selectedClassDetails);
    }

    if (currentStep < steps.length - 1) {
      currentStep++;

      // Load races when entering race selection step
      if (currentStep === 2 && availableRaces.length === 0) {
        await loadRaces();
      }

      // Load classes when entering class selection step
      if (currentStep === 3 && availableClasses.length === 0) {
        await loadClasses();
      }
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
    }
  }

  function canProceed() {
    if (currentStep === 0) {
      return nameInput.trim().length > 0;
    }
    if (currentStep === 1) {
      // Check if all ability scores are valid (between 3 and 20)
      return Object.values(abilityScores).every(score => score >= 3 && score <= 20);
    }
    if (currentStep === 2) {
      return selectedRaceDetails !== null;
    }
    if (currentStep === 3) {
      return selectedClassDetails !== null;
    }
    return true;
  }

  async function loadRaces() {
    loadingRaces = true;
    try {
      const result = await getRaces();
      availableRaces = result.results;
    } catch (error) {
      console.error('Error loading races:', error);
    } finally {
      loadingRaces = false;
    }
  }

  async function selectRace(raceIndex: string) {
    selectedRaceIndex = raceIndex;
    loadingRaceDetails = true;
    try {
      const details = await getRaceDetails(raceIndex);
      selectedRaceDetails = details;
    } catch (error) {
      console.error('Error loading race details:', error);
    } finally {
      loadingRaceDetails = false;
    }
  }

  function getAbilityBonus(abilityName: string): number {
    if (!selectedRaceDetails) return 0;
    const bonus = selectedRaceDetails.ability_bonuses.find(
      (b) => b.ability_score.index === abilityName.toLowerCase()
    );
    return bonus ? bonus.bonus : 0;
  }

  function getAbilityNameFromKey(key: string): string {
    const map: Record<string, string> = {
      strength: 'str',
      dexterity: 'dex',
      constitution: 'con',
      intelligence: 'int',
      wisdom: 'wis',
      charisma: 'cha',
    };
    return map[key] || key;
  }

  function getFinalAbilityScore(abilityKey: string): number {
    const base = abilityScores[abilityKey as keyof typeof abilityScores];
    const bonus = getAbilityBonus(getAbilityNameFromKey(abilityKey));
    return base + bonus;
  }

  async function loadClasses() {
    loadingClasses = true;
    try {
      const result = await getClasses();
      availableClasses = result.results;
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      loadingClasses = false;
    }
  }

  async function selectClass(classIndex: string) {
    selectedClassIndex = classIndex;
    loadingClassDetails = true;
    try {
      const details = await getClassDetails(classIndex);
      selectedClassDetails = details;
    } catch (error) {
      console.error('Error loading class details:', error);
    } finally {
      loadingClassDetails = false;
    }
  }

  function finishCharacterCreation() {
    characterStore.setClass(selectedClassDetails);

    // Adicionar personagem à app store
    const character = characterStore.getCharacter();
    appStore.addCharacter(character);

    // Redirecionar para visualização do personagem
    goto('/character');
  }

  function startOver() {
    characterStore.reset();
    showSummary = false;
    currentStep = 0;
    nameInput = '';
    selectedRaceIndex = null;
    selectedRaceDetails = null;
    selectedClassIndex = null;
    selectedClassDetails = null;
    abilityScores = {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    };
  }

  function loadSamplePaladin() {
    const paladin = createSamplePaladin();
    appStore.addCharacter(paladin);
    goto('/character');
  }
</script>

<div class="min-h-screen bg-background p-4">
  <div class="container mx-auto max-w-4xl py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-4xl font-bold text-foreground">
        Criador de Personagem D&D 5e
      </h1>
      <Button onclick={loadSamplePaladin} variant="outline" class="flex items-center gap-2">
        ⚔️ Carregar Paladino de Teste
      </Button>
    </div>

    {#if showSummary}
      <!-- Character Summary -->
      <Card class="p-8">
        <div class="space-y-6">
          <div class="text-center">
            <h2 class="text-3xl font-bold mb-2">{characterStore.character.name}</h2>
            <p class="text-lg text-muted-foreground">
              {characterStore.character.race?.name} {characterStore.character.class?.name}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Atributos -->
            <div class="space-y-3">
              <h3 class="text-xl font-semibold">Atributos</h3>
              <div class="space-y-2">
                {#each abilities as ability}
                  {@const finalScore = getFinalAbilityScore(ability.key)}
                  {@const bonus = getAbilityBonus(getAbilityNameFromKey(ability.key))}
                  <div class="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-800 rounded">
                    <span class="font-medium">{ability.label}</span>
                    <div class="text-right">
                      <div class="font-bold text-lg">
                        {finalScore}
                        {#if bonus > 0}
                          <span class="text-sm text-green-600">(+{bonus})</span>
                        {/if}
                      </div>
                      <div class="text-sm text-muted-foreground">
                        {calculateModifier(finalScore)}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Informações da classe e raça -->
            <div class="space-y-3">
              <h3 class="text-xl font-semibold">Informações</h3>
              <div class="space-y-2">
                <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded">
                  <div class="font-semibold">Raça</div>
                  <div>{characterStore.character.race?.name}</div>
                  <div class="text-sm text-muted-foreground mt-1">
                    Velocidade: {characterStore.character.race?.speed} pés
                  </div>
                </div>
                <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded">
                  <div class="font-semibold">Classe</div>
                  <div>{characterStore.character.class?.name}</div>
                  <div class="text-sm text-muted-foreground mt-1">
                    Dado de Vida: d{characterStore.character.class?.hit_die}
                  </div>
                </div>
              </div>

              {#if characterStore.character.race?.traits && characterStore.character.race.traits.length > 0}
                <div class="p-3 bg-green-100 dark:bg-green-900 rounded">
                  <div class="font-semibold mb-2">Habilidades Raciais</div>
                  <div class="space-y-1 text-sm">
                    {#each characterStore.character.race.traits as trait}
                      <div>{trait.name}</div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>

          <div class="flex justify-center gap-4 pt-4">
            <Button onclick={startOver} variant="outline">
              Criar Novo Personagem
            </Button>
          </div>
        </div>
      </Card>
    {:else}
      <!-- Progress indicator -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        {#each steps as step, index}
          <div class="flex flex-col items-center flex-1">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors
                {index === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-muted text-muted-foreground'}"
            >
              {index + 1}
            </div>
            <span class="text-xs mt-2 text-center text-gray-300">{step.title}</span>
          </div>
          {#if index < steps.length - 1}
            <div
              class="h-1 flex-1 mx-2 transition-colors {index < currentStep
                ? 'bg-primary'
                : 'bg-border'}"
            ></div>
          {/if}
        {/each}
      </div>
    </div>

    <Card class="p-8">
      <!-- Step 1: Nome -->
      {#if currentStep === 0}
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-2">Qual é o nome do seu personagem?</h2>
            <p class="text-muted-foreground">
              Escolha um nome épico para sua aventura em D&D 5e!
            </p>
          </div>

          <div class="space-y-2">
            <Label for="character-name">Nome do Personagem</Label>
            <Input
              id="character-name"
              bind:value={nameInput}
              placeholder="Ex: Aragorn, Gandalf, Legolas..."
              class="text-lg"
            />
          </div>

          {#if nameInput.trim()}
            <div class="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <p class="text-sm text-purple-900 dark:text-purple-100">
                Olá, <span class="font-bold">{nameInput}</span>! Pronto para começar sua jornada?
              </p>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Step 2: Atributos -->
      {#if currentStep === 1}
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-2">Defina seus Atributos</h2>
            <p class="text-muted-foreground">
              Insira os valores para cada um dos seis atributos principais (3-20).
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each abilities as ability}
              <div class="space-y-2 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <Label for={ability.key} class="text-base font-semibold">
                      {ability.label}
                    </Label>
                    <p class="text-xs text-muted-foreground mt-1">
                      {ability.description}
                    </p>
                  </div>
                  <div class="ml-4 text-center">
                    <div class="text-2xl font-bold text-purple-600">
                      {calculateModifier(abilityScores[ability.key as keyof typeof abilityScores])}
                    </div>
                    <div class="text-xs text-muted-foreground">modificador</div>
                  </div>
                </div>
                <Input
                  id={ability.key}
                  type="number"
                  min="3"
                  max="20"
                  bind:value={abilityScores[ability.key as keyof typeof abilityScores]}
                  class="text-lg font-semibold text-center"
                />
              </div>
            {/each}
          </div>

          <div class="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Dica: Distribuição de Atributos
            </h3>
            <p class="text-sm text-blue-800 dark:text-blue-200">
              Método padrão: 15, 14, 13, 12, 10, 8. Distribua conforme a classe desejada!
            </p>
          </div>
        </div>
      {/if}

      <!-- Step 3: Raça -->
      {#if currentStep === 2}
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-2">Escolha sua Raça</h2>
            <p class="text-muted-foreground">
              Sua raça define características especiais e modificadores de atributos.
            </p>
          </div>

          {#if loadingRaces}
            <div class="text-center py-8">
              <p class="text-muted-foreground">Carregando raças...</p>
            </div>
          {:else}
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              {#each availableRaces as race}
                <button
                  type="button"
                  onclick={() => selectRace(race.index)}
                  class="p-4 border-2 rounded-lg transition-all hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 {selectedRaceIndex ===
                  race.index
                    ? 'border-purple-600 bg-purple-100 dark:bg-purple-900/40'
                    : 'border-gray-300'}"
                >
                  <div class="font-semibold">{race.name}</div>
                </button>
              {/each}
            </div>
          {/if}

          {#if loadingRaceDetails}
            <div class="text-center py-4">
              <p class="text-muted-foreground">Carregando detalhes...</p>
            </div>
          {:else if selectedRaceDetails}
            <div class="space-y-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
              <div>
                <h3 class="text-xl font-bold mb-2">{selectedRaceDetails.name}</h3>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span class="font-semibold">Tamanho:</span> {selectedRaceDetails.size}
                  </div>
                  <div>
                    <span class="font-semibold">Velocidade:</span> {selectedRaceDetails.speed} pés
                  </div>
                </div>
              </div>

              {#if selectedRaceDetails.ability_bonuses.length > 0}
                <div>
                  <h4 class="font-semibold mb-2">Modificadores de Atributos:</h4>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {#each selectedRaceDetails.ability_bonuses as bonus}
                      <div class="p-2 bg-green-100 dark:bg-green-900 rounded">
                        <span class="font-bold text-green-800 dark:text-green-200">
                          {bonus.ability_score.name}:
                        </span>
                        <span class="ml-1">+{bonus.bonus}</span>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}

              {#if selectedRaceDetails.traits.length > 0}
                <div>
                  <h4 class="font-semibold mb-2">Habilidades Raciais:</h4>
                  <div class="space-y-1">
                    {#each selectedRaceDetails.traits as trait}
                      <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded text-sm">
                        {trait.name}
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}

              <div>
                <h4 class="font-semibold mb-2">Atributos Finais (com bônus racial):</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {#each abilities as ability}
                    {@const finalScore = getFinalAbilityScore(ability.key)}
                    {@const bonus = getAbilityBonus(getAbilityNameFromKey(ability.key))}
                    <div class="p-2 border rounded">
                      <div class="text-xs text-muted-foreground">
                        {ability.label.split(' ')[0]}
                      </div>
                      <div class="text-lg font-bold">
                        {finalScore}
                        {#if bonus > 0}
                          <span class="text-xs text-green-600">(+{bonus})</span>
                        {/if}
                      </div>
                      <div class="text-xs text-muted-foreground">
                        mod: {calculateModifier(finalScore)}
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Step 4: Classe -->
      {#if currentStep === 3}
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-2">Escolha sua Classe</h2>
            <p class="text-muted-foreground">
              Sua classe determina suas habilidades e estilo de jogo.
            </p>
          </div>

          {#if loadingClasses}
            <div class="text-center py-8">
              <p class="text-muted-foreground">Carregando classes...</p>
            </div>
          {:else}
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              {#each availableClasses as characterClass}
                <button
                  type="button"
                  onclick={() => selectClass(characterClass.index)}
                  class="p-4 border-2 rounded-lg transition-all hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 {selectedClassIndex ===
                  characterClass.index
                    ? 'border-purple-600 bg-purple-100 dark:bg-purple-900/40'
                    : 'border-gray-300'}"
                >
                  <div class="font-semibold">{characterClass.name}</div>
                </button>
              {/each}
            </div>
          {/if}

          {#if loadingClassDetails}
            <div class="text-center py-4">
              <p class="text-muted-foreground">Carregando detalhes...</p>
            </div>
          {:else if selectedClassDetails}
            <div class="space-y-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
              <div>
                <h3 class="text-xl font-bold mb-2">{selectedClassDetails.name}</h3>
                <div class="text-sm">
                  <span class="font-semibold">Dado de Vida:</span> d{selectedClassDetails.hit_die}
                </div>
              </div>

              {#if selectedClassDetails.saving_throws && selectedClassDetails.saving_throws.length > 0}
                <div>
                  <h4 class="font-semibold mb-2">Testes de Resistência:</h4>
                  <div class="flex gap-2 flex-wrap">
                    {#each selectedClassDetails.saving_throws as savingThrow}
                      <div class="px-3 py-1 bg-amber-100 dark:bg-amber-900 rounded text-sm">
                        {savingThrow.name}
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}

              {#if selectedClassDetails.proficiencies && selectedClassDetails.proficiencies.length > 0}
                <div>
                  <h4 class="font-semibold mb-2">Proficiências:</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
                    {#each selectedClassDetails.proficiencies as proficiency}
                      <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                        {proficiency.name}
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Navigation buttons -->
      <div class="flex justify-between mt-8">
        <Button variant="outline" onclick={prevStep} disabled={currentStep === 0}>
          Anterior
        </Button>

        {#if currentStep < steps.length - 1}
          <Button onclick={nextStep} disabled={!canProceed()}>
            Próximo
          </Button>
        {:else}
          <Button onclick={finishCharacterCreation} disabled={!canProceed()}>
            Finalizar Criação
          </Button>
        {/if}
      </div>
    </Card>
    {/if}
  </div>
</div>
