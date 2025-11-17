<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    open = $bindable(true),
    class: className,
    children,
  }: {
    open?: boolean;
    class?: string;
    children?: any;
  } = $props();
</script>

<aside
  class={cn(
    "fixed left-0 top-0 h-screen bg-sidebar border-r border-border transition-all duration-300 z-40",
    open ? "w-64" : "w-16",
    className
  )}
>
  <div class="flex flex-col h-full">
    {@render children?.()}
  </div>
</aside>
