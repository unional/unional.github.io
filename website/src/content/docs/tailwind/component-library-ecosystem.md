---
title: Build a Working Component Library Ecosystem with Tailwind
---

## Build a Working Component Library Ecosystem with Tailwind

This proposal describes how to create and consume a component library written with Tailwind CSS in a way that stays consistent with css order of appearance and can be consumed by any application, including complex applications like MFE with runtime component injection.

## Problem Summary

There are many challenges to ship a Tailwind-based component library that “just works” in any app.

1. **CSS definition conflicts** - Each component library may have different CSS definitions for the same class name.
2. **CSS order of appearance** - The order of the CSS rules determines which rule wins, regardless of the order of the CSS classes in the HTML.
3. **Variant usage vs. variant mechanism** - A library may use variants (e.g. `dark:`, `rtl:`, `reduced-motion:`), but *how* those variants are implemented (selector strategy, media query, etc.) varies from application to application.
4. **Tailwind prefix merge** - When components and their CSS are injected at runtime, there is no way to enforce CSS order of appearance. Tools like `tailwind-merge` is needed to remove conflicting classes. However, there are limitations to the typical `className: string` approach.

### 1. CSS definition conflicts

Different libraries (or the same library in different versions) can emit different CSS for the same Tailwind class name. For example, one build might define `rounded-lg` as `border-radius: 0.5rem` while another uses `0.75rem`; or `bg-primary` might map to different theme values. When an app composes multiple Tailwind-based libraries or overrides the theme, the same class name can therefore resolve to different computed styles. That leads to visual inconsistency and bugs that are hard to track down, because the HTML and class names look correct—only the underlying CSS differs.

> [!NOTE] Solution:
>
> Each library uses its own prefix to avoid conflicts.
>
> When an app wants to customize the library's CSS, it can either:
>
> - override the library's CSS tokens
> - merge Tailwind classes to remove conflicting classes

### 2. CSS order of appearance

When multiple libraries (or the application itself) are using the same Tailwind classes, the order of appearance of the CSS rules determines which rule wins, regardless of the order of the CSS classes in the HTML.

for example, in the following code:

```tsx
<div className="bg-red-500 bg-blue-500">blue?</div>

<div className="bg-blue-500 bg-red-500">red?</div>
```

Only one of the two divs will be colored correctly, depending on the order of the CSS rules.

This means when a library is develop in isolation, the order of the CSS rules is not guaranteed to be the same as when the library is used in the application.

> [!NOTE] Solution:
>
> Each library uses its own prefix to avoid conflicts.

### 3. Variant usage vs. variant mechanism

A library declares **variant usage** when it uses classes like `dark:bg-zinc-800` or `rtl:ml-4`—it is saying “this component depends on a `dark` (or `rtl`) variant being available.”

The **variant mechanism** is how that variant is implemented: e.g. a class on an ancestor (`.dark`), a media query (`prefers-color-scheme: dark`), or a data attribute. That choice is application-specific.

If the library ships pre-built CSS, it was built with one mechanism; the app might use another. Then the library’s `dark:` rules might never apply, or might conflict with the app’s dark-mode strategy. So the library should only depend on the *existence* of named variants; the application must own *how* those variants are defined so that a single build can use one consistent mechanism.

> [!WARNING] Solution:
>
> The library should share its Tailwind configuration,
> and potentially its source code.
>
> The application's Tailwind configuration should include the library's Tailwind configuration, so that the application can define the variant mechanism and generate the actual CSS.
>
> ⚠️ The problem is Tailwind currently does not support multiple prefixes.
>
> 💡 Alternatively, use `postcss` to alter the variant mechanism of the library's CSS.

### 4. Tailwind prefix merge

With component libraries (and the application itself) using their own prefixes, there is a need to be able to merge Tailwind classes of different prefixes.

There is [a way to do it](https://github.com/dcastil/tailwind-merge/issues/412), but it requires the `twMerge` function to know all prefixes ahead of time.

However, the `twMerge` is defined and used by each component library. This is because typically the prop `className` is of type `string`, so the merge can only happen within the component.

> [!WARNING] Solution:
>
> ⚠️ Tailwind prefix syntax needs to be identifiable by syntax, so that `twMerge` can detect and merge conflicting classes correctly.
> This is not a complete solution, as there could be custom `@utilities` that requires further customization to the `twMerge` function.
>
> To solve that, then the `tailwind-merge` package needs to be able to be configured globally, using some global storage (module scope is not enough as there could be multiple instances of the package).
>
> ⚠️ Alternatively, we need to invert the flow of control and change the `className` type to a function `(state: { className: string } & OtherStates) => string`.
>
> This would allow the `twMerge` to be defined and used at the application level, which knows about all prefixes in use.
>
> [react-aria-components](https://github.com/adobe/react-spectrum) support this, and I'm generalizing it in [@just-web/toolkit](https://github.com/justland/just-web-foundation) (WIP).
>
> We can also define a convention for component libraries to expose how to customize the `twMerge` function.

## Solution

Component libraries should:

- prefix their classes with a unique prefix.
- share their Tailwind configuration with the application
- share their source code (unless Tailwind can can recommend to `@source` from the bundled code)
- share their `tailwind-merge` configuration, or a standardized merge configuration.
- list the variants they use, so that the application can define the variant mechanism and generate the actual CSS.
- Support
- provide overload of `className` to accept a callback.
- (optional) ship a pre-built CSS file for standalone / script-tag usage.

Application should:

- create a single Tailwind config that composes the configuration from each component library and the application's own styles.
  - ⚠️ this requires Tailwind to support multiple prefixes in a single config.
- define the `@custom-variant` declarations for each variant the application and the component libraries use.
- Use the callback overload of `className` to customize the Tailwind classes when merging is needed.

Tailwind should:

- support multiple prefixes in a single config.
- (optional) improve syntax to identify prefixes
- (optional) define a standard merge configuration for `tailwind-merge` or other tools to merge conflicting classes.

## Other considerations

### When the Library Might Define Variants

- **Internal-only variants** — If the library invents a variant that has no standard (e.g. `data-state="open"`) and documents it as “add this to your app’s CSS if you use our components,” that’s still the app including a snippet. So the “mechanism” is still in the app’s stylesheet; the library only specifies the contract.
- **Default snippet** — The library can ship a default `@custom-variant dark ...` in a **non-emitted** file (e.g. “copy this into your app”) or in a preset that the app explicitly merges. Then the app can replace it with its own. So the app remains in control; the library only suggests a default. or Tailwind will override the `@custom-variant` declaration based on the order of appearance in the Tailwind config.

### Cascade Layers

Each library can add their CSS in a dedicated layer, so that the order of appearance is determined by the layer, not by the order of the CSS files. This decision can be made at the component library level, or at the application level.

⚠️ However, currently this is not supported by Tailwind. The `@source` does not support `@layer`.

This can be an additional enhancement to handle the case when two component libraries happens to use the same prefix (or the application needs to load multiple versions of the same library).
