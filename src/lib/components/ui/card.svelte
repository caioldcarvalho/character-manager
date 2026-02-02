<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    variant = 'default',
    class: className,
    children,
    ...rest
  }: {
    variant?: 'default' | 'glass';
    class?: string;
    children?: any;
    [key: string]: any;
  } = $props();

  const variants = {
    default: 'bg-card border-border',
    glass: 'bg-[var(--glass-bg)] border-[var(--glass-border)] backdrop-blur-[var(--glass-blur)] hover:border-primary/30 transition-[var(--transition-base)]'
  };
</script>

<div
  class={cn(
    "rounded-lg border text-card-foreground shadow-sm",
    variants[variant],
    className
  )}
  {...rest}
>
  {@render children?.()}
</div>
