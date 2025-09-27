/**
 * Product Form Validator
 * Handles validation for product add/edit forms
 */
class ProductFormValidator {
    constructor(formId) {
        this.validator = new FormValidator(formId);
        this.initializeValidation();
    }

    initializeValidation() {
        if (!this.validator) {
            return;
        }

        // Get form elements
        const titleInput = document.getElementById('title');
        const imageUrlInput = document.getElementById('imageUrl');
        const priceInput = document.getElementById('price');
        const descriptionInput = document.getElementById('description');

        if (!titleInput || !imageUrlInput || !priceInput || !descriptionInput) {
            return;
        }
        
        // Get feedback elements
        const titleFeedback = titleInput.parentElement.querySelector('.invalid-feedback');
        const imageUrlFeedback = imageUrlInput.parentElement.querySelector('.invalid-feedback');
        const priceFeedback = priceInput.parentElement.querySelector('.invalid-feedback');
        const descriptionFeedback = descriptionInput.parentElement.querySelector('.invalid-feedback');

        // Register validators
        this.validator.addValidator('title', () => FormValidator.validators.validateTitle(titleInput, titleFeedback));
        this.validator.addValidator('imageUrl', () => FormValidator.validators.validateImageUrl(imageUrlInput, imageUrlFeedback));
        this.validator.addValidator('price', () => FormValidator.validators.validatePrice(priceInput, priceFeedback));
        this.validator.addValidator('description', () => FormValidator.validators.validateDescription(descriptionInput, descriptionFeedback));
    }

    getValidator() {
        return this.validator;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ProductFormValidator('productForm');
});
