# Testing Plugin Architecture

When writing a plugin framework, the tests written in the framework repository tends to be generic and general.

Some bugs discovered in the plugins could be hard to reproduce without the full knowledge of the plugin or have a substantial part of the plugin code available.

How can I write tests for these kinds of bugs in the framework repository?

One example is [komondor][1] and [komondor-plugin-node][2]

Say there is a bug found in [komondor-plugin-node][2], but in order to reproduce the bug, it basically needs to get the whole plugin into the framework.

One way to do that is to copy all relevant code into the framework, but that means those code will be staled over time, and the code copied could be substantial.

Another way is to include [komondor-plugin-node][2] as devDependency of [komondor][1]



  [1]: https://github.com/unional/komondor
  [2]: https://github.com/unional/komondor-plugin-node
