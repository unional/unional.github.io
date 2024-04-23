---
title: Say no to DRY
---

DRY is not the objective. DRY is the result.

Often times we would pick up the daunting task of refactoring because we don't want to see duplicate code.

However, during refactoring, if our sole focus is to eliminate the duplication,
we will often end up with bad code.

> Programming = art of taking things away

You see, when we write code, we are actually constraining what the computer can do.
If you tell the computer to start executing some "code" in a randomized memory, it can perform anything, although likely not that useful to us.

Thus, you can look at programming as activities that constrain and relax what the computer will do, so that at the end you will receive what you want.

Every line of code you write is about compromise.

When you refactor the code, you are re-implementing the code differently,
and by doing that, you remove some of its flexibility.

What flexibility you remove depends on how do you refactor it.

If you have a good idea on what the goal is, or the impact of the trade-off, go ahead.

However, many times you don't.

A lot of time it is a good idea to wait a little until a pattern emerges.
