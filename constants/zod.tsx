import * as z from "zod";

export const zodNumber = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.coerce.number(),
);
