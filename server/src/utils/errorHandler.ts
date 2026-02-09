import { Response } from "express";
import { HttpStatus } from "./HttpStatus"; 

export function handleControllerError(
  res: Response,
  err: unknown,
  defaultStatus: number = HttpStatus.INTERNAL_SERVER_ERROR
): void {
  if (err instanceof Error) {
    res.status(defaultStatus).json({ message: err.message });
  } else if (typeof err === "string") {
    res.status(defaultStatus).json({ message: err });
  } else {
    res.status(defaultStatus).json({ message: "An unexpected error occurred" });
  }
}
