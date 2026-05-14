# Al-Qurain Store Security Specification

## 1. Data Invariants
- A `Product` must have a name, price, and category.
- An `Order` must be linked to a valid `userId`.
- A `Booking` must have a `userId`, `serviceId`, and a future `date`.
- `UserProfile` info is private and only accessible by the owner.
- `isAdmin` field in `UserProfile` cannot be set by the user.

## 2. The Dirty Dozen (Attack Payloads)
1.  **Identity Spoofing**: User A tries to create an order as User B.
2.  **Price Manipulation**: User tries to create a product with a negative price (if they had write access).
3.  **Shadow Field Injection**: User tries to add `isVerified: true` to their user profile.
4.  **PII Leak**: Authenticated User A tries to read User B's private info.
5.  **Orphaned Booking**: User tries to book a service that doesn't exist in the `services` collection.
6.  **State Shortcut**: User tries to update an order status from `pending` directly to `delivered`.
7.  **Resource Poisoning**: User tries to inject a 1MB string into the `address` field of a booking.
8.  **Unauthorized List**: User tries to list all `orders` without specifying their `userId`.
9.  **Immutable Field Break**: User tries to change their `email` or `originalOrderId` after creation.
10. **Temporal Fraud**: User tries to set a `createdAt` timestamp from the client instead of `request.time`.
11. **Admin Escalation**: User tries to create a document in the `admins` collection.
12. **Bulk Delete**: User tries to delete multiple orders they don't own.

## 3. Test Runner (Draft)
- `test('guest cannot read profiles', ...)`
- `test('user cannot read others private info', ...)`
- `test('user can only see their own orders', ...)`
- `test('cannot create order with negative price', ...)`
- `test('cannot update terminal status', ...)`
