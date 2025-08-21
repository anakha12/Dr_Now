export interface IToggleBlockDoctor {
  execute(doctorId: string, action: "block" | "unblock"): Promise<void>;
}
