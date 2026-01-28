// @ts-expect-error: html template
import template from "./widget.html";
import css from "./widget.css";
import { openMenu } from "../menu/menu";
import translateWidget from "../menu/translateWidget";

import {
    pluginConfig
} from "@/globals/pluginConfig";

import { getNonce } from "@/utils/getNonce";
import { getTrustedHTML } from "@/utils/trustedTypes";

export let $widget: HTMLElement;

export function renderWidget() {
    $widget = document.createElement("div");
    $widget.classList.add("asw", "asw-container");
    
    const {
        position = "bottom-left",
        offset = [20, 25]
    } = pluginConfig;

    $widget.classList.add(`asw-widget-${position}`);

    const [offsetX = 20, offsetY = 25] = offset;

    $widget.style.setProperty('--asw-widget-offset-x', `${offsetX}px`);
    $widget.style.setProperty('--asw-widget-offset-y', `${offsetY}px`);
    $widget.style.setProperty('--asw-widget-center-y', `calc(50% - 29px - ${offsetY}px)`); // 58px / 2 = 29
    $widget.style.setProperty('--asw-widget-center-x', `calc(50% - 29px - ${offsetX}px)`);

    const style = document.createElement('style');
    const nonce = getNonce();
    if (nonce) {
        style.setAttribute("nonce", nonce);
    }
    style.textContent = css;
    $widget.appendChild(style);

    $widget.insertAdjacentHTML('beforeend', getTrustedHTML(template) as string);

    const $btn: HTMLElement = $widget.querySelector(".asw-menu-btn");
    
    $btn?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        openMenu();
    });

    translateWidget();

    document.body.appendChild($widget);

    return $widget;
}

// remove getButtonStyle function as it is no longer used


