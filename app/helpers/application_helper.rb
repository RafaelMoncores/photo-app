module ApplicationHelper
  def bootstrap_flash
    flash_messages = []
    flash.each do |type, message|
      type = 'success' if type == 'notice'
      type = 'danger'  if type == 'alert'
      text = content_tag(:div, message.html_safe, class: "alert alert-#{type} alert-dismissible fade show", role: "alert") do
               content_tag(:button, type: "button", class: "btn-close", "data-bs-dismiss" => "alert", "aria-label" => "Close") do
                 content_tag(:span, "&times;".html_safe, "aria-hidden" => "true")
               end + message.html_safe
             end
      flash_messages << text if message
    end
    flash_messages.join("\n").html_safe
  end
end
