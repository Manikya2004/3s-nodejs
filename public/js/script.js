const contactForm = document.querySelector(".contact form");
contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const nameInput = document.querySelector(".contact input[type='text']");
    const emailInput = document.querySelector(".contact input[type='email']");

    let hasErrors = false;

    if (nameInput.value.trim() === "") {
        alert("Please enter your name");
        hasErrors = true;
    }

    if (!validateEmail(emailInput.value)) {
        alert("Please enter a valid email address");
        hasErrors = true;
    }

    if (!hasErrors) {
        // If no errors, you would submit the form data (usually to a server)
        alert("Form submitted!");
    }
});

function validateEmail(email) {
    // A basic email validation pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

