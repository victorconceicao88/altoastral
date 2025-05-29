// Adicione esta função em um arquivo utilitário (por exemplo, ./whatsappUtils.js)
export const sendWhatsAppMessage = async (phone, message) => {
  try {
    // Remove todos os caracteres não numéricos
    const cleanedPhone = phone.replace(/\D/g, '');
    
    // Verifica se o número tem o código do país (Portugal +351)
    const formattedPhone = cleanedPhone.startsWith('351') ? cleanedPhone : 
                          cleanedPhone.startsWith('0') ? '351' + cleanedPhone.substring(1) : 
                          '351' + cleanedPhone;
    
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    
    // Abre em uma nova aba (alternativa: usar API oficial se disponível)
    window.open(whatsappUrl, '_blank');
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    return false;
  }
};