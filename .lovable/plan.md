## Add batch sub-tabs to Orders

Yes — `orders.created_at` is on every row, so filtering by booking date is straightforward. No DB changes needed.

### Changes

In `src/pages/Admin.tsx`, inside the existing `orders` `TabsContent`:

1. Add a nested `Tabs` with three triggers:
   - **Workshop 1 (April 26)** — `created_at < 2026-04-16T00:00:00Z`
   - **Workshop 2 (June 26)** — `created_at >= 2026-04-16` and `< 2026-06-30T23:59:59Z`
   - **All**
2. Persist the active sub-tab via the existing `usePersistedTab` helper (key: `admin.ordersBatchTab`, default `workshop2`).
3. Derive `filteredOrders` from `orders` based on the active sub-tab.
4. Recompute the two summary cards (Total Revenue, Total Orders) from `filteredOrders` so they reflect the selected batch.
5. Render the orders table from `filteredOrders`.

No backend/RLS changes. No styling deviations — reuse existing `Tabs`, `Card`, `Table` components.
