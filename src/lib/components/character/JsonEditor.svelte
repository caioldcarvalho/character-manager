<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Modal from '$lib/components/ui/modal.svelte';
  import { WrapText, RotateCcw, Save, X } from 'lucide-svelte';

  let {
    open = $bindable(false)
  }: {
    open: boolean;
  } = $props();

  const character = $derived(appStore.activeCharacter);

  let jsonText = $state('');
  let savedSnapshot = $state('');
  let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);

  const hasUnsavedChanges = $derived(jsonText !== savedSnapshot);
  const charCount = $derived(jsonText.length);

  // Reload JSON from store when modal opens or character changes
  $effect(() => {
    if (open && character) {
      const formatted = JSON.stringify(character, null, 2);
      jsonText = formatted;
      savedSnapshot = formatted;
      message = null;
    }
  });

  function handleClose(): boolean | void {
    if (hasUnsavedChanges) {
      const confirmed = confirm('Existem alterações não salvas. Deseja fechar mesmo assim?');
      if (!confirmed) return false;
    }
  }

  function formatJson() {
    try {
      const parsed = JSON.parse(jsonText);
      jsonText = JSON.stringify(parsed, null, 2);
      showMessage('success', 'JSON formatado!');
    } catch {
      showMessage('error', 'JSON inválido — corrija antes de formatar.');
    }
  }

  function restore() {
    if (!character) return;
    const formatted = JSON.stringify(character, null, 2);
    jsonText = formatted;
    savedSnapshot = formatted;
    message = null;
    showMessage('success', 'JSON restaurado do personagem atual.');
  }

  function saveJson() {
    if (!character) return;

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      showMessage('error', 'JSON inválido. Verifique a sintaxe.');
      return;
    }

    if (!parsed.id || !parsed.name) {
      showMessage('error', 'Campos obrigatórios ausentes: "id" e "name" são necessários.');
      return;
    }

    if (parsed.id !== character.id) {
      showMessage('error', 'O campo "id" não pode ser alterado.');
      return;
    }

    appStore.replaceCharacter(character.id, parsed);
    savedSnapshot = jsonText;
    showMessage('success', 'Personagem salvo com sucesso!');
  }

  function closeEditor() {
    if (hasUnsavedChanges) {
      const confirmed = confirm('Existem alterações não salvas. Deseja fechar mesmo assim?');
      if (!confirmed) return;
    }
    open = false;
  }

  function showMessage(type: 'success' | 'error', text: string) {
    message = { type, text };
    if (type === 'success') {
      setTimeout(() => {
        message = null;
      }, 3000);
    }
  }
</script>

<Modal bind:open title="Editor JSON" onclose={handleClose}>
  {#snippet children()}
    <div class="flex flex-col gap-4 h-full">
      <!-- Toolbar -->
      <div class="flex flex-wrap gap-2">
        <button
          onclick={formatJson}
          class="px-3 py-1.5 bg-secondary hover:bg-secondary/80 border border-input text-foreground rounded-md text-sm font-medium transition-colors flex items-center gap-1.5"
        >
          <WrapText size={16} /> Formatar
        </button>
        <button
          onclick={restore}
          class="px-3 py-1.5 bg-secondary hover:bg-secondary/80 border border-input text-foreground rounded-md text-sm font-medium transition-colors flex items-center gap-1.5"
        >
          <RotateCcw size={16} /> Restaurar
        </button>
        <button
          onclick={saveJson}
          class="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5"
        >
          <Save size={16} /> Salvar
        </button>
        <button
          onclick={closeEditor}
          class="px-3 py-1.5 bg-secondary hover:bg-secondary/80 border border-input text-foreground rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ml-auto"
        >
          <X size={16} /> Fechar
        </button>
      </div>

      <!-- Textarea -->
      <textarea
        bind:value={jsonText}
        class="w-full flex-1 min-h-[50vh] p-4 bg-background border border-border rounded-md font-mono text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
        spellcheck="false"
      ></textarea>

      <!-- Status bar -->
      <div class="flex items-center justify-between text-xs text-muted-foreground">
        <span>{charCount} caracteres</span>
        <span class={hasUnsavedChanges ? 'text-warning' : 'text-success'}>
          {hasUnsavedChanges ? 'Não salvo' : 'Salvo'}
        </span>
      </div>

      <!-- Messages -->
      {#if message}
        <div
          class="p-3 rounded-lg {message.type === 'success'
            ? 'bg-success/20 border border-success text-success-light'
            : 'bg-danger/20 border border-danger text-danger-light'}"
        >
          {message.text}
        </div>
      {/if}
    </div>
  {/snippet}
</Modal>
