# Firebase Deployment Guide

## Overview
This guide explains how to properly deploy Firestore security rules and indexes to resolve the "Missing or insufficient permissions" error.

## Problem
The application is encountering `FirebaseError: Missing or insufficient permissions` when trying to:
- Create orders in Firestore
- Read user orders
- Fetch products from Firestore

## Root Causes
1. **Firestore rules not deployed**: The `firestore.rules` file exists locally but hasn't been deployed to Firebase
2. **Missing composite indexes**: Firestore queries require composite indexes that aren't defined
3. **Syntax issues in rules**: The `in` operator syntax used in rules is not compatible with Firestore rules v2

## Solution

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
# or
pnpm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Initialize Firebase in the project (if not already done)
```bash
firebase init
```

Select:
- Firestore: Configure security rules and indexes files
- Use existing project: pemafarm-8ae55
- File for Firestore Rules: firestore.rules
- File for Firestore Indexes: firestore.indexes.json

### Step 4: Deploy Firestore Rules and Indexes
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

Or deploy everything:
```bash
firebase deploy
```

### Step 5: Verify Deployment
Check the Firebase Console:
1. Go to https://console.firebase.google.com
2. Select project: pemafarm-8ae55
3. Navigate to Firestore Database
4. Check Rules tab to verify rules are deployed
5. Check Indexes tab to verify composite indexes are created

## Files Modified

### 1. firestore.rules
**Changes:**
- Fixed `in` operator syntax to use `==` comparisons (Firestore rules v2 compatible)
- Changed `email in [...]` to `email == '...' || email == '...'`
- Changed `data.paymentMethod in [...]` to explicit comparisons
- Changed `data.status in [...]` to explicit comparisons
- Added helper functions: `isValidPaymentMethod()`, `isValidOrderStatus()`

**Key Rules:**
- Products: Readable by all, writable only by admins
- Orders: 
  - Create: Authenticated users can create their own orders
  - Read: Users can read their own orders, admins can read all
  - Update: Users can cancel pending orders, admins can update any
  - Delete: Admins only

### 2. firestore.indexes.json (NEW)
**Composite Indexes Created:**
1. **Orders by userId + createdAt**: For `getUserOrders()` query
   ```
   userId: ASCENDING
   createdAt: DESCENDING
   ```

2. **Orders by paymentReference + userId**: For `getOrderByReference()` query
   ```
   paymentReference: ASCENDING
   userId: ASCENDING
   ```

3. **Orders by createdAt**: For `getAllOrders()` pagination query
   ```
   createdAt: DESCENDING
   ```

4. **Products by createdAt**: For `getDynamicProductsAll()` query
   ```
   createdAt: DESCENDING
   ```

## Testing

### Test Order Creation
1. Login as a user
2. Add items to cart
3. Go to checkout
4. Complete order (cash or online payment)
5. Verify order is created in Firestore

### Test Order Reading
1. After creating an order, go to account page
2. Verify order appears in order history
3. Check Firestore console to verify data

### Test Admin Access
1. Login as admin (mr.onyanchaandrew@gmail.com or pemafreshgroceries@gmail.com)
2. Go to admin page
3. Verify all orders are visible
4. Verify order status can be updated

## Troubleshooting

### Error: "Missing or insufficient permissions"
**Solution:**
1. Verify rules are deployed: `firebase deploy --only firestore:rules`
2. Check rules in Firebase Console
3. Verify user is authenticated (check auth state)
4. Check that `userId` in order matches authenticated user's UID

### Error: "Failed to get documents" or "Index not defined"
**Solution:**
1. Deploy indexes: `firebase deploy --only firestore:indexes`
2. Wait for indexes to build (can take several minutes)
3. Check Indexes tab in Firebase Console

### Error: "Invalid payment method" or "Invalid status"
**Solution:**
1. Verify order data matches validation rules
2. Payment method must be: 'card', 'mobile', or 'cash'
3. Status must be: null, 'pending', or 'confirmed' (for creation)

### Rules Not Deploying
**Solution:**
1. Check Firebase project: `firebase projects:list`
2. Re-login: `firebase login --reauth`
3. Check firebase.json exists and points to correct files

## Firebase Configuration

Ensure `.env` file has correct values:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pemafarm-8ae55.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pemafarm-8ae55
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pemafarm-8ae55.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=918257352850
NEXT_PUBLIC_FIREBASE_APP_ID=1:918257352850:web:...
```

## Security Best Practices

1. **Never expose sensitive data**: Rules prevent users from reading others' orders
2. **Input validation**: Rules validate all incoming data
3. **Anti-pattern detection**: Rules block suspicious content (XSS attempts)
4. **Rate limiting**: Middleware prevents abuse
5. **Admin-only operations**: Product management restricted to admin emails

## Additional Resources

- [Firestore Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Indexes Documentation](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
