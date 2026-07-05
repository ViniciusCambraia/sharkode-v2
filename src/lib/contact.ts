/**
 * Contato oficial da Sharkode — FONTE ÚNICA.
 * (Antes o número vivia copiado em 3 componentes e dois deles ficaram com um
 * placeholder 5511999999999 — link morto no footer e na seção de contato.)
 */
export const WHATSAPP_NUMBER = '5519989115066';
export const EMAIL = 'adm@sharkode.com.br';

/** Link wa.me, opcionalmente com mensagem pré-preenchida. */
export const wa = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
