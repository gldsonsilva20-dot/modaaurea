import { describe, it, expect, beforeEach } from "vitest";

// Mock cart data structure
interface CartItem {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  size: string;
  slug: string;
}

describe("Cart Operations", () => {
  let cart: CartItem[] = [];

  beforeEach(() => {
    cart = [];
  });

  it("should add item to cart", () => {
    const item: CartItem = {
      productId: 1,
      name: "Blusa Rosa",
      price: "49.90",
      quantity: 2,
      size: "M",
      slug: "blusa-rosa",
    };

    cart.push(item);

    expect(cart).toHaveLength(1);
    expect(cart[0]).toEqual(item);
  });

  it("should update quantity if item already exists", () => {
    const item: CartItem = {
      productId: 1,
      name: "Blusa Rosa",
      price: "49.90",
      quantity: 1,
      size: "M",
      slug: "blusa-rosa",
    };

    cart.push(item);

    // Add same item again
    const existingItem = cart.find(
      (i) => i.productId === item.productId && i.size === item.size
    );
    if (existingItem) {
      existingItem.quantity += 1;
    }

    expect(cart).toHaveLength(1);
    expect(cart[0]?.quantity).toBe(2);
  });

  it("should remove item from cart", () => {
    const item: CartItem = {
      productId: 1,
      name: "Blusa Rosa",
      price: "49.90",
      quantity: 1,
      size: "M",
      slug: "blusa-rosa",
    };

    cart.push(item);
    expect(cart).toHaveLength(1);

    cart = cart.filter((i) => !(i.productId === 1 && i.size === "M"));

    expect(cart).toHaveLength(0);
  });

  it("should calculate total price correctly", () => {
    const items: CartItem[] = [
      {
        productId: 1,
        name: "Blusa Rosa",
        price: "49.90",
        quantity: 2,
        size: "M",
        slug: "blusa-rosa",
      },
      {
        productId: 2,
        name: "Vestido Preto",
        price: "99.90",
        quantity: 1,
        size: "G",
        slug: "vestido-preto",
      },
    ];

    const total = items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

    expect(total).toBe(199.70);
  });

  it("should validate minimum quantity (1 piece)", () => {
    const item: CartItem = {
      productId: 1,
      name: "Blusa Rosa",
      price: "49.90",
      quantity: 1,
      size: "M",
      slug: "blusa-rosa",
    };

    cart.push(item);

    const isValid = cart.every((i) => i.quantity >= 1);
    expect(isValid).toBe(true);
  });

  it("should handle multiple sizes of same product", () => {
    const item1: CartItem = {
      productId: 1,
      name: "Blusa Rosa",
      price: "49.90",
      quantity: 1,
      size: "M",
      slug: "blusa-rosa",
    };

    const item2: CartItem = {
      productId: 1,
      name: "Blusa Rosa",
      price: "49.90",
      quantity: 1,
      size: "G",
      slug: "blusa-rosa",
    };

    cart.push(item1, item2);

    expect(cart).toHaveLength(2);
    expect(cart[0]?.size).toBe("M");
    expect(cart[1]?.size).toBe("G");
  });

  it("should clear cart", () => {
    cart.push({
      productId: 1,
      name: "Blusa Rosa",
      price: "49.90",
      quantity: 1,
      size: "M",
      slug: "blusa-rosa",
    });

    expect(cart).toHaveLength(1);

    cart = [];

    expect(cart).toHaveLength(0);
  });
});
