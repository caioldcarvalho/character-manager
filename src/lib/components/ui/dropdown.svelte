<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    open = $bindable(false),
    trigger,
    content,
    class: className,
  }: {
    open?: boolean;
    trigger?: any;
    content?: any;
    class?: string;
  } = $props();

  function toggle() {
    open = !open;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-dropdown]')) {
      open = false;
    }
  }

  $effect(() => {
    if (open) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  });
</script>

<div class={cn("relative", className)} data-dropdown>
  <button
    type="button"
    onclick={toggle}
    class="w-full"
  >
    {@render trigger?.()}
  </button>

  {#if open}
    <div
      class="absolute top-full left-0 mt-2 w-full bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] text-card-foreground border border-[var(--glass-border)] rounded-md shadow-lg z-50 max-h-80 overflow-auto transition-[var(--transition-base)] animate-fade-in"
    >
      {@render content?.()}
    </div>
  {/if}
</div>
