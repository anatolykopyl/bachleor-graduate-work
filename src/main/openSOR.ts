import SOR from "jsotdr";
import type TTrace from "../models/trace";
import type TSor from "../models/sor";

const datToTrace = (rows: Array<string>): TTrace => {
  return rows.map((row) => {
    const [x, y] = row.split("\t");
    return {
      x: parseFloat(x),
      y: parseFloat(y),
    };
  });
};

// eslint-disable-next-line
const parseInfo = (raw: any) => {
  return {
    filename: raw.filename,
    Cksum: raw.Cksum,
    KeyEvents: Object.keys(raw.KeyEvents)
      .filter((key) => key !== "Summary" && key !== "num events")
      .map((key) => {
        const event = raw.KeyEvents[key];

        return {
          ...event,
          distance: parseFloat(event.distance),
        };
      }),
    FxdParams: {
      BC: parseFloat(raw.FxdParams["BC"]),
      EOTThr: parseFloat(raw.FxdParams["EOT thr"]),
      date: new Date(raw.FxdParams["date/time"]),
      lossThr: parseFloat(raw.FxdParams["loss thr"]),
      reflThr: parseFloat(raw.FxdParams["refl thr"]),
      pulseWidth: parseFloat(raw.FxdParams["pulse width"]),
      wavelength: raw.FxdParams["wavelength"],
      resolution: raw.FxdParams["resolution"],
    },
    GenParams: {
      cableId: raw.GenParams["cable ID"],
      fiberId: raw.GenParams["fiber ID"],
    },
    Summary: raw.KeyEvents.Summary,
    DataPts: raw.DataPts,
  };
};

export default async (filepath: string): Promise<TSor> => {
  const sor = new SOR();
  const results = await sor.reader(filepath);

  return {
    status: results[0],
    info: parseInfo(results[1]),
    infoRaw: results[1],
    trace: datToTrace(results[2]),
  };
};
