import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    })
  : null;

export const getStripePublishableKey = () => process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
