/**
 * PayPal REST API v2 Integration
 * Handles OAuth2 authentication, order creation, and payment capture.
 */

const getPayPalBaseUrl = () => {
    return process.env.PAYPAL_MODE === 'live' 
        ? 'https://api-m.paypal.com' 
        : 'https://api-m.sandbox.paypal.com';
};

/**
 * Retrieve PayPal OAuth2 Access Token
 */
async function getAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('PayPal credentials missing. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your .env file.');
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to authenticate with PayPal: ${errText}`);
    }

    const data = await response.json();
    return data.access_token;
}

/**
 * Create a PayPal Checkout Order
 * Returns the order ID and approval URL for redirecting the user to PayPal.
 */
async function createOrder({ userId, plan = 'premium', returnUrl, cancelUrl }) {
    const currency = process.env.PAYPAL_CURRENCY || 'USD';
    const amountValue = process.env.SUBSCRIPTION_PRICE || '11.99';

    const accessToken = await getAccessToken();

    const orderPayload = {
        intent: 'CAPTURE',
        purchase_units: [
            {
                reference_id: userId.toString(),
                description: `Duckshow ${plan.toUpperCase()} Subscription (1 Year)`,
                amount: {
                    currency_code: currency,
                    value: amountValue
                }
            }
        ],
        application_context: {
            brand_name: 'Duckshow Streaming',
            landing_page: 'BILLING',
            user_action: 'PAY_NOW',
            return_url: returnUrl,
            cancel_url: cancelUrl
        }
    };

    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(`PayPal Order creation failed: ${JSON.stringify(errData)}`);
    }

    const order = await response.json();
    const approveLink = order.links.find(link => link.rel === 'approve');

    if (!approveLink) {
        throw new Error('PayPal did not return an approval link.');
    }

    return {
        orderId: order.id,
        approveUrl: approveLink.href,
        status: order.status
    };
}

/**
 * Capture payment for an approved PayPal Order
 */
async function captureOrder(orderId) {
    const accessToken = await getAccessToken();

    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(`PayPal payment capture failed: ${JSON.stringify(errData)}`);
    }

    const captureData = await response.json();
    return captureData;
}

module.exports = {
    createOrder,
    captureOrder,
    getPayPalBaseUrl
};
