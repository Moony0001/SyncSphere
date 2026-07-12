import { describe, it, expect } from "vitest";

// The simplest possible test: proves Vitest is wired up and running.
describe("test harness", () => {
  it("does math", () => {
    expect(1 + 1).toBe(2);
  });
});
