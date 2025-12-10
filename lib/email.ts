import { Resend } from 'resend';
import { Deal, Subscriber, User, PriceAlert, Booking } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder-key');

export interface SendDealAlertParams {
  subscriber: Subscriber;
  deal: Deal;
}

export interface SendWelcomeEmailParams {
  email: string;
  verificationToken?: string;
}

export interface SendPriceAlertEmailParams {
  user: User;
  alert: PriceAlert;
  currentPrice: number;
  dealLink: string;
}

export interface SendBookingConfirmationEmailParams {
  user: User;
  booking: Booking;
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

/**
 * Sends a price alert email when price drops below target
 */
export async function sendPriceAlertEmail({
  user,
  alert,
  currentPrice,
  dealLink,
}: SendPriceAlertEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set. Skipping email send.');
    return { success: false, message: 'Email API not configured' };
  }

  const savings = alert.target_price - currentPrice;
  const savingsPercent = Math.round((savings / alert.target_price) * 100);

  try {
    const data = await resend.emails.send({
      from: 'FareDrop <alerts@faredrop.com>',
      to: [user.email],
      subject: `🎉 Price Alert: ${alert.origin} → ${alert.destination} dropped to $${currentPrice}!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Price Alert Triggered</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #00a0a0 0%, #0077e6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Price Alert Triggered!</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
              <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="font-size: 18px; margin-top: 0;">Great news! The price has dropped below your target!</p>
                
                <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h2 style="color: #00a0a0; margin-top: 0;">${alert.origin} → ${alert.destination}</h2>
                  
                  <div style="display: flex; align-items: baseline; margin: 20px 0;">
                    <span style="font-size: 36px; font-weight: bold; color: #0077e6;">$${currentPrice}</span>
                    <span style="font-size: 18px; color: #999; text-decoration: line-through; margin-left: 10px;">$${alert.target_price}</span>
                    <span style="background: #ff6b6b; color: white; padding: 5px 10px; border-radius: 4px; margin-left: 10px; font-weight: bold;">${savingsPercent}% OFF</span>
                  </div>
                  
                  <p style="margin: 10px 0;"><strong>Your target price:</strong> $${alert.target_price}</p>
                  <p style="margin: 10px 0;"><strong>Current price:</strong> $${currentPrice}</p>
                  <p style="margin: 10px 0; color: #22c55e; font-weight: bold;"><strong>You save:</strong> $${savings.toFixed(2)}</p>
                  ${alert.departure_date_from ? `<p style="margin: 10px 0;"><strong>Travel dates:</strong> ${new Date(alert.departure_date_from).toLocaleDateString()}${alert.departure_date_to ? ' - ' + new Date(alert.departure_date_to).toLocaleDateString() : ''}</p>` : ''}
                </div>
                
                <a href="${dealLink}" style="display: inline-block; background: linear-gradient(135deg, #00a0a0 0%, #0077e6 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">View Flights</a>
                
                <p style="margin-top: 30px; font-size: 12px; color: #999;">Prices are subject to availability and may change. Book soon to lock in this deal!</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                <p>You're receiving this because you set up a price alert for this route.</p>
                <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/alerts" style="color: #0077e6;">Manage your alerts</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending price alert email:', error);
    return { success: false, error };
  }
}

/**
 * Sends a booking confirmation email
 */
export async function sendBookingConfirmationEmail({
  user,
  booking,
}: SendBookingConfirmationEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set. Skipping email send.');
    return { success: false, message: 'Email API not configured' };
  }

  try {
    const data = await resend.emails.send({
      from: 'FareDrop <bookings@faredrop.com>',
      to: [user.email],
      subject: `Booking Confirmation - ${booking.origin} → ${booking.destination}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmation</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #00a0a0 0%, #0077e6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">✅ Booking Confirmed!</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
              <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="font-size: 18px; margin-top: 0;">Your booking has been confirmed!</p>
                
                <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0077e6;">
                  <h2 style="color: #00a0a0; margin-top: 0;">${booking.origin} → ${booking.destination}</h2>
                  
                  ${booking.booking_reference ? `<p style="margin: 10px 0;"><strong>Booking Reference:</strong> ${booking.booking_reference}</p>` : ''}
                  <p style="margin: 10px 0;"><strong>Departure:</strong> ${new Date(booking.departure_date).toLocaleDateString()}</p>
                  ${booking.return_date ? `<p style="margin: 10px 0;"><strong>Return:</strong> ${new Date(booking.return_date).toLocaleDateString()}</p>` : ''}
                  <p style="margin: 10px 0;"><strong>Passengers:</strong> ${booking.passengers_count}</p>
                  <p style="margin: 10px 0;"><strong>Total Amount:</strong> ${booking.currency} $${booking.total_amount}</p>
                </div>
                
                <p>Your flight details and e-ticket will be available in your account.</p>
                
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/bookings" style="display: inline-block; background: linear-gradient(135deg, #00a0a0 0%, #0077e6 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">View Booking Details</a>
                
                <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                  <p style="margin: 0; font-weight: bold; color: #856404;">Important:</p>
                  <p style="margin: 10px 0 0 0; color: #856404;">Please check your email for additional information from the airline. Make sure to check in online 24 hours before your flight.</p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                <p>Need help? <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact" style="color: #0077e6;">Contact our support team</a></p>
                <p>Happy travels!</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return { success: false, error };
  }
}
