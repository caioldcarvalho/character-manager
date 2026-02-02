<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    class: className,
    type = "text",
    value = $bindable(),
    ...rest
  }: {
    class?: string;
    type?: string;
    value?: any;
    [key: string]: any;
  } = $props();
</script>

<input
  {type}
  bind:value
  class={cn(
    "flex h-10 w-full rounded-md border border-input bg-[var(--glass-bg-light)] backdrop-blur-sm text-foreground px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-[var(--transition-base)]",
    className
  )}
  {...rest}
/>
