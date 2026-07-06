import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

/**
 * Eases da marca — a assinatura rítmica do Sharkode.
 * Import este módulo uma vez e use por nome: ease: 'drift' | 'bite'.
 *
 * drift — deriva subaquática: saída longa, tudo que ENTRA/REVELA usa isto.
 * bite  — o bote: acelera feroz e TRAVA no fim; impactos, transições, pings.
 *
 * Equivalentes CSS (para animations em index.css):
 *   drift → cubic-bezier(0.2, 0, 0.1, 1)
 *   bite  → cubic-bezier(0.75, 0, 0.15, 1)
 */
CustomEase.create('drift', 'M0,0 C0.2,0 0.1,1 1,1');
CustomEase.create('bite', 'M0,0 C0.75,0 0.15,1 1,1');

export const EASE_DRIFT = 'drift';
export const EASE_BITE = 'bite';
