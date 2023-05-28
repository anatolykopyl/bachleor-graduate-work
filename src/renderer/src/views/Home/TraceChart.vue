<script setup lang="ts">
import { watch, onMounted, ref } from 'vue'
import * as d3 from 'd3'
import type TSor from 'src/models/sor';
import type TTrace from 'src/models/trace';
import type TCoords from 'src/models/coords';
import type TLineEvent from 'src/models/lineEvent';

const props = defineProps<{
  sor: TSor;
}>();

const foundEvents = ref<TLineEvent[]>([]);

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
    .data(includedEvents as TTrace)
    .enter()
    .append("circle")
    .attr("class", "included")
    .attr("r", 2)
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))

  // Draw naively found events
  g.selectAll(".found")
    .data(foundEvents.value)
    .enter()
    .append("circle")
    .attr("class", "found")
    .attr("fill", (d) => d.type === 'loss' ? "red" : "blue")
    .attr("r", 2)
    .attr("cx", (d) => x(d.start.x))
    .attr("cy", (d) => y(d.start.y))
}

watch(
  () => props.sor.trace,
  () => {
    drawChart()
  }
)

// WTF, computed wasn't reacting to nested changes
watch(
  () => props.sor,
  () => {
    foundEvents.value = ((): TLineEvent[] => {
      const clumps: TLineEvent[] = []
      let currentClump: {
        start: TCoords,
        end?: TCoords,
        type: "reflection" | "loss",
      } | null = null

      props.sor.trace.forEach((dp, i) => {
        if (i === 0) {
          return
        }

        if (!currentClump) {
          if (dp.y - props.sor.trace[i - 1].y > -props.sor.info.FxdParams.reflThr) {
            currentClump = { 
              start: props.sor.trace[i - 1],
              type: "reflection"
            }
          }

          if (dp.y - props.sor.trace[i - 1].y < -props.sor.info.FxdParams.lossThr) {
            currentClump = {
              start: dp,
              type: "loss"
            }
          }
        } else {
          if (dp.y <= currentClump.start.y) {
            currentClump.end = dp
            clumps.push(currentClump as TLineEvent)
            currentClump = null
          }
        }
      })

      return clumps
    })()

    drawChart()
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  drawChart()
})
</script>

<template>
  <svg id="trace"></svg>
</template>

<style scoped>
#trace {
  height: 500px;
}
</style>