function loadPayPalScript(clientId) {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
    script.async = true;
    script.onload = initializePayPalButtons; // Call the function to initialize PayPal buttons after script load
    document.head.appendChild(script);
}

// Function to fetch the PayPal client ID from the server
async function getPayPalClientId() {
    try {
        const response = await fetch('https://backend-cgif.onrender.com/get-paypal-client-id');
        const data = await response.json();
        return data.clientId;
    } catch (error) {
        console.error('Error fetching PayPal client ID:', error);
        return null;
    }
}

// Function to initialize PayPal buttons
function initializePayPalButtons() {
    // Render the PayPal buttons using the PayPal SDK
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: document.getElementById('amountInput').value,
                    },
                }],
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                // Get the value of the email updates checkbox
                const emailUpdates = document.getElementById('gridCheck').checked;

                // Call your custom function to handle payment success
                handlePayPalPayment(emailUpdates);
            });
        },
    }).render('#paypal-button-container');
}

// Function to handle PayPal payment
function handlePayPalPayment(emailUpdates) {
    // Get the captured information
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const amountInput = document.getElementById('amountInput');

    const formData = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        amount: amountInput.value,
        emailUpdates: emailUpdates,
    };

    // Send the information to your server
    fetch('https://backend-cgif.onrender.com/capture-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Clear the form fields
                firstName.value = '';
                lastName.value = '';
                email.value = '';
                amountInput.value = '';

                // Update donation count and total amount on the page
                updateDonationInfo(result.donationCount, result.totalAmount);

                // Hide the modal
                $('#paypalModal').modal('hide');

                alert('Payment and form data captured successfully');
            } else {
                alert('Failed to capture form data.');
            }
        })
        .catch(error => {
            console.error('Error capturing form data:', error);
            alert('Sorry! failed to capture form data.');
        });
}

// Function to update donation count and total amount on the page
function updateDonationInfo(donationCount, totalAmount) {
    const donationCountElement = document.getElementById('donationCount');
    const totalAmountElement = document.getElementById('totalAmount');

    donationCountElement.textContent = donationCount;
    totalAmountElement.textContent = totalAmount.toFixed(2);
}

// Function to submit the form
async function submitForm() {
    // Validate the form data if needed

    // Check if the amount is filled
    const amountInput = document.getElementById('amountInput');
    if (!amountInput.value) {
        alert('Please enter the donation amount.');
        return;
    }

    const emailUpdatesCheckbox = document.getElementById('gridCheck');
    const emailUpdates = emailUpdatesCheckbox.checked;

    // Show the modal and PayPal buttons
    $('#paypalModal').modal('show');

    // Fetch the PayPal client ID and render the PayPal buttons dynamically
    const clientId = await getPayPalClientId();
    if (clientId) {
        loadPayPalScript(clientId);
    }
}

// Function to get and update initial donation information
async function getInitialDonationInfo() {
    try {
        // Fetch initial donation information from your server
        const response = await fetch('https://backend-cgif.onrender.com/get-initial-donation-info');
        const data = await response.json();

        // Update the donation count and total amount on the page
        updateDonationInfo(data.donationCount, data.totalAmount);
    } catch (error) {
        console.error('Error fetching initial donation info:', error);
    }
}

// Document ready function
$(document).ready(function () {
    // Other existing document ready code...

    // Example: Initialize carousel
    $('#mycarousel').carousel({ interval: 8000 });

    // Example: Handle carousel button click
    $("#carouselButton").click(function () {
        // Existing carousel button click code...
    });

    // Get and update initial donation information
    getInitialDonationInfo();
});
