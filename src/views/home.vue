<template lang="pug">
.home
  p {{test}}
  .home-mapArea
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'home',
  data() {
    return {
      test: 'China Map',
      svg: {
        width: 1200,
        height: 700
      },
      towns: [{
        name: '张家界',
        log: 110.482177,
        lat: 29.072427
      }, {
        name: '无锡太悦',
        log: 120.088211,
        lat: 31.397539
      }, {
        name: '安顺大西桥',
        log: 106.140989,
        lat: 26.341933
      }, {
        name: '无锡人鱼小镇',
        log: 120.290943,
        lat: 31.534371
      }, {
        name: '遂昌电商小镇',
        log: 119.282615,
        lat: 28.598506
      }, {
        name: '江苏启东中加小镇',
        log: 121.66179,
        lat: 31.799282
      }, {
        name: '杭州金诚之星',
        log: 120.154318,
        lat: 30.312263
      }, {
        name: '湖州文商综合体',
        log: 120.192175,
        lat: 30.863008
      }]
    }
  },
  mounted() {
    const topojson = require('topojson')
    const width = document.documentElement.clientWidth
    const height = document.documentElement.clientHeight

    let active = d3.select(null)
    function clicked(d) {
      if (active.node() === this) return reset()
      active.classed('active', false)
      active = d3.select(this).classed('active', true)
      console.log(d)

      const bounds = path.bounds(d)
      console.log('bounds', bounds)
      // const dx = bounds[1][0] - bounds[0][0]
      // const dy = bounds[1][1] - bounds[0][1]
      const x = (bounds[0][0] + bounds[1][0]) / 2
      const y = (bounds[0][1] + bounds[1][1]) / 2
      const scale = 1.5
      const translate = [width / 2 - scale * x, height / 2 - scale * y]

      g.transition()
        .duration(600)
        .attr('transform', 'translate(' + translate + ')scale(' + scale + ')')
    }

    function reset() {
      active.classed('active', false)
      active = d3.select(null)

      d3.select('.home-tree')
        .remove()

      g.transition()
        .duration(600)
        .attr('transform', '')
    }

    const projection = d3.geoMercator()
                        .center([110, 32])
                        .scale(2000)
                        .translate([width / 2, height / 2])

    const path = d3.geoPath()
                  .projection(projection)

    const svg = d3.select('.home-mapArea')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height)

    svg.append('rect')
      .attr('class', 'home-svg-bg')
      .attr('width', width)
      .attr('height', height)
      .on('click', reset)

    const g = svg.append('g')

    d3.json('/api/chinaData', (error, root) => {
      if (error) {
        return console.error(error)
      }

      const pale = d3.rgb(126, 192, 238)
      const dark = d3.rgb(30, 72, 195)

      const color = d3.interpolate(pale, dark)

      const linear = d3.scaleLinear()
                      .domain([0, 33])
                      .range([0, 1])

      g.selectAll('path')
        .data(topojson.feature(root.data, root.data.objects.china).features)
        .enter()
        .append('path')
        .attr('class', 'home-province-path')
        .attr('d', path)
        // .attr('stroke', '#000')
        // .attr('stroke-width', 0.5)
        .attr('fill', function(d, i) {
          return color(linear(i))
        })
        .on('click', clicked)

      // 张家界：110.482177,29.072427
      // 无锡太悦：120.088211,31.397539
      // 安顺大西桥：106.140989,26.341933
      // 无锡人鱼小镇：120.290943,31.534371
      // 遂昌电商小镇：119.282615,28.598506
      // 江苏启东中加小镇：121.66179,31.799282
      // 杭州金诚之星：120.154318,30.312263
      // 湖州文商综合体：120.192175,30.863008

      g.selectAll('.location')
        .data(this.towns)
        .enter()
        .append('g')
        .attr('class', 'location')
        .append('circle')
        .attr('r', 5)
        // .append('path')
        // .attr('d', d3.symbol().type(d3.symbolCircle).size(120))
        .attr('fill', '#f00')
        .attr('cursor', 'pointer')
        // .attr('transform', (d) => {
        //   let coor = projection([d.log, d.lat])
        //   return 'translate(' + coor[0] + ', ' + coor[1] + ')'
        // })
        .attr('cx', (d) => {
          let tempLoca = projection([this.towns[6].log, this.towns[6].lat])
          return tempLoca[0]
        })
        .attr('cy', (d) => {
          let tempLoca = projection([this.towns[6].log, this.towns[6].lat])
          return tempLoca[1]
        })

      g.selectAll('.location')
        .select('circle')
        .append('animate')
        .attr('attributeName', 'r')
        .attr('attributeType', 'XML')
        .attr('values', '5;8;5')
        .attr('dur', '4s')
        .attr('repeatCount', 'indefinite')

      // const tempLoca = projection([this.towns[6].log, this.towns[6].lat])

      g.selectAll('.location')
        .select('circle')
        .append('animateTransform')
        .attr('attributeName', 'transform')
        .attr('attributeType', 'XML')
        .attr('type', 'translate')
        .attr('dur', '3s')
        .attr('to', (d) => {
          let coor = projection([d.log, d.lat])
          let tempLoca = projection([this.towns[6].log, this.towns[6].lat])
          return (coor[0] - tempLoca[0]) + ',' + (coor[1] - tempLoca[1])
        })
        .attr('repeatCount', 'indefinite')

      const townPoint = svg.selectAll('.location')
                          .select('path')

      townPoint.on('mouseover', function() {
        d3.select(this)
          .attr('fill', '#ff0')
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('fill', '#f00')
      })
    })

    // function drawTree() {
    //   // Tree configuration
    //   let branches = []
    //   const seed = { i: 0, x: 420, y: 600, a: 0, l: 130, d: 0 } // a = angle, l = length, d = depth
    //   const da = 0.5 // Angle delta
    //   const dl = 0.8 // Length delta (factor)
    //   const ar = 0.7 // Randomness
    //   const maxDepth = 8

    //   // Tree creation functions
    //   function branch(b) {
    //     const end = endPt(b)
    //     let daR
    //     let newB

    //     branches.push(b)

    //     if (b.d === maxDepth) return

    //     // Left branch
    //     daR = ar * Math.random() - ar * 0.5
    //     newB = {
    //       i: branches.length,
    //       x: end.x,
    //       y: end.y,
    //       a: b.a - da + daR,
    //       l: b.l * dl,
    //       d: b.d + 1,
    //       parent: b.i
    //     }
    //     branch(newB)

    //     // Right branch
    //     daR = ar * Math.random() - ar * 0.5
    //     newB = {
    //       i: branches.length,
    //       x: end.x,
    //       y: end.y,
    //       a: b.a + da + daR,
    //       l: b.l * dl,
    //       d: b.d + 1,
    //       parent: b.i
    //     }
    //     branch(newB)
    //   }

    //   function regenerate(initialise) {
    //     branches = []
    //     branch(seed)
    //     initialise ? create() : update()
    //   }

    //   function endPt(b) {
    //     // Return endpoint of branch
    //     const x = b.x + b.l * Math.sin(b.a)
    //     const y = b.y - b.l * Math.cos(b.a)
    //     return {x: x, y: y}
    //   }

    //   // D3 functions
    //   function x1(d) { return d.x }
    //   function y1(d) { return d.y }
    //   function x2(d) { return endPt(d).x }
    //   function y2(d) { return endPt(d).y }
    //   function highlightParents(d) {
    //     const colour = d3.event.type === 'mouseover' ? 'green' : '#2ad813'
    //     const depth = d.d
    //     for (let i = 0; i <= depth; i++) {
    //       d3.select('#id-' + parseInt(d.i)).style('stroke', colour)
    //       d = branches[d.parent]
    //     }
    //   }

    //   function create() {
    //     d3.select('svg')
    //       .append('rect')
    //       .attr('class', 'home-tree-rect')
    //       .attr('width', width)
    //       .attr('height', height)
    //       .on('click', () => {
    //         d3.select('.home-tree')
    //           .remove()
    //         d3.select('.home-tree-rect')
    //           .remove()
    //       })

    //     d3.select('svg')
    //       .append('g')
    //       .attr('class', 'home-tree')
    //       .selectAll('line')
    //       .data(branches)
    //       .enter()
    //       .append('line')
    //       .attr('x1', x1)
    //       .attr('y1', y1)
    //       .attr('x2', x2)
    //       .attr('y2', y2)
    //       .style('stroke-width', function(d) { return parseInt(maxDepth + 1 - d.d) + 'px' })
    //       .attr('id', function(d) { return 'id-' + d.i })
    //       .on('mouseover', highlightParents)
    //       .on('mouseout', highlightParents)
    //   }

    //   function update() {
    //     d3.select('svg')
    //       .selectAll('line')
    //       .data(branches)
    //       .transition()
    //       .attr('x1', x1)
    //       .attr('y1', y1)
    //       .attr('x2', x2)
    //       .attr('y2', y2)
    //   }

    //   d3.selectAll('.regenerate')
    //     .on('click', regenerate)

    //   regenerate(true)
    // }
  }
}
</script>

<style lang="postcss">
.home
  // line
  //   stroke: #2ad813
  p
    font-size: 24px
    color: #f00
    text-align: center
  svg
    display: block
    margin: 0 auto
  &-mapArea
    height: 700px
  &-svg-bg
    fill: none
    pointer-events: all
  &-province-path
    stroke: #fff
    cursor: pointer
    &.active
      fill: orange
  &-tree-rect
    fill: rgba(235, 235, 235, 0.8)
    pointer-events: all
</style>
