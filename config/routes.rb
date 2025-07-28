Rails.application.routes.draw do
  root 'welcome#index'
  get "up" => "rails/health#show", as: :rails_health_check
end
