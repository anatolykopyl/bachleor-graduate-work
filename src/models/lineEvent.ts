import TCoords from "./coords";

type TLineEvent = {
  start: TCoords,
  end: TCoords,
  type: "reflection" | "loss",
};

export default TLineEvent;
