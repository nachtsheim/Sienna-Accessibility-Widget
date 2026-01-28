import template from "./readingGuide.html";
import css from "./readingGuide.css";

import { getNonce } from "@/utils/getNonce";
import { getTrustedHTML } from "@/utils/trustedTypes";

export default function readingGuide(enable=false) {
    let guide = document.querySelector('.asw-rg-container') as HTMLElement;

    if(enable) {
        if(!guide) {
            guide = document.createElement("div");
            guide.classList.add('asw-rg-container');

            const style = document.createElement('style');
            const nonce = getNonce();
            if (nonce) {
                style.setAttribute("nonce", nonce);
            }
            style.textContent = css;
            guide.appendChild(style);

            guide.insertAdjacentHTML('beforeend', getTrustedHTML(template) as string);

            const margin = 20;

            window.__asw__onScrollReadableGuide = (event) => {
                guide.style.setProperty('--asw-rg-top-height', `${event.clientY - margin}px`);
                guide.style.setProperty('--asw-rg-bottom-height', `${window.innerHeight - event.clientY - (margin * 2)}px`);
            }

            document.addEventListener('mousemove', window.__asw__onScrollReadableGuide, { passive: false });
            
            document.body.appendChild(guide);
        }
    } else {
        guide?.remove();

        if(window.__asw__onScrollReadableGuide) {
            document.removeEventListener('mousemove', window.__asw__onScrollReadableGuide);
            delete window.__asw__onScrollReadableGuide;
        }
    }
}