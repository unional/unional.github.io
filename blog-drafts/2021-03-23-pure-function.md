---
slug: pure-function
title: Pure Function and beyond
author: [unional]
tags: [functional programming, just-func]
---

What is pure function?
The typical definition of pure function is defined by these two constraints:

- a function with no side effect, and
- for a given input, it always returns the same output

In the [What is Functional Programming](https://unional.github.io/blog/what-is-fp) blog,
I said that pure function is the only requirement to do functional programming.

That description is slightly off.

To be 100% precise,
we are looking for a category of functions that can be used to model the mathematic formula.

The result is pure function.

That's why pure function is defined by how it behave,
rather than what it stands for.

How does a pure function looks like?
What can we do in a pure function?
What are the things that we do will make the function impure?

That's what we are going to look into today.

After that,
I will end with a brief touch on the deficiency of pure function and functional programming langauge.

So let's get started.

There are many forms of pure function,
from simple to complex to controversal.

To discover these forms,
one good way is to analyze the two constraints:

- a function with no side effect, and
- for a given input, it always returns the same output

What does it mean by **a function with no side effect**?

Side effect means changing the state of the application or its environment.
Note that there are exception to this.
But for now,
we can consider it at its face value.

How can you create side effects?
There are two ways:

- assignment
- calling function that has side effects

That means if your function is not making assignment or calling other functions,
we can tell if the function is a pure function or not based on the second criteria.
These are the simple pure functions.

The simplest one is a function that does not take any parameter and returns nothing.

```ts
function doNothing() {}
```

There are some subtle differences about what does nothing means in various languages.
They could be void, null, undefined, empty, or never.



Depends on the language, there can be 3 different variations of **nothing**:
void, null, or empty

They can apply to both parameter and return value, creating 6 different permutations.

**void** means nothing. It is commonly used indicating the

Nothing|void means not expecting anything, not even **undefined**.
This is best described by the **Void** type in Haskell.

```haskell
doNothing :: Void -> Void
```

There are 4 kinds of simple pure functions.

The first one is

and always returns the same output, it is a pure function.

These functions are often called constant function:

```ts
function giveMeFive(): 5 {
  return 5
}
```

One special form fo constant function is a void function,
meaning it






In particular, these characteristics allow us to:

- reference immutable data in scope chain
- self-referencing: referring to the function itself inside the body of the function.
- pass function in variable

In term of language design, this draws an important conclusion:

> While functional programming has its root in mathematics,
> programming is a different domain and the circumstances are different.
> So applying abstractions and restrictions to make the problem align with the metaphor we start with would severely limit our ability to express ourselves and solve the problem efficiently.

This is actually a breakthrough for myself in my journey of defining `just-func`.
But that's a different story and I'll cover it in another blog.

Back to the topic of pure function,
let's go through a few examples to show the basic forms of pure functions.

## scope-independent function

This is the simplest form and also the most restrictive:

```ts
function inc(x: number) {
  return x + 1
}
```

Scope-independent function does not access any references in the scope chain.

## immutable scoped function

Function in this form access immutable references in the scope chain.

There are several variations:

```ts
// access global scope
// global.ts
global.VALUE = 1

// plusOne.ts
function plusOne() {
  return global.VALUE + 1
}
```

```ts
// access local scope
const VALUE = 1
function plusOne() {
  return VALUE + 1
}
```

```ts
// access import reference
// constant.ts
export const VALUE = 1

// plusOne.ts
import { VALUE } from './constant'

function plusOne() {
  return VALUE + 1
}
```

```ts
// access parent scope
function main() {
  const VALUE = 1
  function plusOne() {
    return VALUE + 1
  }
}
```

Note that the reference can be a value or a function.

## immutable closure function

As a slightly modified form of immutable scope function,
when you define a function within another function and return it,
(i.e. creating a higher-order function),
the returned function need to access the variables and references in the scope-chain when it is defined.

This is what we call closure.

When the function access only immutable references, that's immutable closure function:

```ts
import { foo } from './foo'

const LOCAL = 'l'

function create() {
  const SCOPE = 'b'
  return function immutableClosureFunction() {
    return foo(LOCAL, SCOPE)
  }
}
```

## other forms

So far we have covered the basic forms of pure functions.
Are there other forms of pure functions?



- EachAll variables are provided in the algorithm.
- One function can can call other functions
-


From the original of functional programming,
pure function is the kind of function

Pure function is often defined by its characteristics:


Why do we define them by its characteristics?
It's like defining an apple is red and sweet.
While it is useful and delicious,
we might miss all the other apples that are green, yellow, and sour.

In this blog,
I'm going to go up, down, and sideway around the definition of pure function.
Hopefully at the end it gives you some new insight of what it is,
and what it can look like in future languages.

## Pure function as math formula

When trace back to the root of functional programming,
the definition is straight forward:

> A pure function is equivalent to a mathematic formula

In the world of mathematic,
there is no such thing as side effects.
It is also obvious that,
when you apply a formula with a specific set of variables,
you will always get the same result.

If we based on this definition and try to model pure function,
we will come up with a few more characteristics:

- Each function is self-contained. All variables are provided in the algorithm.
- One function can can call other functions



From this definition,
there is actually something very critical,
but I'll leave that in another blog post.




While it is definitely useful,
I want to look for a definition that describe what it is,
instead of how it behaves.

It's like defining an apple is red and sweet.
While it is useful and delicious,
we might miss all the other apples that are green, yellow, and sour.



A quick search on the web and you will find that pure function is often defined as:

- function with no side effect, and
- if you give it input `a`, it will always return output `b`.

But that is describing the characteristic of pure function.
It's like defining apple as red and sweet.

Instead, I would prefer defining a pure function as:

> A pure function is equivalent to a mathematic formula

In the world of mathematic,


In the world of mathematic,
there is no such thing as side effects.
It is also obvious that,
when you apply a formula with a specific set of variables,
you will always get the same result.

After we defined what a pure function is,
there are some questions we have to answer:

- How does a pure function look like?
- How do determine a function is impure?
- When it is a pure function, what are the benefits?
- What do I lose?
- Can an impure function convert to a pure function?

## The Shape of Pure Function



I have break down the answer to these questions in two sections.
The first one is answering these questions based on the common perception of pure function,
and the extended idea which I investigate into.

## Typical Pure Function





That's pure function.

With that out of the way, why do we care about pure function?

 Subsequently,

- What can I gain or lose when I write a pure/impure function?
- When is a function impure?
- Can I convert an impure function to a pure function?
- Can I detect impure function programmatically?
- Should I allow impure function in `just-func`?


So then, what are the benefits and drawbacks of pure functions?

The answer to this question depends on the what do you refer to as pure function.




- 👍 easy to read*
- 👍 easy to test*
- 👍 easy to compare
- 👍 caching, low memory footprint
- 👍 enable optimization
- 👍 thread safe
- 👍 enforce functions to be pure
- 👍 pass by reference
- 👎 copy instead of mutate
- 👎 cyclic data is hard
- 👎 discourage large object

As for drawbacks, it is also pretty obvious.

- depends on the definition and expansion of pure function.
- there are ways to mitigate the drawbacks.

----




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
Immutability is another big topic
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
