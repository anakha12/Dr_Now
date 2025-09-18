
export const handleError = (error: unknown, defaultMsg: string): Error => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response === "object" &&
    "data" in (error as any).response &&
    (error as any).response.data?.message
  ) {
    return new Error((error as any).response.data.message);
  }
  return new Error(defaultMsg);
};
