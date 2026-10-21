import { injectToolCSS } from "../utils/cssGenerator";
import IToolConfig from "../types/IToolConfig";
import { ALL_ELEMENT_SELECTORS, TEXT_SELECTORS } from "../enum/Selectors";
import { getScriptDataAttribute } from "../utils/getScriptDataAttribute";

// data-asw-font-url names a font file of the website itself. Without it the widget loads no web font: the font stack
// falls back to the fonts of the device, and the browser contacts no other host for the font.
export function getFontFaceCSS(fontUrl?: string | null): string {
    if (!fontUrl) {
        return "";
    }

    return `@font-face {font-family: OpenDyslexic3;src: url("${fontUrl.replace(/["\\\r\n]/g, encodeURIComponent)}");}`;
}

export const readableFontConfig: IToolConfig = {
    id: "readable-font",
    selector: `html`,
    childrenSelector: [...ALL_ELEMENT_SELECTORS, ...TEXT_SELECTORS],
    styles: {
        'font-family': 'OpenDyslexic3,Comic Sans MS,Arial,Helvetica,sans-serif'
    }
}

export default function readableFont(enable=false) {
    injectToolCSS({
        ...readableFontConfig,
        css: getFontFaceCSS(getScriptDataAttribute("font-url")),
        enable
    })
}
