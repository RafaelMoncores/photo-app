// app/javascript/credit_card_form.js

document.addEventListener('turbo:load', function() {
  // Se o Stripe ainda não foi inicializado, não prossiga.
  // Use show_error para exibir uma mensagem mais amigável.
  if (typeof stripe === 'undefined') {
    show_error("Failed to load credit card processing functionality. Please reload this page.");
    console.error("Stripe.js v3 object not found. Please ensure it's loaded and initialized.");
    return;
  }

  const elements = stripe.elements();

  const card = elements.create('card', {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#313259',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '15px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    }
  });

  const cardElement = document.getElementById('card-element');
  if (cardElement) {
    card.mount(cardElement);
  } else {
    show_error("Missing payment input fields. Please contact support if this problem persists.");
    console.warn("Element with ID 'card-element' not found. Card input will not be rendered.");
    return;
  }

  const displayError = document.getElementById('card-errors');
  card.on('change', function(event) {
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });

  const form = document.querySelector('.cc_form');
  if (!form) {
    show_error("Payment form not found. Please contact support if this problem persists.");
    console.warn("Form with class 'cc_form' not found. Stripe integration will not function.");
    return;
  }

  const submitButton = form.querySelector('input[type="submit"]');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    if (submitButton) {
      submitButton.disabled = true;
    }

    stripe.createToken(card).then(function(result) {
      if (result.error) {
        displayError.textContent = result.error.message; // Erros do Stripe Elements
        if (submitButton) {
          submitButton.disabled = false;
        }
      } else {
        stripeTokenHandler(result.token);
      }
    });
  });

  function stripeTokenHandler(token) {
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'payment[token]');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    form.submit();
  }

  // Função para exibir mensagens de erro genéricas
  function show_error(message) {
    let flashMessagesContainer = document.getElementById('flash-messages');
    if (!flashMessagesContainer) {
      flashMessagesContainer = document.createElement('div');
      flashMessagesContainer.id = 'flash-messages';
      const mainContentArea = document.querySelector('div.container');
      if (mainContentArea) {
        mainContentArea.prepend(flashMessagesContainer);
      } else {
        console.error("Main container for flash messages not found. Cannot display error.");
        return;
      }
    }

    flashMessagesContainer.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <div id="flash_alert">${message}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    setTimeout(() => {
      const alertElement = flashMessagesContainer.querySelector('.alert');
      if (alertElement) {
        alertElement.classList.remove('show');
        alertElement.classList.add('fade');
        // Remove o elemento após a transição
        alertElement.addEventListener('transitionend', () => alertElement.remove());
      }
    }, 5000);
  }
});