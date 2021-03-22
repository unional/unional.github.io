---
slug: what-is-fp
title: What is Functional Programming
author: Unional
author_title: Clean Architect
author_url: https://github.com/unional
author_image_url: https://avatars0.githubusercontent.com/unional?s=400&v=4
tags: [functional programming, just-func]
---

I have been promoting and migrating from Object Oriented Programming to Functional Programing for many years, and I loved it.

But just like everything,
the more you dig into it, the more you realize what you do not know.

Recently I have been working on [`just-func`](https://github.com/justland/just-func).

I want to design it to be a homoiconic, functional programming language.

But when I put my finger to it,
I start wondering what exactly is functional programming.

When people talk about functional programming,
they often talk about languages such as Lisp, Haskell, F#, Clojure, etc.

But can you do functional programming in other languages?

Of course! You can do it in JavaScript/TypeScript,
and you can do it in C#, Java, and even C++.

They also talk about recursion, immutability, monoid, monad, functor, etc.

So do they define functional programming?

In order to design [`just-func`](https://github.com/justland/just-func) correctly,
I send myself on a small research journey.

## Functional Programming Paradigm

Functional Programming (FP) is a paradigm,
just like Object Oriented Programming (OOP) is a paradigm.

FP has its root in lambda calculus, which is a subset of category theory.

Therefore, to understand FP, we should first understand category theory.

There is a lot to learn about FP from category theory.
But in this blog, we only need to answer the very first question: what is a category?

Bartosz Milewski's excellent book [Category Theory for Programmers][category-theory-for-programmers] has the perfect description:

> A category consists of objects and arrows that go between them.

To paraphrase and expand that a bit,
it is about *a set of transformations `f`* that transforms *a set of objects `a`* to *a set of objects `b`*.

i.e.: `f(a) -> b`

It is a function!

In fact, if we look at this closely,
we can derive the two basic *requirements* of FP:

1. Since we are talking about mathematics, this function `f(a) -> b` must be pure.
2. `a` and `b` are just *set of objects*, this means they can be anything:\
   values (such as string and numbers), set of values (such as array, list, vector, object),\
   functions (higher-order function), or set of functions (generics)

Any other characteristics of FP are just derivatives of these two requirements.
Let me list a few here:

- immutable data: this is needed in order for the function to be pure
- first-class function: this preferred (but not required) so that we can use *a set of functions* for `a` or `b`
- closure: this is preferred (but not required) so that we can do more with functions such as partial applications or delay execution.
- declarative programming: this is the result of no needed to mutate data.
- recursion instead of looping: this is the result of not able to mutate data

Notice that in "we can derive the two basic *requirements* of FP" I made the word *requirements* italic,
and I also mentioned that "first-class function* is preferred but not required.

It is because we can always wrap a function in an object and pass it along.
It is very clumsy but is doable.
That is how you write functional code in OOP languages such as Java and C#.

Therefore, the ONLY requirement of FP is pure function.

Of course, that is a lot more going on, such as composition, associativity, monoid, monad, functor, etc.

But those are categorizations and extensions to this simple concept.

I will talk about them at a later time.

Happy coding!

## References

- [Clean Coders Humane Code Series](https://cleancoders.com/series/humane-code-real)
- [Clean Coders Functional Programming Series](https://cleancoders.com/series/clean-code/functional-programming)
- [Category Theory For Programmers][category-theory-for-programmers]
- <https://www.tutorialspoint.com/functional_programming/functional_programming_introduction.htm>
- <https://en.wikipedia.org/wiki/Functional_programming>
- <https://www.guru99.com/functional-programming-tutorial.html>

[category-theory-for-programmers]: https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/
