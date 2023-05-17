import type TTrace from "./trace"

type TEvent = {
  type: string;
  distance: number;
}

type TSor = {
  status: string;
  infoRaw: object;
  info: {
    Cksum: {
      checksum: number,
      checksum_ours: number,
      match: boolean
    },
    DataPts: object,
    KeyEvents: TEvent[],
    Summary: object,
  };
  trace: TTrace;
}

export default TSor