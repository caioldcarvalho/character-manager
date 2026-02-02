<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    variant = "default",
    size = "default",
    class: className,
    children,
    ...rest
  }: {
    variant?: "default" | "secondary" | "outline" | "ghost" | "gradient";
    size?: "default" | "sm" | "lg" | "icon";
    class?: string;
    children?: any;
    [key: string]: any;
  } = $props();

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
    ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
    gradient: "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:shadow-[var(--glow-primary-subtle)]",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
</script>

<button
  class={cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-[var(--transition-base)] hover:scale-[1.02] active:scale-[0.98]",
    variants[variant],
    sizes[size],
    className
  )}
  {...rest}
>
  {@render children?.()}
</button>
