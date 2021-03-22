# Problem statement

I see this as a form of use-case definition.

Example form: <https://youtu.be/0Zbh_vmAKvk?t=8m47s>

error.Value
(rsc) A problem that we have in very low-level libraries is that everything depends on `os` for `os.Error`,
so it's hard to do things that os itself can use (like `time.Nano` below).
If not for `os.Error`, package `os` would not be depended on by nearly so many packages.
Computation-only packages like `hash/*` or `strconv` or `strings` or `bytes` would not need to mention it, for example.
I plan to explore (not yet proposing) defining a package `error` with an API of approximately:

  ...

## Take away

- It is important to describe the significance of the problem
  - People reject an idea most of the time due to unable to see the significant of the issue
  - Without realizing the significance, they will evaluate the problem solely based on the complexity and the cost, which always end up as "no"
- It is important to provide concrete example to demonstrate the problem
  - Without clear, real-life example, people will not be able to comprehand the problem
  - i.e. package A depends on package B is not sufficient
  - `redux-thunk` depends on `redux` is better

## Experience Reports

Let your user to create experience report on what is their experience of using your product.

It should best include the following:

- What we wanted to do
- What we actually did
- Why that wasn't great
- illustrating those by real concrete examples, ideally from productino use.

<https://golang.org/wiki/ExperienceReports>
