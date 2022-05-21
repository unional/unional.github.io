# future

- Programming paradigm is not about adding restriction
- Tooling and compiler will improve
- Functional Programming immutability is extra restriction to solve the technical limitation
- Functional programming does not consider time and space
  - Transform program to certain abstraction
    - It's good for reusability, but not for writing
      - Unless you are very good at it
      - Will still have the same issue of the hammer problem
      - Not able to transform to the right abstraction has performance cost as compiler cannot optimize
    - require of using different data structure (array, list, vector, etc) is extra burden for optimization
      - Yes and no. We do need to choose the right data structure for the right job
      - but in functional programming it is more opaque than necessary
