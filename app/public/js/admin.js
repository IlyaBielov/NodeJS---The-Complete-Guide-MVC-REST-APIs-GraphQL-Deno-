const deleteProduct = (btn) => {
    const productId = btn.parentElement.querySelector('[name="productId"]').value;
    const csrf = btn.parentElement.querySelector('[name="_csrf"]').value;

    const productElement = btn.closest('article');

    fetch(`/admin/product/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrf
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || `HTTP error! status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data.message);
            productElement.remove();
        })
        .catch(error => {
            console.error('Error:', error.message);
            alert('Failed to delete product: ' + error.message);
        })
}
