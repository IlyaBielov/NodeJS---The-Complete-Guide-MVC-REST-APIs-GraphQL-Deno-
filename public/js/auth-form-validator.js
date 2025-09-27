/**
 * Auth Form Validator
 * Handles validation for authentication forms (login, signup)
 */
class AuthFormValidator {
    constructor(formId) {
        this.validator = new FormValidator(formId);
        this.formId = formId;
        this.initializeValidation();
    }

    initializeValidation() {
        if (this.formId === 'signupForm') {
            this.initializeSignupValidation();
        } else if (this.formId === 'loginForm') {
            this.initializeLoginValidation();
        } else if (this.formId === 'newPasswordForm') {
            this.initializeNewPasswordValidation();
        } else if (this.formId === 'resetPasswordForm') {
            this.initializeResetPasswordValidation();
        }
    }

    initializeSignupValidation() {
        // Get form elements
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        // Get feedback elements
        const nameFeedback = nameInput.parentElement.querySelector('.invalid-feedback');
        const emailFeedback = emailInput.parentElement.querySelector('.invalid-feedback');
        const passwordFeedback = passwordInput.parentElement.querySelector('.invalid-feedback');
        const confirmPasswordFeedback = confirmPasswordInput.parentElement.querySelector('.invalid-feedback');

        // Register validators
        this.validator.addValidator('name', () => FormValidator.validators.validateName(nameInput, nameFeedback));
        this.validator.addValidator('email', () => FormValidator.validators.validateEmail(emailInput, emailFeedback));
        this.validator.addValidator('password', () => FormValidator.validators.validatePassword(passwordInput, passwordFeedback));
        this.validator.addValidator('confirmPassword', () => FormValidator.validators.validateConfirmPassword(confirmPasswordInput, confirmPasswordFeedback, passwordInput));
    }

    initializeLoginValidation() {
        // Get form elements
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        // Get feedback elements
        const emailFeedback = emailInput.parentElement.querySelector('.invalid-feedback');
        const passwordFeedback = passwordInput.parentElement.querySelector('.invalid-feedback');

        // Register validators
        this.validator.addValidator('email', () => FormValidator.validators.validateEmail(emailInput, emailFeedback));
        this.validator.addValidator('password', () => FormValidator.validators.validateLoginPassword(passwordInput, passwordFeedback));
    }

    initializeNewPasswordValidation() {
        // Get form elements
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        // Get feedback elements
        const passwordFeedback = passwordInput.parentElement.querySelector('.invalid-feedback');
        const confirmPasswordFeedback = confirmPasswordInput.parentElement.querySelector('.invalid-feedback');

        // Register validators
        this.validator.addValidator('password', () => FormValidator.validators.validatePassword(passwordInput, passwordFeedback));
        this.validator.addValidator('confirmPassword', () => FormValidator.validators.validateConfirmPassword(confirmPasswordInput, confirmPasswordFeedback, passwordInput));
    }

    initializeResetPasswordValidation() {
        // Get form elements
        const emailInput = document.getElementById('email');
        
        // Get feedback elements
        const emailFeedback = emailInput.parentElement.querySelector('.invalid-feedback');

        // Register validators
        this.validator.addValidator('email', () => FormValidator.validators.validateEmail(emailInput, emailFeedback));
    }

    getValidator() {
        return this.validator;
    }
}

// Initialize based on form present on page
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const newPasswordForm = document.getElementById('newPasswordForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    
    if (signupForm) {
        new AuthFormValidator('signupForm');
    } else if (loginForm) {
        new AuthFormValidator('loginForm');
    } else if (newPasswordForm) {
        new AuthFormValidator('newPasswordForm');
    } else if (resetPasswordForm) {
        new AuthFormValidator('resetPasswordForm');
    }
});
