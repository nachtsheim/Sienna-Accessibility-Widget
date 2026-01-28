import { getScriptDataAttribute } from "./getScriptDataAttribute";

export function getNonce() {
    return getScriptDataAttribute("nonce") || "";
}
