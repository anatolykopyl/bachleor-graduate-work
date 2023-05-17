<script setup lang="ts">
import { watch, onMounted } from 'vue'
import * as d3 from 'd3'
import type TSor from 'src/models/sor';
import type TTrace from 'src/models/trace';

const props = defineProps<{
  sor?: TSor;
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

  if (!props.sor?.trace) {
    return
  }

  const x = d3
    .scaleLinear()
    .domain(
      d3.extent(
        props.sor.trace, 
        (d) => d.x
      ) as Iterable<d3.NumberValue>
    )
    .rangeRound([0, width])

  const y = d3
    .scaleLinear()
    .domain(
      d3.extent(
        props.sor.trace, 
        (d) => d.y
      ) as Iterable<d3.NumberValue>
    )
    .rangeRound([height, 0])

  const line = d3.line<TTrace[number]>()
    .x((d) => x(d.x))
    .y((d) => y(d.y))

  g.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))

  g.append("g")
    .call(d3.axisLeft(y))

  g.append("path")
    .datum(props.sor.trace)
    .attr("fill", "none")
    .attr("stroke", "violet")
    .attr("stroke-width", 1)
    .attr("d", line);

  // Draw included in file events
  const includedEvents: { x: number; y: number | null }[] = props.sor.info.KeyEvents.map((e) => ({ x: e.distance, y: null }))
  props.sor.trace.forEach((dp) => {
    includedEvents.forEach((event) => {
      if (event.x >= dp.x) {
        event.y = dp.y
      }
    })
  })

  g.selectAll(".included")
    .data(includedEvents as { x: number; y: number }[])
    .enter()
    .append("circle")
    .attr("class", "included")
    .attr("r", 2)
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))

  const deviantEvents: { x: number; y: number }[] = []
  props.sor.trace.forEach((dp, i) => {
    if (i > 0) return

    const prevPoint = (props.sor as TSor).trace[i-1]
    const avgLoss = 0

    if (Math.abs(dp.y - prevPoint.y) > avgLoss) {
      deviantEvents.push({ x: dp.x, y: dp.y })
    }
  })
  console.log(deviantEvents)

  g.selectAll(".deviant")
    .data(deviantEvents as { x: number; y: number }[])
    .enter()
    .append("circle")
    .attr("class", "deviant")
    .attr("r", 2)
    .attr("fill", "red")
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
}

watch(
  () => props.sor?.trace,
  () => {
    drawChart()
  }
)

onMounted(() => {
  drawChart()
})
</script>

<template>
  <svg id="trace"></svg>
</template>