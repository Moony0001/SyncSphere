import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Backend code is Node (no DOM). Frontend tests, if added later, would use
    // a different config or the `environmentMatchGlobs` option.
    environment: "node",

    // Expose describe/it/expect/etc. as globals (we still import them in the
    // test files for clarity — both styles work).
    globals: true,

    // Runs once before the test files: boots the in-memory MongoDB and sets
    // the env vars the app expects.
    setupFiles: ["./backend/tests/setup.js"],

    // The FIRST run downloads a small MongoDB binary, which can take a while,
    // so give the setup hook a generous timeout.
    hookTimeout: 60000,

    // Only pick up backend tests for now.
    include: ["backend/tests/**/*.test.js"],
  },
});
