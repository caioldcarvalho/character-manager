<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    class: className,
    children,
    ...rest
  }: {
    class?: string;
    children?: any;
    [key: string]: any;
  } = $props();
</script>

<label
  class={cn(
    "text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    className
  )}
  {...rest}
>
  {@render children?.()}
</label>
