<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    activeTab = $bindable(''),
    tabs = [],
    class: className,
  }: {
    activeTab?: string;
    tabs: { id: string; label: string; icon?: string }[];
    class?: string;
  } = $props();

  function selectTab(tabId: string) {
    activeTab = tabId;
  }
</script>

<div class={cn("border-b border-border bg-card", className)}>
  <nav class="flex space-x-1 px-4" aria-label="Tabs">
    {#each tabs as tab}
      <button
        type="button"
        onclick={() => selectTab(tab.id)}
        class={cn(
          "px-4 py-3 text-sm font-medium transition-colors relative",
          activeTab === tab.id
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {#if tab.icon}
          <span class="mr-2">{tab.icon}</span>
        {/if}
        {tab.label}

        {#if activeTab === tab.id}
          <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
        {/if}
      </button>
    {/each}
  </nav>
</div>
