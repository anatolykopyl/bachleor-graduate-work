<script setup lang="ts">
import { watch, onMounted } from 'vue'
import * as d3 from 'd3'
import type Trace from '@renderer/models/trace'

const props = defineProps<{
  trace?: Trace;
}>()

const padding = {
  top: 30,
  bottom: 30,
  left: 30,
  right: 30
}
const width = 900 - padding.left - padding.right
const height = 500 - padding.top - padding.bottom

const drawChart = (): void => {
  const svg = d3.select("#trace")
    .attr("width", width + padding.left + padding.right)
    .attr("height", height + padding.top + padding.bottom)

  svg.selectAll('g').remove()
    
  const g = svg.append("g")
    .attr("transform", `translate(${padding.left}, ${padding.top})`);

  if (props.trace) {
    const x = d3
      .scaleLinear()
      .domain(
        d3.extent(
          props.trace, 
          (d) => d.x
        ) as Iterable<d3.NumberValue>
      )
      .rangeRound([0, width])

    const y = d3
      .scaleLinear()
      .domain(
        d3.extent(
          props.trace, 
          (d) => d.y
        ) as Iterable<d3.NumberValue>
      )
      .rangeRound([height, 0])

    const line = d3.line<Trace[number]>()
      .x((d) => x(d.x))
      .y((d) => y(d.y))

    g.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))

    g.append("g")
      .call(d3.axisLeft(y))

    g.append("path")
      .datum(props.trace)
      .attr("fill", "none")
      .attr("stroke", "violet")
      .attr("stroke-width", 1)
      .attr("d", line); 
  }
}

watch(
  () => props.trace,
  drawChart
)

onMounted(() => {
  drawChart()
})
</script>

<template>
  <svg id="trace"></svg>
</template>