<script lang="ts">
  import Card from '$lib/components/ui/card.svelte';
  import { Dices, ChevronDown, ChevronUp } from 'lucide-svelte';

  let expanded = $state(false);
  let diceInput = $state('1d20');
  let results = $state<{ notation: string; rolls: number[]; modifier: number; total: number }[]>([]);

  function parseDice(notation: string): { count: number; sides: number; modifier: number } | null {
    const match = notation.trim().match(/^(\d+)?d(\d+)\s*([+-]\s*\d+)?$/i);
    if (!match) return null;
    return {
      count: parseInt(match[1] || '1'),
      sides: parseInt(match[2]),
      modifier: match[3] ? parseInt(match[3].replace(/\s/g, '')) : 0
    };
  }

  function rollDice(notation?: string) {
    const input = notation || diceInput;
    const parsed = parseDice(input);
    if (!parsed || parsed.count < 1 || parsed.count > 100 || parsed.sides < 1) return;

    const rolls: number[] = [];
    for (let i = 0; i < parsed.count; i++) {
      rolls.push(Math.floor(Math.random() * parsed.sides) + 1);
    }
    const total = rolls.reduce((a, b) => a + b, 0) + parsed.modifier;

    results = [{ notation: input, rolls, modifier: parsed.modifier, total }, ...results.slice(0, 9)];
  }

  function rollAdvantage() {
    const r1 = Math.floor(Math.random() * 20) + 1;
    const r2 = Math.floor(Math.random() * 20) + 1;
    const total = Math.max(r1, r2);
    results = [{ notation: '2d20 (vantagem)', rolls: [r1, r2], modifier: 0, total }, ...results.slice(0, 9)];
  }

  function rollDisadvantage() {
    const r1 = Math.floor(Math.random() * 20) + 1;
    const r2 = Math.floor(Math.random() * 20) + 1;
    const total = Math.min(r1, r2);
    results = [{ notation: '2d20 (desvantagem)', rolls: [r1, r2], modifier: 0, total }, ...results.slice(0, 9)];
  }

  const quickDice = ['1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '1d100'];
</script>

<Card variant="glass" class="p-4 animate-fade-in">
  <button
    onclick={() => expanded = !expanded}
    class="flex items-center justify-between w-full"
  >
    <div class="flex items-center gap-2">
      <Dices size={20} class="text-primary" />
      <h2 class="text-lg font-bold">Dados</h2>
    </div>
    {#if results.length > 0 && !expanded}
      <span class="text-sm text-muted-foreground">
        Último: {results[0].total} ({results[0].notation})
      </span>
    {/if}
    {#if expanded}
      <ChevronUp size={20} class="text-muted-foreground" />
    {:else}
      <ChevronDown size={20} class="text-muted-foreground" />
    {/if}
  </button>

  {#if expanded}
    <div class="mt-4 space-y-3">
      <!-- Custom input -->
      <div class="flex gap-2">
        <input
          type="text"
          bind:value={diceInput}
          placeholder="ex: 2d6+3"
          onkeydown={(e) => e.key === 'Enter' && rollDice()}
          class="flex-1 px-3 py-2 bg-secondary border border-input rounded-md text-foreground placeholder:text-muted-foreground text-sm"
        />
        <button
          onclick={() => rollDice()}
          class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-semibold text-sm transition-colors"
        >
          Rolar
        </button>
      </div>

      <!-- Quick dice buttons -->
      <div class="flex flex-wrap gap-2">
        {#each quickDice as die}
          <button
            onclick={() => rollDice(die)}
            class="px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-md text-xs font-medium transition-colors"
          >
            {die}
          </button>
        {/each}
      </div>

      <!-- Advantage/Disadvantage -->
      <div class="flex gap-2">
        <button
          onclick={rollAdvantage}
          class="flex-1 px-3 py-1.5 bg-success/20 hover:bg-success/30 text-success-foreground border border-success/30 rounded-md text-xs font-medium transition-colors"
        >
          Vantagem
        </button>
        <button
          onclick={rollDisadvantage}
          class="flex-1 px-3 py-1.5 bg-danger/20 hover:bg-danger/30 text-danger-foreground border border-danger/30 rounded-md text-xs font-medium transition-colors"
        >
          Desvantagem
        </button>
      </div>

      <!-- Results -->
      {#if results.length > 0}
        <div class="space-y-2 max-h-48 overflow-y-auto">
          {#each results as result, i}
            <div class="flex items-center justify-between p-2 rounded-lg text-sm {i === 0 ? 'bg-primary/10 border border-primary/30' : 'bg-secondary/50'}">
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground text-xs">{result.notation}</span>
                <span class="text-xs text-muted-foreground">
                  [{result.rolls.join(', ')}]{result.modifier !== 0 ? (result.modifier > 0 ? `+${result.modifier}` : result.modifier) : ''}
                </span>
              </div>
              <span class="font-bold {i === 0 ? 'text-primary text-lg' : ''}">{result.total}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</Card>
