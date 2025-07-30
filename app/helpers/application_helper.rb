module ApplicationHelper
  def bootstrap_flash
    flash_messages = []
    flash.each do |type, message|
      # Mapeia tipos de flash para classes Bootstrap
      css_class = case type.to_sym
                  when :notice then "info"    # 'notice' para 'info' (azul)
                  when :alert  then "warning" # 'alert' para 'warning' (amarelo)
                  when :error  then "danger"  # 'error' para 'danger' (vermelho)
                  when :success then "success" # 'success' para 'success' (verde)
                  else type.to_s
                  end

      text = content_tag(:div, class: "alert alert-#{css_class} alert-dismissible fade show", role: "alert") do
               # Adiciona a mensagem do flash
               concat message.html_safe
             end
      flash_messages << text if message.present? # Garante que só adiciona se houver mensagem
    end
    flash_messages.join("\n").html_safe
  end
end
