import { describe, it, expect } from "vitest";
import { ENV } from "./_core/env";

describe("Otimize Pay Integration", () => {
  it("should have secret key configured", () => {
    expect(ENV.otimizePaySecretKey).toBeDefined();
    expect(ENV.otimizePaySecretKey.length).toBeGreaterThan(0);
    expect(ENV.otimizePaySecretKey).toMatch(/^sk_live_/);
  });

  it("should have public key configured", () => {
    expect(ENV.otimizePayPublicKey).toBeDefined();
    expect(ENV.otimizePayPublicKey.length).toBeGreaterThan(0);
    expect(ENV.otimizePayPublicKey).toMatch(/^pk_live_/);
  });

  it("should create valid Basic Auth header", () => {
    const credentials = `${ENV.otimizePaySecretKey}:x`;
    const encoded = Buffer.from(credentials).toString("base64");
    const authHeader = `Basic ${encoded}`;

    expect(authHeader).toBeDefined();
    expect(authHeader).toMatch(/^Basic /);
    expect(encoded.length).toBeGreaterThan(0);
  });
});
