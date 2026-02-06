<script lang="ts">
  import { appStore } from '$lib/stores/app.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Dropdown from '$lib/components/ui/dropdown.svelte';
  import type { Note } from '$lib/types';
  import { generateId, formatDate } from '$lib/utils/character';
  import { Plus, Search, Pin, Edit2, Trash2, Save, X } from 'lucide-svelte';

  const character = $derived(appStore.activeCharacter);

  let searchQuery = $state('');
  let categoryFilter = $state<Note['category'] | 'all'>('all');
  let editingNote = $state<Note | null>(null);
  let editContent = $state({ title: '', content: '', category: 'general' as Note['category'] });
  let dropdownOpen = $state(false);

  const categories: Array<{ value: Note['category'] | 'all'; label: string }> = [
    { value: 'all', label: 'Todas' },
    { value: 'general', label: 'Geral' },
    { value: 'quest', label: 'Missão' },
    { value: 'npc', label: 'NPC' },
    { value: 'location', label: 'Local' },
    { value: 'lore', label: 'História' },
    { value: 'combat', label: 'Combate' }
  ];

  const categoryColors: Record<Note['category'], string> = {
    general: 'bg-neutral/20 border-neutral/30',
    quest: 'bg-warning/20 border-warning/30',
    npc: 'bg-info/20 border-info/30',
    location: 'bg-success/20 border-success/30',
    lore: 'bg-magic/20 border-magic/30',
    combat: 'bg-danger/20 border-danger/30'
  };

  const filteredNotes = $derived(() => {
    if (!character) return [];

    return character.notes
      .filter(note => {
        const matchesSearch = !searchQuery ||
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  });

  const pinnedNotes = $derived(filteredNotes().filter(n => n.pinned));
  const unpinnedNotes = $derived(filteredNotes().filter(n => !n.pinned));

  function startNewNote() {
    editContent = { title: 'Nova Nota', content: '', category: 'general' };
    editingNote = {
      id: generateId(),
      title: 'Nova Nota',
      content: '',
      category: 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false
    };
  }

  function startEdit(note: Note) {
    editingNote = note;
    editContent = { title: note.title, content: note.content, category: note.category };
  }

  function saveNote() {
    if (!character || !editingNote) return;

    const isNew = !character.notes.find(n => n.id === editingNote.id);
    const updatedNote: Note = {
      ...editingNote,
      title: editContent.title.trim() || 'Sem Título',
      content: editContent.content.slice(0, 5000),
      category: editContent.category,
      updatedAt: new Date().toISOString()
    };

    if (isNew) {
      appStore.addNote(character.id, updatedNote);
    } else {
      appStore.updateNote(character.id, updatedNote.id, updatedNote);
    }

    cancelEdit();
  }

  function cancelEdit() {
    editingNote = null;
    editContent = { title: '', content: '', category: 'general' };
  }

  function deleteNote(noteId: string) {
    if (character && confirm('Deletar esta nota?')) {
      appStore.deleteNote(character.id, noteId);
    }
  }

  function togglePin(noteId: string) {
    if (character) {
      appStore.toggleNotePin(character.id, noteId);
    }
  }
</script>

{#if character}
  <div class="space-y-6">
    <!-- Header -->
    <Card variant="glass" class="p-6 animate-fade-in">
      <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div class="flex-1 flex gap-3 w-full md:w-auto">
          <div class="relative flex-1">
            <Search size={20} class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              bind:value={searchQuery}
              placeholder="Buscar notas..."
              class="pl-10"
            />
          </div>
          <Dropdown bind:open={dropdownOpen}>
            {#snippet trigger()}
              <Button variant="outline" class="whitespace-nowrap">
                {categories.find(c => c.value === categoryFilter)?.label}
              </Button>
            {/snippet}
            {#snippet content()}
              {#each categories as cat}
                <button
                  onclick={() => categoryFilter = cat.value}
                  class="w-full px-4 py-2 text-left hover:bg-hover transition-colors {categoryFilter === cat.value ? 'bg-primary/20' : ''}"
                >
                  {cat.label}
                </button>
              {/each}
            {/snippet}
          </Dropdown>
        </div>
        <Button variant="gradient" onclick={startNewNote}>
          <Plus size={16} /> Nova Nota
        </Button>
      </div>
    </Card>

    <!-- Edit Modal -->
    {#if editingNote}
      <Card variant="glass" class="p-6 animate-fade-in border-primary/50">
        <h3 class="text-lg font-bold mb-4">{character.notes.find(n => n.id === editingNote?.id) ? 'Editar Nota' : 'Nova Nota'}</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Título</label>
            <Input bind:value={editContent.title} placeholder="Título da nota" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Categoria</label>
            <select
              bind:value={editContent.category}
              class="w-full px-3 py-2 bg-[var(--glass-bg-light)] backdrop-blur-sm border border-input rounded-md text-foreground transition-[var(--transition-base)]"
            >
              {#each categories.slice(1) as cat}
                <option value={cat.value}>{cat.label}</option>
              {/each}
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">
              Conteúdo ({editContent.content.length}/5000)
            </label>
            <textarea
              bind:value={editContent.content}
              placeholder="Escreva sua nota aqui..."
              maxlength="5000"
              rows="8"
              class="w-full px-3 py-2 bg-[var(--glass-bg-light)] backdrop-blur-sm border border-input rounded-md text-foreground resize-none transition-[var(--transition-base)] focus:ring-2 focus:ring-primary/30 focus:border-primary"
            ></textarea>
          </div>

          <div class="flex gap-2">
            <Button variant="gradient" onclick={saveNote} class="flex-1">
              <Save size={16} /> Salvar
            </Button>
            <Button variant="outline" onclick={cancelEdit}>
              <X size={16} /> Cancelar
            </Button>
          </div>
        </div>
      </Card>
    {/if}

    <!-- Pinned Notes -->
    {#if pinnedNotes.length > 0}
      <div>
        <h3 class="text-lg font-bold mb-3 flex items-center gap-2">
          <Pin size={20} class="text-primary" /> Fixadas
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each pinnedNotes as note (note.id)}
            <Card variant="glass" class="p-4 hover:border-primary/50 transition-all animate-fade-in">
              <div class="flex items-start justify-between mb-2">
                <span class="text-xs px-2 py-1 rounded border {categoryColors[note.category]}">
                  {categories.find(c => c.value === note.category)?.label}
                </span>
                <div class="flex gap-1">
                  <button
                    onclick={() => togglePin(note.id)}
                    class="p-1 hover:bg-hover rounded transition-colors"
                    aria-label="Desfixar"
                  >
                    <Pin size={16} class="text-primary fill-primary" />
                  </button>
                  <button
                    onclick={() => startEdit(note)}
                    class="p-1 hover:bg-hover rounded transition-colors"
                    aria-label="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onclick={() => deleteNote(note.id)}
                    class="p-1 hover:bg-hover rounded transition-colors text-danger"
                    aria-label="Deletar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h4 class="font-bold mb-2">{note.title}</h4>
              <p class="text-sm text-muted-foreground line-clamp-3 mb-2">{note.content || 'Nota vazia'}</p>
              <div class="text-xs text-muted-foreground">
                {formatDate(note.updatedAt)}
              </div>
            </Card>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Other Notes -->
    {#if unpinnedNotes.length > 0}
      <div>
        <h3 class="text-lg font-bold mb-3 text-foreground">Outras Notas</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each unpinnedNotes as note (note.id)}
            <Card variant="glass" class="p-4 hover:border-primary/50 transition-all animate-fade-in">
              <div class="flex items-start justify-between mb-2">
                <span class="text-xs px-2 py-1 rounded border {categoryColors[note.category]}">
                  {categories.find(c => c.value === note.category)?.label}
                </span>
                <div class="flex gap-1">
                  <button
                    onclick={() => togglePin(note.id)}
                    class="p-1 hover:bg-hover rounded transition-colors"
                    aria-label="Fixar"
                  >
                    <Pin size={16} />
                  </button>
                  <button
                    onclick={() => startEdit(note)}
                    class="p-1 hover:bg-hover rounded transition-colors"
                    aria-label="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onclick={() => deleteNote(note.id)}
                    class="p-1 hover:bg-hover rounded transition-colors text-danger"
                    aria-label="Deletar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h4 class="font-bold mb-2">{note.title}</h4>
              <p class="text-sm text-muted-foreground line-clamp-3 mb-2">{note.content || 'Nota vazia'}</p>
              <div class="text-xs text-muted-foreground">
                {formatDate(note.updatedAt)}
              </div>
            </Card>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Empty State -->
    {#if filteredNotes().length === 0}
      <Card variant="glass" class="p-12 text-center animate-fade-in">
        <h3 class="text-xl font-semibold mb-2">Nenhuma nota encontrada</h3>
        <p class="text-muted-foreground mb-4">
          {searchQuery || categoryFilter !== 'all'
            ? 'Tente ajustar os filtros de busca'
            : 'Crie sua primeira nota para começar!'}
        </p>
        {#if !searchQuery && categoryFilter === 'all'}
          <Button variant="gradient" onclick={startNewNote}>
            <Plus size={16} /> Criar Nota
          </Button>
        {/if}
      </Card>
    {/if}
  </div>
{/if}
