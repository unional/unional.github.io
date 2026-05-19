---
title: Layer Override
---

## Layer Override

Tailwind supports layer override, but it is not well documented.

## Problem Summary

Tailwind supports layer override, but it is not well documented.

## Solution

```css
@layer theme, base, repobuddy-storybook, components, utilities;

@layer repobuddy-storybook {
  :root, :host {
    --tw-color-sky-100: red;
  }
}
```
