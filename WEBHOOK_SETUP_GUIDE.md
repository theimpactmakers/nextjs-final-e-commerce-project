# 🎯 Stripe Webhook Setup Guide

## ✅ Phase 1 Complete - Code Ready!

We've created:
1. ✅ Webhook endpoint at `/api/webhooks/stripe/route.ts`
2. ✅ Updated checkout to set `payment_status: "pending"`
3. ✅ Added placeholder for `STRIPE_WEBHOOK_SECRET` in `.env.local`

---

## 📋 Phase 2: Get Webhook Secret from Stripe Dashboard

### **Option A: Using Stripe CLI (Recommended for Local Testing)**

This is the easiest way to test webhooks locally.

#### 1. Install Stripe CLI

**macOS (Homebrew):**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

**Windows:**
Download from: https://github.com/stripe/stripe-cli/releases

#### 2. Login to Stripe CLI
```bash
stripe login
```
- This will open your browser
- Confirm the pairing code
- You're logged in!

#### 3. Start Webhook Forwarding
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**You'll see output like:**
```
> Ready! Your webhook signing secret is whsec_1234567890abcdefghijklmnopqrstuvwxyz (^C to quit)
```

#### 4. Copy the Secret
- Copy the `whsec_...` secret from the terminal
- Open `.env.local`
- Replace `STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here`
- With your actual secret: `STRIPE_WEBHOOK_SECRET=whsec_1234567890...`

#### 5. Restart Your Dev Server
```bash
# Stop your current server (Ctrl+C)
npm run dev
```

**Keep the Stripe CLI running in a separate terminal!**

---

### **Option B: Using Stripe Dashboard (For Production)**

Use this when you deploy to Vercel.

#### 1. Go to Stripe Dashboard
- Navigate to: https://dashboard.stripe.com/test/webhooks
- Click **"Add endpoint"**

#### 2. Configure Endpoint
- **Endpoint URL:** `http://localhost:3000/api/webhooks/stripe` (for testing)
  - Or: `https://yourdomain.vercel.app/api/webhooks/stripe` (for production)
- **Description:** "Order payment confirmations"
- **Events to send:**
  - ✅ `payment_intent.succeeded`
  - ✅ `payment_intent.payment_failed`
  - ✅ `payment_intent.processing` (optional)

#### 3. Copy Signing Secret
- After creating the endpoint, you'll see **"Signing secret"**
- Click **"Reveal"** 
- Copy the secret (starts with `whsec_`)
- Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`

#### 4. Restart Your Dev Server
```bash
npm run dev
```

---

## 🧪 Phase 3: Testing Your Webhook

### **Test 1: Trigger Test Event (Stripe CLI)**

In a new terminal (while your dev server and `stripe listen` are running):

```bash
stripe trigger payment_intent.succeeded
```

**Expected result:**
- Your terminal running `stripe listen` shows the webhook was sent
- Your dev server console shows: 
  ```
  🔔 Webhook received
  ✅ Webhook signature verified
  📧 Event type: payment_intent.succeeded
  💰 Payment succeeded: pi_xxxxx
  ```

### **Test 2: Real Payment Flow**

1. Go to your checkout page: `http://localhost:3000/checkout`
2. Add items to cart
3. Fill in delivery/payment info
4. Use test card: **4242 4242 4242 4242**
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
5. Complete payment

**Check your console logs:**
- Checkout page: "Payment successful"
- Webhook endpoint: "🔔 Webhook received" → "✅ Order updated to paid"

**Check your database:**
```sql
SELECT order_number, payment_status, payment_transaction_id 
FROM orders 
ORDER BY created_at DESC 
LIMIT 1;
```
Should show: `payment_status: "paid"`

---

## 🔍 Troubleshooting

### "No signature found"
- Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Check that `STRIPE_WEBHOOK_SECRET` is set in `.env.local`
- Restart your dev server after adding the secret

### "Webhook signature verification failed"
- You're using the wrong webhook secret
- Make sure the secret in `.env.local` matches the one from Stripe CLI or Dashboard
- Restart dev server after changing `.env.local`

### "Order not found for payment intent"
- The order was created AFTER the webhook was sent
- This is normal in testing - make a new test purchase
- In production, webhooks are reliable and sent after payment confirmation

### Webhook not being called
- Check Stripe CLI is forwarding: Look for "Ready!" message
- Check your dev server is running on port 3000
- Try triggering manually: `stripe trigger payment_intent.succeeded`

---

## 🚀 Production Deployment (Vercel)

When you deploy to Vercel:

### 1. Add Environment Variable
- Go to: Vercel → Your Project → Settings → Environment Variables
- Add: `STRIPE_WEBHOOK_SECRET` with your production webhook secret

### 2. Create Production Webhook in Stripe
- Dashboard → Webhooks → Add endpoint
- URL: `https://yourdomain.vercel.app/api/webhooks/stripe`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copy the NEW signing secret (different from test mode!)
- Update Vercel environment variable

### 3. Test in Production
- Make a test payment on your live site
- Check Stripe Dashboard → Webhooks → Your endpoint → "Recent events"
- Should show successful webhook deliveries

---

## 📊 What Happens Now?

### **Old Flow (Without Webhooks):**
```
User pays → We mark as "paid" immediately → Hope nothing goes wrong
```

### **New Flow (With Webhooks):**
```
User pays → We mark as "pending" → Stripe confirms → Webhook updates to "paid"
```

### **Benefits:**
✅ **Reliable:** Even if user closes browser, we get webhook
✅ **Secure:** Stripe signature verification prevents fake payments
✅ **Accurate:** Payment status reflects actual Stripe payment state
✅ **Resilient:** Stripe retries failed webhooks automatically

---

## 🎉 Next Steps

After webhooks are working:

1. **Email Notifications:** Send confirmation email when webhook updates order
2. **Error Handling:** Handle edge cases (duplicate webhooks, etc.)
3. **Admin Dashboard:** View webhook logs and payment statuses
4. **Inventory Management:** Reduce stock when payment confirmed via webhook

---

## 🆘 Need Help?

- Stripe Webhook Docs: https://stripe.com/docs/webhooks
- Stripe CLI Docs: https://stripe.com/docs/stripe-cli
- Test Card Numbers: https://stripe.com/docs/testing

**Ready to test? Start with Option A (Stripe CLI) - it's the easiest!**
