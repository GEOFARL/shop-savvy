class Spinner {
  constructor(selector) {
    this.htmlEL = document.querySelector(selector);
  }

  showSpinner() {
    this.htmlEL.style.visibility = 'visible';
  }

  hideSpinner() {
    this.htmlEL.style.visibility = 'hidden';
  }
}

const productForm = document.querySelector('form.product-form');

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const spinner = new Spinner('.spinner');
  const formData = new FormData(productForm);

  const validTypes = ['image/jpg', 'image/jpeg', 'image/png'];

  if (
    !validTypes.includes(formData.get('image').type) &&
    formData.get('image').size !== 0
  ) {
    // Error message block not created
    if (!document.querySelector('.user-message')) {
      const errorElement = document.createElement('div');
      errorElement.classList.add(
        'user-message',
        'user-message--error',
        'shake-horizontal'
      );
      errorElement.innerText = `${
        formData.get('image').type
      } is not a valid type`;
      productForm.prepend(errorElement);
    } else {
      // Already exists
      const errorEl = document.querySelector('.user-message');
      errorEl.innerText = `${formData.get('image').type} is not a valid type`;

      // Add shaking animation
      errorEl.classList.remove('shake-horizontal');
      setTimeout(() => errorEl.classList.add('shake-horizontal'), 50);
    }
    return;
  }

  spinner.showSpinner();
  const response = await fetch(e.target.action, {
    method: 'POST',
    body: formData,
  });
  spinner.hideSpinner();

  if (response.ok) {
    // Navigate to products page
    window.location.href = '/admin/products';
  }
});
