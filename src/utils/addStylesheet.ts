import { getNonce } from "./getNonce";

export interface IAddStylesheetArgs {
    id: string,
    css: string
}

export default function addStylesheet({
    id,
    css
}: IAddStylesheetArgs) {
    if(css) {
        let style = document.getElementById(id || '') as HTMLStyleElement;

        if (!style) {
            style = document.createElement('style');
            if (id) {
                style.id = id;
            }
            const nonce = getNonce();
            if (nonce) {
                style.setAttribute("nonce", nonce);
            }
            document.head.appendChild(style);
        }

        style.textContent = css;
    }
}