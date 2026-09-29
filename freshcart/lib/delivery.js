// Delivery settings shared by the browser and the server.
export const DELIVERY_FEE = 4.99;
export const FREE_DELIVERY_OVER = 50;

export function deliveryFor(subtotal) {
  return subtotal === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
}

// Next few delivery slots, starting tomorrow.
export function getDeliverySlots(days = 3) {
  const windows = ["9:00–11:00", "12:00–14:00", "17:00–19:00"];
  const slots = [];
  const now = new Date();
  for (let d = 1; d <= days; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    const label = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    for (const w of windows) slots.push(`${label}, ${w}`);
  }
  return slots;
}
