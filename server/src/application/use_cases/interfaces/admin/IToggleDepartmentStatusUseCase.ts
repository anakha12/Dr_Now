export interface IToggleDepartmentStatusUseCase {
  execute(id: string, status: "Listed" | "Unlisted"): Promise<void>;
}
