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
    const width = this.svg.width
    const height = this.svg.height
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

      g.transition()
        .duration(600)
        .attr('transform', '')
    }

    const projection = d3.geoMercator()
                        .center([110, 32])
                        .scale(2000)
                        .translate([this.svg.width / 2, this.svg.height / 2])

    const path = d3.geoPath()
                  .projection(projection)

    const svg = d3.select('.home-mapArea')
                  .append('svg')
                  .attr('width', this.svg.width)
                  .attr('height', this.svg.height)

    svg.append('rect')
      .attr('class', 'home-svg-bg')
      .attr('width', this.svg.width)
      .attr('height', this.svg.height)
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
        // .attr("stroke","#000")
        // .attr("stroke-width", 0.5)
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
        .append('path')
        .attr('d', d3.symbol().type(d3.symbolCircle).size(120))
        .attr('fill', '#f00')
        .attr('cursor', 'pointer')
        .attr('transform', (d) => {
          let coor = projection([d.log, d.lat])
          return 'translate(' + coor[0] + ', ' + coor[1] + ')'
        })

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
  }
}
</script>

<style lang="postcss">
.home
  p
    font-size: 24px
    color: #f00
    text-align: center
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
</style>
