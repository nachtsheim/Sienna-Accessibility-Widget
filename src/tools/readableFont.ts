import { injectToolCSS } from "../utils/cssGenerator";
import IToolConfig from "../types/IToolConfig";
import { ALL_ELEMENT_SELECTORS, TEXT_SELECTORS } from "../enum/Selectors";
import { getScriptDataAttribute } from "../utils/getScriptDataAttribute";

const DEFAULT_FONT_SOURCES = `url("https://website-widgets.pages.dev/fonts/OpenDyslexic3-Regular.woff") format("woff"), url("https://website-widgets.pages.dev/fonts/OpenDyslexic3-Regular.ttf") format("truetype")`;

function getFontFaceCSS(sources: string): string {
    return `@font-face {font-family: OpenDyslexic3;src: ${sources};}`;
}

// data-asw-font-url names a font file of the website itself; without it, the font comes from website-widgets.pages.dev.
export function getFontSources(fontUrl?: string | null): string {
    if (!fontUrl) {
        return DEFAULT_FONT_SOURCES;
    }

    return `url("${fontUrl.replace(/["\\\r\n]/g, encodeURIComponent)}")`;
}

export const readableFontConfig: IToolConfig = {
    id: "readable-font",
    selector: `html`,
    childrenSelector: [...ALL_ELEMENT_SELECTORS, ...TEXT_SELECTORS],
    styles: {
        'font-family': 'OpenDyslexic3,Comic Sans MS,Arial,Helvetica,sans-serif'
    },
    css: getFontFaceCSS(DEFAULT_FONT_SOURCES)
}

export default function readableFont(enable=false) {
    injectToolCSS({
        ...readableFontConfig,
        css: getFontFaceCSS(getFontSources(getScriptDataAttribute("font-url"))),
        enable
    })
}
