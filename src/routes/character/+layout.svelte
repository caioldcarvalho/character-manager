<script lang="ts">
  import Sidebar from '$lib/components/ui/sidebar.svelte';
  import Tabs from '$lib/components/ui/tabs.svelte';
  import Dropdown from '$lib/components/ui/dropdown.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import { appStore } from '$lib/stores/app.svelte';
  import { goto } from '$app/navigation';
  import {
    ClipboardList, Swords, Backpack, Sparkles, BookText,
    User, PlusCircle, Dices, ChevronDown, Check,
    PanelLeftClose, PanelLeftOpen
  } from 'lucide-svelte';

  let { children } = $props();

  const tabs = [
    { id: 'summary', label: 'Resumo', icon: ClipboardList },
    { id: 'abilities', label: 'Habilidades', icon: Swords },
    { id: 'items', label: 'Itens', icon: Backpack },
    { id: 'notes', label: 'Notas', icon: BookText },
    { id: 'spells', label: 'Magias', icon: Sparkles }
  ];

  let dropdownOpen = $state(false);

  function handleNewCharacter() {
    goto('/');
  }

  function selectCharacter(id: string) {
    appStore.setActiveCharacter(id);
    dropdownOpen = false;
  }
</script>

<div class="flex min-h-screen bg-background">
  <!-- Sidebar -->
  <Sidebar bind:open={appStore.state.sidebarOpen}>
    <div class="p-4 border-b border-border">
      <h1 class="text-xl font-bold text-primary">D&D Manager</h1>
    </div>

    <div class="flex-1 p-4 space-y-4">
      <!-- Dropdown de personagens -->
      <Dropdown bind:open={dropdownOpen}>
        {#snippet trigger()}
          <div
            class="flex items-center justify-between px-4 py-3 bg-secondary rounded-lg hover:bg-hover transition-colors cursor-pointer"
          >
            <div class="flex items-center space-x-2 overflow-hidden">
              <span class="text-lg"><User size={20} /></span>
              {#if appStore.state.sidebarOpen}
                <div class="flex-1 min-w-0">
                  {#if appStore.activeCharacter}
                    <div class="font-semibold truncate">{appStore.activeCharacter.name}</div>
                    <div class="text-xs text-muted-foreground">
                      Nível {appStore.activeCharacter.level}
                    </div>
                  {:else}
                    <div class="text-muted-foreground">Selecione um personagem</div>
                  {/if}
                </div>
              {/if}
            </div>
            {#if appStore.state.sidebarOpen}
              <div class="transition-transform {dropdownOpen ? 'rotate-180' : ''}">
                <ChevronDown size={16} />
              </div>
            {/if}
          </div>
        {/snippet}

        {#snippet content()}
          <div class="py-1">
            {#if appStore.state.characters.length === 0}
              <div class="px-4 py-3 text-sm text-muted-foreground">
                Nenhum personagem criado
              </div>
            {:else}
              {#each appStore.state.characters as char}
                <button
                  type="button"
                  onclick={() => selectCharacter(char.id)}
                  class="w-full text-left px-4 py-2 hover:bg-hover transition-colors flex items-center space-x-3"
                >
                  <span class="text-lg"><User size={18} /></span>
                  <div class="flex-1">
                    <div class="font-medium">{char.name}</div>
                    <div class="text-xs text-muted-foreground">
                      {char.race?.name || 'Sem raça'} {char.class?.name || 'Sem classe'} - Nível {char.level}
                    </div>
                  </div>
                  {#if appStore.state.activeCharacterId === char.id}
                    <Check size={16} class="text-primary" />
                  {/if}
                </button>
              {/each}
            {/if}
          </div>
        {/snippet}
      </Dropdown>

      <!-- Botão criar novo personagem -->
      <Button
        onclick={handleNewCharacter}
        class="w-full justify-start flex items-center"
        variant="secondary"
      >
        <span class="mr-2"><PlusCircle size={20} /></span>
        {#if appStore.state.sidebarOpen}
          Criar Novo Personagem
        {/if}
      </Button>
    </div>

    <!-- Toggle sidebar button -->
    <div class="p-4 border-t border-border">
      <button
        type="button"
        onclick={() => appStore.toggleSidebar()}
        class="w-full p-2 hover:bg-hover rounded-lg transition-colors flex items-center justify-center"
      >
        {#if appStore.state.sidebarOpen}
          <PanelLeftClose size={20} />
        {:else}
          <PanelLeftOpen size={20} />
        {/if}
      </button>
    </div>
  </Sidebar>

  <!-- Main content -->
  <div
    class="flex-1 transition-all duration-300"
    style="margin-left: {appStore.state.sidebarOpen ? '16rem' : '4rem'}"
  >
    {#if appStore.activeCharacter}
      <!-- Tabs -->
      <Tabs bind:activeTab={appStore.state.activeTab} {tabs} class="sticky top-0 z-30" />

      <!-- Content area -->
      <div class="p-6">
        {@render children?.()}
      </div>
    {:else}
      <div class="flex items-center justify-center h-screen">
        <div class="text-center space-y-4 flex flex-col items-center">
          <div class="text-6xl text-muted-foreground/30"><Dices size={64} /></div>
          <h2 class="text-2xl font-bold">Nenhum personagem selecionado</h2>
          <p class="text-muted-foreground">Selecione um personagem ou crie um novo</p>
          <Button onclick={handleNewCharacter}>
            Criar Novo Personagem
          </Button>
        </div>
      </div>
    {/if}
  </div>
</div>