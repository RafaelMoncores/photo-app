// app/javascript/application.js
import "@hotwired/turbo-rails"
import "controllers"
import * as bootstrap from "bootstrap"

// A função que inicializa os alertas
function initializeBsAlerts() {
  document.querySelectorAll('.alert').forEach(alertElement => {
    // Apenas inicializa se uma instância ainda não existe
    if (bootstrap.Alert.getInstance(alertElement) === null) {
      new bootstrap.Alert(alertElement);
    }
  });
}

// Chame a função em eventos-chave do Turbo Drive
document.addEventListener('turbo:load', initializeBsAlerts);
document.addEventListener('turbo:render', initializeBsAlerts);
document.addEventListener('turbo:restoration', initializeBsAlerts);