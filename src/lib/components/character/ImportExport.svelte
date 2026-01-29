<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';

  const character = $derived(appStore.activeCharacter);

  let fileInput: HTMLInputElement;
  let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);

  function exportCharacter() {
    if (!character) return;

    const json = appStore.exportCharacter(character.id);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name.replace(/\s+/g, '-').toLowerCase()}-character.json`;
    a.click();
    URL.revokeObjectURL(url);

    showMessage('success', 'Personagem exportado com sucesso!');
  }

  function triggerImport() {
    fileInput.click();
  }

  async function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = appStore.importCharacter(text);

      if (result.success) {
        showMessage('success', 'Personagem importado com sucesso!');
      } else {
        showMessage('error', result.error || 'Erro ao importar personagem');
      }
    } catch (e) {
      showMessage('error', 'Erro ao ler arquivo');
    }

    // Reset input
    input.value = '';
  }

  function showMessage(type: 'success' | 'error', text: string) {
    message = { type, text };
    setTimeout(() => {
      message = null;
    }, 3000);
  }
</script>

<div class="flex gap-2">
  <button
    onclick={exportCharacter}
    disabled={!character}
    class="px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-md font-semibold transition-colors"
  >
    📥 Exportar JSON
  </button>

  <button
    onclick={triggerImport}
    class="px-4 py-2 bg-secondary hover:bg-secondary/80 border border-input text-foreground rounded-md font-semibold transition-colors"
  >
    📤 Importar JSON
  </button>

  <input
    bind:this={fileInput}
    type="file"
    accept=".json"
    onchange={handleFileSelect}
    class="hidden"
  />
</div>

{#if message}
  <div
    class="mt-2 p-3 rounded-lg {message.type === 'success'
      ? 'bg-green-500/20 border border-green-500 text-green-400'
      : 'bg-red-500/20 border border-red-500 text-red-400'}"
  >
    {message.text}
  </div>
{/if}
