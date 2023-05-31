<script setup lang="ts">
import { watch, onMounted, ref } from "vue";
import * as d3 from "d3";
import type TSor from "src/models/sor";
import type TTrace from "src/models/trace";
import type TCoords from "src/models/coords";
import type TLineEvent from "src/models/lineEvent";

const props = defineProps<{
  sor: TSor;
  teoThr: number;
  showBuiltin: boolean;
  showNaive: boolean;
  showTeo: boolean;
  showTeoVal: boolean;
  sorEdited: boolean;
}>();

const emit = defineEmits<{
(event: "clickTrace", value: number): void;
}>();

const foundEvents = ref<TLineEvent[]>([]);
const teoValues = ref<(TCoords & { tX: number, tY: number })[]>([]);
const teoEvents = ref<TLineEvent[]>([]);

const padding = {
  top: 30,
  bottom: 30,
  left: 30,
  right: 30,
};
const width = 900 - padding.left - padding.right;
const height = 500 - padding.top - padding.bottom;

const x = d3
  .scaleLinear()
  .domain(
    d3.extent(
      props.sor.trace,
      (d) => d.x,
    ) as Iterable<d3.NumberValue>,
  )
  .rangeRound([0, width]);

const y = d3
  .scaleLinear()
  .domain(
    d3.extent(
      props.sor.trace,
      (d) => d.y,
    ) as Iterable<d3.NumberValue>,
  )
  .rangeRound([height, 0]);

const drawChart = (): void => {
  const svg = d3.select("#trace")
    .attr("width", width + padding.left + padding.right)
    .attr("height", height + padding.top + padding.bottom);

  svg.selectAll("g").remove();

  const g = svg.append("g")
    .attr("transform", `translate(${padding.left}, ${padding.top})`);

  const line = d3.line<TTrace[number]>()
    .x((d) => x(d.x))
    .y((d) => y(d.y));

  g.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  g.append("g")
    .call(d3.axisLeft(y));

  g.append("path")
    .datum(props.sor.trace)
    .attr("fill", "none")
    .attr("stroke", "violet")
    .attr("stroke-width", 1)
    .attr("d", line);

  // Draw included in file events
  if (props.showBuiltin && !props.sorEdited) {
    const includedEvents: { x: number; y: number | null }[] = props.sor.info.KeyEvents.map((e) => ({ x: e.distance, y: null }));
    props.sor.trace.forEach((dp) => {
      includedEvents.forEach((event) => {
        if (event.x >= dp.x) {
          event.y = dp.y;
        }
      });
    });

    g.selectAll(".included")
      .data(includedEvents as TTrace)
      .enter()
      .append("circle")
      .attr("class", "included")
      .attr("r", 2)
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y));
  }

  // Draw naively found events
  if (props.showNaive) {
    g.selectAll(".found")
      .data(foundEvents.value)
      .enter()
      .append("circle")
      .attr("class", "found")
      .attr("fill", (d) => d.type === "loss" ? "red" : "blue")
      .attr("r", 2)
      .attr("cx", (d) => x(d.start.x))
      .attr("cy", (d) => y(d.start.y));
  }

  // Draw teo found events
  if (props.showTeo) {
    g.selectAll(".teo")
      .data(teoEvents.value)
      .enter()
      .append("circle")
      .attr("class", "teo")
      .attr("fill", "green")
      .attr("r", 2)
      .attr("cx", (d) => x(d.start.x))
      .attr("cy", (d) => y(d.start.y));
  }

  if (props.showTeoVal) {
    const teoLine = d3.line<TCoords & { tX: number, tY: number }>()
      .x((d) => x(d.tX))
      .y((d) => y(d.tY));

    g.append("path")
      .datum(teoValues.value)
      .attr("fill", "none")
      .attr("stroke", "pink")
      .attr("stroke-width", 1)
      .attr("d", teoLine);
  }
};

watch(
  props,
  () => {
    drawChart();
  },
  { deep: true },
);

// WTF, computed wasn't reacting to nested changes
watch(
  () => props,
  () => {
    foundEvents.value = ((): TLineEvent[] => {
      const clumps: TLineEvent[] = [];
      let currentClump: {
        start: TCoords,
        end?: TCoords,
        type: "reflection" | "loss",
      } | null = null;

      props.sor.trace.forEach((dp, i) => {
        if (i === 0) {
          return;
        }

        if (!currentClump) {
          if (dp.y - props.sor.trace[i - 1].y > -props.sor.info.FxdParams.reflThr) {
            currentClump = {
              start: props.sor.trace[i - 1],
              type: "reflection",
            };
          }

          if (dp.y - props.sor.trace[i - 1].y < -props.sor.info.FxdParams.lossThr) {
            currentClump = {
              start: dp,
              type: "loss",
            };
          }
        } else {
          if (dp.y <= currentClump.start.y) {
            currentClump.end = dp;
            clumps.push(currentClump as TLineEvent);
            currentClump = null;
          }
        }
      });

      return clumps;
    })();

    teoValues.value = ((): (TCoords & { tX: number, tY: number })[] => {
      const teo: (TCoords & { tX: number, tY: number })[] = [];
      props.sor.trace.forEach((dp, i) => {
        if (i === 0 || i === props.sor.trace.length - 1) {
          return;
        }

        const prev = props.sor.trace[i - 1];
        const next = props.sor.trace[i + 1];

        teo.push({
          tX: dp.x,
          tY: dp.y * dp.y - (prev.y * next.y),
          x: dp.x,
          y: dp.y,
        });
      });

      return teo;
    })();

    teoEvents.value = ((): TLineEvent[] => {
      const result: TLineEvent[] = [];
      teoValues.value.forEach((dp) => {
        if (dp.tY >= props.teoThr) {
          result.push({
            start: dp,
            end: dp,
            type: "loss",
          });
        }
      });

      return result;
    })();

    drawChart();
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  drawChart();
});

function clickTrace(event: MouseEvent): void {
  const clickX = x.invert(event.clientX - padding.left);
  emit("clickTrace", clickX);
}
</script>

<template>
  <svg
    id="trace"
    @click="clickTrace"
  ></svg>
</template>

<style scoped>
#trace {
  height: 500px;
}
</style>
