import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { getSession } from '@/lib/core/server';

// Fallback price used when STRIPE_PRICE_ID is not configured.
const DEFAULT_STRIPE_PRICE_ID = 'price_1Ueor7H5geFDItIh8t1UR0HX';

export async function POST(request: Request) {

  const userSession = await getSession()

  // Only authenticated users can start a premium checkout
  if (!userSession) {
    return NextResponse.redirect(
      new URL('/sign-in?callbackURL=%2Fcheckout', request.url),
      303
    )
  }

  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const priceId = process.env.STRIPE_PRICE_ID || DEFAULT_STRIPE_PRICE_ID

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        userId: userSession?.user?.id ?? null,
      },
      customer_email: userSession?.user?.email,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      // Users who cancel the payment return to the payment status page
      cancel_url: `${origin}/payment?status=cancel`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: 'wed_plan_web_001',
    });
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return NextResponse.json(
      { error: error.message },
      { status:  500 }
    )
  }
}
