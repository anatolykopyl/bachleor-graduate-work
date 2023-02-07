import type Trace from "@renderer/models/trace"

export default (rows: Array<string>): Trace => {
  return rows.map((row) => {
    const [x, y] = row.split('\t')
    return {
      x: parseFloat(x), 
      y: parseFloat(y)
    }
  })
}