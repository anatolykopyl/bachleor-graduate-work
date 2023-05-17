import SOR from 'jsotdr'
import type TTrace from "../models/trace";
import type TSor from "../models/sor";


const datToTrace = (rows: Array<string>): TTrace => {
  return rows.map((row) => {
    const [x, y] = row.split('\t')
    return {
      x: parseFloat(x), 
      y: parseFloat(y)
    }
  })
}

export default async (filepath: string): Promise<TSor> => {
  const sor = new SOR()
  const results = await sor.reader(filepath)

  return {
    status: results[0],
    info: {
      Cksum: results[1].Cksum,
      KeyEvents: Object.keys(results[1].KeyEvents)
        .filter((key) => key !== 'Summary' && key !== 'num events')
        .map((key) => {
          const event = results[1].KeyEvents[key]

          return {
            ...event,
            distance: parseFloat(event.distance)
          }
        }),
      Summary: results[1].KeyEvents.Summary,
      DataPts: results[1].DataPts
    },
    infoRaw: results[1],
    trace: datToTrace(results[2]),
  }
}