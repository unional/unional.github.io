# Immutability

In the last blog,
I go through the only requirement to write functional programming code: the ability to write pure function.

In this blog, I'll do a deep dive into the first derivatives characteristic of pure function: immutability.

Immutability means that after you defined something, you cannot change it later on.
Immutability brings a lot of inconvenience,
but at the same time brings a lot of benefits.
For example:

- 👍 easy to read
- 👍 easy to test
- 👍 easy to compare
- 👍 caching, low memory footprint
- 👍 enable optimization
- 👍 thread safe
- 👍 enforce functions to be pure
- 👍 pass by reference
- 👎 copy instead of mutate
- 👎 cyclic data is hard
- 👎 discourage large object

## References

- <https://www.learnsteps.com/mutable-vs-immutable-datastructures/>
- <https://stackoverflow.com/questions/1863515/pros-cons-of-immutability-vs-mutability>
