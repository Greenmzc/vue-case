<template lang="pug">
.tree tree
  svg
  button.regenerate regenerate
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'tree',
  data () {
    return {
    }
  },

  mounted() {
    // Tree configuration
    let branches = []
    const seed = { i: 0, x: 420, y: 600, a: 0, l: 130, d: 0 } // a = angle, l = length, d = depth
    const da = 0.5 // Angle delta
    const dl = 0.8 // Length delta (factor)
    const ar = 0.7 // Randomness
    const maxDepth = 8

    // Tree creation functions
    function branch(b) {
      const end = endPt(b)
      let daR
      let newB

      branches.push(b)

      if (b.d === maxDepth) return

      // Left branch
      daR = ar * Math.random() - ar * 0.5
      newB = {
        i: branches.length,
        x: end.x,
        y: end.y,
        a: b.a - da + daR,
        l: b.l * dl,
        d: b.d + 1,
        parent: b.i
      }
      branch(newB)

      // Right branch
      daR = ar * Math.random() - ar * 0.5
      newB = {
        i: branches.length,
        x: end.x,
        y: end.y,
        a: b.a + da + daR,
        l: b.l * dl,
        d: b.d + 1,
        parent: b.i
      }
      branch(newB)
    }

    function regenerate(initialise) {
      branches = []
      branch(seed)
      initialise ? create() : update()
    }

    function endPt(b) {
      // Return endpoint of branch
      const x = b.x + b.l * Math.sin(b.a)
      const y = b.y - b.l * Math.cos(b.a)
      return {x: x, y: y}
    }

    // D3 functions
    function x1(d) { return d.x }
    function y1(d) { return d.y }
    function x2(d) { return endPt(d).x }
    function y2(d) { return endPt(d).y }
    function highlightParents(d) {
      const colour = d3.event.type === 'mouseover' ? 'green' : '#2ad813'
      const depth = d.d
      for (let i = 0; i <= depth; i++) {
        d3.select('#id-' + parseInt(d.i)).style('stroke', colour)
        d = branches[d.parent]
      }
    }

    function create() {
      d3.select('svg')
        .selectAll('line')
        .data(branches)
        .enter()
        .append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .style('stroke-width', function(d) { return parseInt(maxDepth + 1 - d.d) + 'px' })
        .attr('id', function(d) { return 'id-' + d.i })
        .on('mouseover', highlightParents)
        .on('mouseout', highlightParents)
    }

    function update() {
      d3.select('svg')
        .selectAll('line')
        .data(branches)
        .transition()
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
    }

    d3.selectAll('.regenerate')
      .on('click', regenerate)

    regenerate(true)
  }
}
</script>

<style lang="postcss">
.tree
  svg
    width: 840px
    height: 600px
  path, line
    stroke: #2ad813
</style>
