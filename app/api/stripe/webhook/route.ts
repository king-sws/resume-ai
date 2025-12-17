/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/stripe/webhook/route.ts
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const plan = session.metadata?.plan as 'PRO' | 'ENTERPRISE'

  if (!userId || !plan) {
    console.error('Missing metadata in checkout session')
    return
  }

  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  // Update user plan
  await prisma.user.update({
    where: { id: userId },
    data: { plan },
  })

  // Update subscription record
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      status: 'active',
    },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      status: 'active',
    },
  })

  // Update usage stats limits
  await prisma.usageStats.upsert({
    where: { userId },
    create: {
      userId,
      resumesCreated: 0,
      resumesLimit: -1, // Unlimited
      aiCreditsUsed: 0,
      aiCreditsLimit: plan === 'PRO' ? 100 : 500,
    },
    update: {
      resumesLimit: -1,
      aiCreditsLimit: plan === 'PRO' ? 100 : 500,
    },
  })

  console.log(`Subscription created for user ${userId}`)
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find user by customer ID
  const userSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  })

  if (!userSubscription) {
    console.error('No subscription found for customer:', customerId)
    return
  }

  // Determine plan from subscription items
  const priceId = subscription.items.data[0]?.price.id
  let plan: 'PRO' | 'ENTERPRISE' = 'PRO'
  
  // Map price IDs to plans (you'll need to set these)
  if (priceId?.includes('enterprise')) {
    plan = 'ENTERPRISE'
  }

  // Update subscription
  await prisma.subscription.update({
    where: { userId: userSubscription.userId },
    data: {
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodStart: (subscription as any).current_period_start
        ? new Date((subscription as any).current_period_start * 1000)
        : null,
      currentPeriodEnd: (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000)
        : null,
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end ?? false,
      canceledAt: (subscription as any).canceled_at
        ? new Date((subscription as any).canceled_at * 1000)
        : null,
    },
  })

  // Update user plan
  await prisma.user.update({
    where: { id: userSubscription.userId },
    data: { plan },
  })

  // Update usage limits
  await prisma.usageStats.update({
    where: { userId: userSubscription.userId },
    data: {
      resumesLimit: -1,
      aiCreditsLimit: plan === 'PRO' ? 100 : 500,
    },
  })

  console.log(`Subscription updated for customer ${customerId}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const userSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  })

  if (!userSubscription) {
    console.error('No subscription found for customer:', customerId)
    return
  }

  // Downgrade to FREE plan
  await prisma.user.update({
    where: { id: userSubscription.userId },
    data: { plan: 'FREE' },
  })

  // Update subscription status
  await prisma.subscription.update({
    where: { userId: userSubscription.userId },
    data: {
      status: 'canceled',
      canceledAt: new Date(),
    },
  })

  // Reset usage limits to FREE tier
  await prisma.usageStats.update({
    where: { userId: userSubscription.userId },
    data: {
      resumesLimit: 1,
      aiCreditsLimit: 10,
    },
  })

  console.log(`Subscription canceled for user ${userSubscription.userId}`)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  const userSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  })

  if (!userSubscription) return

  // Reset AI credits on successful payment (monthly reset)
  await prisma.usageStats.update({
    where: { userId: userSubscription.userId },
    data: {
      aiCreditsUsed: 0,
      lastResetAt: new Date(),
    },
  })

  console.log(`Payment succeeded for user ${userSubscription.userId}`)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  const userSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  })

  if (!userSubscription) return

  // Update subscription status
  await prisma.subscription.update({
    where: { userId: userSubscription.userId },
    data: {
      status: 'past_due',
    },
  })

  console.log(`Payment failed for user ${userSubscription.userId}`)
  
  // TODO: Send email notification to user
}