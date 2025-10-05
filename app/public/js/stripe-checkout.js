/**
 * Stripe Checkout Handler
 * Handles Stripe checkout process without inline JavaScript to comply with CSP
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the checkout page and Stripe is available
    if (typeof Stripe === 'undefined') {
        console.error('Stripe.js library not loaded');
        return;
    }

    const orderBtn = document.getElementById('order-btn');
    if (!orderBtn) {
        return; // Not on checkout page
    }

    // Get Stripe configuration from data attributes
    const stripePublishableKey = orderBtn.getAttribute('data-stripe-publishable-key');
    const sessionId = orderBtn.getAttribute('data-session-id');

    if (!stripePublishableKey || !sessionId) {
        console.error('Missing Stripe configuration');
        return;
    }

    // Initialize Stripe
    const stripe = Stripe(stripePublishableKey);

    // Add click event listener
    orderBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Disable button to prevent double-clicks
        orderBtn.disabled = true;
        orderBtn.textContent = 'Processing...';

        stripe.redirectToCheckout({
            sessionId: sessionId
        }).then(function(result) {
            if (result.error) {
                // Re-enable button and show error
                orderBtn.disabled = false;
                orderBtn.textContent = 'Pay with Stripe';
                alert('Error: ' + result.error.message);
            }
        }).catch(function(error) {
            // Re-enable button and show error
            orderBtn.disabled = false;
            orderBtn.textContent = 'Pay with Stripe';
            console.error('Stripe error:', error);
            alert('An error occurred. Please try again.');
        });
    });
});
