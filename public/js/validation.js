/**
 * Universal Client-Side Validation System
 * Provides common validation functions and utilities for forms
 */

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.validators = new Map();
        this.init();
    }

    init() {
        if (!this.form) {
            return;
        }
        
        // Add form submission validation
        this.form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
            }
        });
    }

    // Register a validator for a specific field
    addValidator(fieldId, validatorFunction) {
        const field = document.getElementById(fieldId);
        if (field) {
            this.validators.set(fieldId, validatorFunction);
            field.addEventListener('blur', () => validatorFunction());
        }
    }

    // Validate all registered fields
    validateForm() {
        let isValid = true;
        for (const [fieldId, validator] of this.validators) {
            if (!validator()) {
                isValid = false;
            }
        }
        return isValid;
    }

    // Utility function to show error state
    static showError(input, feedback, message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        feedback.textContent = message;
        feedback.style.display = 'block';
    }

    // Utility function to show success state
    static showSuccess(input, feedback) {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
        feedback.style.display = 'none';
    }

    // Common validation functions
    static validators = {
        // Title validation (for products)
        validateTitle: function(input, feedback, minLength = 3, maxLength = 100) {
            const title = input.value.trim();
            
            if (title.length < minLength) {
                FormValidator.showError(input, feedback, `Title must be at least ${minLength} characters long`);
                return false;
            } else if (title.length > maxLength) {
                FormValidator.showError(input, feedback, `Title cannot exceed ${maxLength} characters`);
                return false;
            } else {
                FormValidator.showSuccess(input, feedback);
                return true;
            }
        },

        // Image URL validation
        validateImageUrl: function(input, feedback) {
            const imageUrl = input.value.trim();
            const urlRegex = /^https?:\/\/.+/;
            
            if (!imageUrl) {
                FormValidator.showError(input, feedback, 'Image URL is required');
                return false;
            } else if (!urlRegex.test(imageUrl)) {
                FormValidator.showError(input, feedback, 'Please enter a valid URL');
                return false;
            } else {
                FormValidator.showSuccess(input, feedback);
                return true;
            }
        },

        // Price validation
        validatePrice: function(input, feedback) {
            const price = parseFloat(input.value);
            
            if (isNaN(price)) {
                FormValidator.showError(input, feedback, 'Price is required');
                return false;
            } else if (price <= 0) {
                FormValidator.showError(input, feedback, 'Price must be greater than 0');
                return false;
            } else {
                FormValidator.showSuccess(input, feedback);
                return true;
            }
        },

        // Description validation
        validateDescription: function(input, feedback, minLength = 10, maxLength = 500) {
            const description = input.value.trim();
            
            if (description.length < minLength) {
                FormValidator.showError(input, feedback, `Description must be at least ${minLength} characters long`);
                return false;
            } else if (description.length > maxLength) {
                FormValidator.showError(input, feedback, `Description cannot exceed ${maxLength} characters`);
                return false;
            } else {
                FormValidator.showSuccess(input, feedback);
                return true;
            }
        },

        // Name validation
        validateName: function(input, feedback, minLength = 2, maxLength = 50) {
            const name = input.value.trim();
            
            if (name.length < minLength) {
                FormValidator.showError(input, feedback, `Name must be at least ${minLength} characters long`);
                return false;
            } else if (name.length > maxLength) {
                FormValidator.showError(input, feedback, `Name cannot exceed ${maxLength} characters`);
                return false;
            } else {
                FormValidator.showSuccess(input, feedback);
                return true;
            }
        },

        // Email validation
        validateEmail: function(input, feedback) {
            const email = input.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!email) {
                FormValidator.showError(input, feedback, 'Email is required');
                return false;
            } else if (!emailRegex.test(email)) {
                FormValidator.showError(input, feedback, 'Please enter a valid email address');
                return false;
            } else {
                FormValidator.showSuccess(input, feedback);
                return true;
            }
        },

        // Password validation
        validatePassword: function(input, feedback, minLength = 6) {
            const password = input.value;
            const passwordRegex = /^[a-zA-Z0-9]+$/;
            
            if (password.length < minLength) {
                FormValidator.showError(input, feedback, `Password must be at least ${minLength} characters long`);
                return false;
            } else if (!passwordRegex.test(password)) {
                FormValidator.showError(input, feedback, 'Password must contain only letters and numbers');
                return false;
            } else {
                FormValidator.showSuccess(input, feedback);
                return true;
            }
        },

        // Confirm password validation
        validateConfirmPassword: function(input, feedback, passwordInput) {
            const password = passwordInput.value;
            const confirmPassword = input.value;
            
            if (confirmPassword !== password) {
                FormValidator.showError(input, feedback, 'Passwords do not match');
                return false;
            } else if (confirmPassword.length === 0) {
                FormValidator.showError(input, feedback, 'Please confirm your password');
                return false;
            } else {
                FormValidator.showSuccess(input, feedback);
                return true;
            }
        },

        // Simple password validation (for login forms)
        validateLoginPassword: function(input, feedback) {
            const password = input.value;
            
            if (password.length === 0) {
                FormValidator.showError(input, feedback, 'Password is required');
                return false;
            } else {
                FormValidator.showSuccess(input, feedback);
                return true;
            }
        }
    };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}
