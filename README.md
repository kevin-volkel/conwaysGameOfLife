#  Conway's Game of Life
## A version of Conway's Game of Life with customizable conditions

### Rules of Conway's Game of Life:
- At every step a living cell will die if the amount of neighbors are:
  -  at or over the upper limit (4 by default)
  -  at or under the under limit (1 by default)
- If those conditions are not met, they survive.
- An empty cell can be given life if it has exactly enough neighbors (3 by default)
