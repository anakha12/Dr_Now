// utils/errorHandler.ts
export const handleError = (error: unknown, defaultMsg: string): Error => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim() !== "") {
      return new Error(message);
    }
  }
  return new Error(defaultMsg);
};

function isAxiosError(error: unknown): error is {
  response?: { data?: { message?: string } };
} {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: { data?: unknown } }).response !== null &&
    "data" in (error as { response: { data?: unknown } }).response!
  );
}
