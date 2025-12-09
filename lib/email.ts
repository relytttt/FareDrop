import { Resend } from 'resend';
import { Deal, Subscriber } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder-key');

export interface SendDealAlertParams {
  subscriber: Subscriber;
  deal: Deal;
}

export interface SendWelcomeEmailParams {
  email: string;
  verificationToken?: string;
}

/**
 * Sends a deal alert email to a subscriber
 */
export async function sendDealAlert({ subscriber, deal }: SendDealAlertParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set. Skipping email send.');
    return { success: false, message: 'Email API not configured' };
  }

  const discountPercent = deal.original_price
    ? Math.round(((deal.original_price - deal.price) / deal.original_price) * 100)
    : 0;

  // Build upsell URLs with proper encoding
  const hotelsUrl = `https://search.hotellook.com/?marker=689762&destination=${encodeURIComponent(deal.destination)}${deal.departure_date ? `&checkIn=${encodeURIComponent(deal.departure_date)}` : ''}${deal.return_date ? `&checkOut=${encodeURIComponent(deal.return_date)}` : ''}`;
  const carsUrl = `https://tp.media/r?marker=689762&trs=267029&p=7658&u=https%3A%2F%2Fwww.rentalcars.com%2FSearchResults.do%3FpickupLocation%3D${encodeURIComponent(deal.destination)}`;
  const insuranceUrl = 'https://safetywing.com/nomad-insurance?referenceID=faredrop';

  try {
    const data = await resend.emails.send({
      from: 'FareDrop <alerts@faredrop.com>',
      to: [subscriber.email],
      subject: `🔥 ${discountPercent}% Off: ${deal.origin_city} → ${deal.destination_city} for $${deal.price}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Flight Deal Alert</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #00a0a0 0%, #0077e6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">✈️ Amazing Flight Deal!</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
              <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #00a0a0; margin-top: 0;">${deal.origin_city} → ${deal.destination_city}</h2>
                
                <div style="display: flex; align-items: baseline; margin: 20px 0;">
                  <span style="font-size: 36px; font-weight: bold; color: #0077e6;">$${deal.price}</span>
                  ${deal.original_price ? `<span style="font-size: 18px; color: #999; text-decoration: line-through; margin-left: 10px;">$${deal.original_price}</span>` : ''}
                  ${discountPercent > 0 ? `<span style="background: #ff6b6b; color: white; padding: 5px 10px; border-radius: 4px; margin-left: 10px; font-weight: bold;">${discountPercent}% OFF</span>` : ''}
                </div>
                
                <div style="margin: 20px 0; padding: 15px; background: #f0f8ff; border-left: 4px solid #0077e6; border-radius: 4px;">
                  <p style="margin: 5px 0;"><strong>Airline:</strong> ${deal.airline}</p>
                  <p style="margin: 5px 0;"><strong>Departure:</strong> ${new Date(deal.departure_date).toLocaleDateString()}</p>
                  ${deal.return_date ? `<p style="margin: 5px 0;"><strong>Return:</strong> ${new Date(deal.return_date).toLocaleDateString()}</p>` : ''}
                  <p style="margin: 5px 0;"><strong>Deal Score:</strong> ${deal.deal_score}/100</p>
                </div>
                
                <a href="${deal.affiliate_link}" style="display: inline-block; background: linear-gradient(135deg, #00a0a0 0%, #0077e6 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">Book This Deal</a>
                
                <p style="margin-top: 30px; font-size: 12px; color: #999;">This deal expires on ${new Date(deal.expires_at).toLocaleDateString()}. Book soon!</p>
              </div>
              
              <!-- Complete Your Trip Upsells -->
              <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="color: #00a0a0; margin-top: 0; margin-bottom: 15px;">✈️ Complete Your Trip to ${deal.destination_city}</h3>
                <p style="margin-bottom: 15px; color: #666;">Make the most of your journey with these travel essentials:</p>
                
                <div style="margin: 12px 0;">
                  <a href="${hotelsUrl}" style="display: block; color: #0077e6; text-decoration: none; padding: 10px; background: #f0f8ff; border-radius: 6px; margin-bottom: 10px;">
                    🏨 <strong>Find hotels from $45/night</strong> - Search now →
                  </a>
                </div>
                
                <div style="margin: 12px 0;">
                  <a href="${carsUrl}" style="display: block; color: #0077e6; text-decoration: none; padding: 10px; background: #f0f8ff; border-radius: 6px; margin-bottom: 10px;">
                    🚗 <strong>Rent a car from $25/day</strong> - Search now →
                  </a>
                </div>
                
                <div style="margin: 12px 0;">
                  <a href="${insuranceUrl}" style="display: block; color: #0077e6; text-decoration: none; padding: 10px; background: #f0f8ff; border-radius: 6px;">
                    🛡️ <strong>Protect your trip from $42/month</strong> - Get covered →
                  </a>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                <p>You're receiving this because you signed up for FareDrop alerts.</p>
                <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/alerts" style="color: #0077e6;">Manage your preferences</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending deal alert email:', error);
    return { success: false, error };
  }
}

/**
 * Sends a welcome email to a new subscriber
 */
export async function sendWelcomeEmail({ email, verificationToken }: SendWelcomeEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set. Skipping email send.');
    return { success: false, message: 'Email API not configured' };
  }

  const verificationLink = verificationToken
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/verify?token=${verificationToken}`
    : null;

  try {
    const data = await resend.emails.send({
      from: 'FareDrop <welcome@faredrop.com>',
      to: [email],
      subject: 'Welcome to FareDrop! ✈️',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to FareDrop</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #00a0a0 0%, #0077e6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to FareDrop!</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
              <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="font-size: 18px; margin-top: 0;">Thanks for joining FareDrop!</p>
                
                <p>We'll send you amazing flight deals directly to your inbox. Get ready to discover incredible destinations at unbeatable prices!</p>
                
                ${verificationLink ? `
                  <div style="margin: 30px 0;">
                    <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #00a0a0 0%, #0077e6 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Your Email</a>
                  </div>
                ` : ''}
                
                <div style="margin: 30px 0; padding: 20px; background: #f0f8ff; border-radius: 8px;">
                  <h3 style="color: #00a0a0; margin-top: 0;">What to expect:</h3>
                  <ul style="padding-left: 20px;">
                    <li>🔥 Exclusive flight deals with up to 90% off</li>
                    <li>🌍 Destinations worldwide from your preferred airport</li>
                    <li>⚡ Real-time alerts when new deals drop</li>
                    <li>✈️ Carefully curated offers, not spam</li>
                  </ul>
                </div>
                
                <p>Happy travels!</p>
                <p style="font-weight: bold; color: #00a0a0;">The FareDrop Team</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/alerts" style="color: #0077e6;">Manage your preferences</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

/**
 * Sends a batch of deal alerts to multiple subscribers
 */
export async function sendBatchDealAlerts(alerts: SendDealAlertParams[]) {
  const results = await Promise.allSettled(
    alerts.map((alert) => sendDealAlert(alert))
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return {
    total: alerts.length,
    successful,
    failed,
    results,
  };
}
