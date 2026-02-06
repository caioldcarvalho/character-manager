<script lang="ts">
  import { X } from 'lucide-svelte';

  let {
    open = $bindable(false),
    title = '',
    onclose,
    children
  }: {
    open: boolean;
    title?: string;
    onclose?: () => boolean | void;
    children?: any;
  } = $props();

  function close() {
    if (onclose) {
      const prevent = onclose();
      if (prevent === false) return;
    }
    open = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (open && e.key === 'Escape') close();
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) close();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    onclick={handleBackdropClick}
  >
    <div class="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg border bg-[var(--glass-bg)] border-[var(--glass-border)] backdrop-blur-[var(--glass-blur)] shadow-lg">
      <div class="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 class="text-lg font-semibold text-foreground">{title}</h2>
        <button
          onclick={close}
          class="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div class="flex-1 overflow-auto p-6">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}
