import { describe, expect, it } from "vitest";

describe("Admin Setup", () => {
  it("should have admin credentials configured", () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    expect(adminEmail).toBe("wallassouzapereira@gmail.com");
    expect(adminPassword).toBe("02129356");
    expect(adminEmail).toBeDefined();
    expect(adminPassword).toBeDefined();
  });
});
