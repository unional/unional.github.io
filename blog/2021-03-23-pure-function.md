---
slug: pure-function
title: What is Pure Function anyway
author: Unional
author_title: Clean Architect
author_url: https://github.com/unional
author_image_url: https://avatars0.githubusercontent.com/unional?s=400&v=4
tags: [functional programming, just-func]
---

In the last blog,
I said that pure function is the only requirement to do functional programming.

But what is a pure function? Subsequently,

- When is a function impure?
- What can I gain or lose when I write a pure/impure function?
- Can I convert an impure function to a pure function?
- Can I detect impure function programmatically?
- Should I allow impure function in `just-func`?

That's today's topic.

A quick search on the web and you will find that pure function is defined as:

- function with no side effect, and
- if you give it input `a`, it will always return output `b`.

But that is describing the characteristic of pure function.
It's like defining apple as red and sweet.

Instead, I would define a pure function as:

> A pure function is equivalent to a mathematic formula

In the world of mathematic,
there is no such thing as side effects.
It is also obvious that,
when you apply a formula with a specific set of variables,
you will always get the same result.

That's pure function.

Since I'm at it, let's also talk about side effects.

What is a side effect?

A side effect means it is not the primary effect.

The primary effect of functions is producing output,
as we often describe functions as **input-process-output**:
when you give it something, it gives you something back.

Anything other than that is a side effect.

Some side effects are obvious, for example:

- writing to the database
- updating the display
- writing to a file
- making a network request

As you able to find this blog,
I'm sure you already know these,
so I'm not going into them.

But how about changing states?

Yes, changing states is more closely related to immutability.
And that's another topic that worth having its own blog.

But they are closely related, as I mentioned in the previous blog,
immutability is one of the derivatives for the function to be pure.

So let's talk about that.

-------

While I use the term "changing state" above,
it is not very accurate.
I use that term because that's what people understand and aware of.

To be precise, or to expand the boundary in your mind a little bit,
the state of the program is constantly changing. Even in functional programming.

Time passes, the instruction pointer moves around,
the bits in your RAM changes,
electrons moves around in your computer and turns into heat.

You can say this is nitpicking.
Yes I am, but I'm doing that because I want you to look at the problem at a bigger picture.

And as for the common understanding of **state** in programming,
it is referring to the **collective values in the program at a given point in time**.

If you look at the program as a state machine,
the word **state** means a particular state in that state machine.

But hold one a second, we are talking about functional programming,
does the concept of state machine applies?

Yes it does, to some degree. And that's precisely why I mention **instruction pointer** and RAM in the first place.

But as you can see, it starts to dilute and stretch the meaning of **state** as you know it.

In order to avoid confusion,
lets update our question to:

> Are changing references or referenced value considered as side effects?

And the answer to that question is clearly depends on what kind of variables we are talking about.

Here are four kinds of variables:

- local variables
- input variables
- return variables
- closure variables

On top of that, we also need to consider if the variable is:

- primitive: number, boolean, character, string (depends on the language)
- composite: object, array, instance, string (depends on the language)
- pass by value
- pass by reference

Lets eliminate the obvious first,

> if the variables are local to the function, changing them is not a side effect.
>
> if the variables are pass by value, changing them is not a side effect.

I could make another blanket statement that if the variables are pass by reference,
changing them is a side effect.

However, remember that I'm designing [`just-func`][just-func],
so I need to go deeper into it.

Before I talk about input and output variables,
I need to first talk about closure variables.

As you will see, whether they are input or output variables does not matter that much.
The key factor is about the closure.

By closure I mean:

> closure is the record storing the references that a function have access to

Closure are organized into scopes.
A function can access to every references in its scope and go up hieratically to the root inside the closure.

For example:

```ts
import { foo } from './foo'

// module scope

export function start() {
  // declaring `x` in the local scope of `start()`
  let x = 0

  // declaring `exec()` in the local scope of `start()`
  function exec() {
    // declaring `y` in the local scope of `exec()`
    let y = 1
    if (
      // accessing module scope
      foo(
        // accessing parent scope
        x,
        // accessing local scope
        y
      )
    ) {
      // accessing global scope
      process.exit()
    }
  }

  // accessing local scope
  exec()
}
```

In the example above, there are four scopes in the closure for `exec()`:
`global > module > start > exec`.


Closure itself is a pretty complex topic, so I'll have another blog talking about it.


[just-func]: https://github.com/justland/just-func
