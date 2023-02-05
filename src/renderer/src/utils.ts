import type Trace from "@renderer/models/trace"

export const datToTrace = (rawDat: string): Trace => {
  const rows = rawDat.split('\n')
  return rows.map((row) => {
    const [x, y] = row.split('\t')
    return {
      x: parseFloat(x), 
      y: parseFloat(y)
    }
  })
}