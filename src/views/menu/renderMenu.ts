// @ts-expect-error: html template
import template from "./menu.html";

import FilterButtons from "./FilterButtons";
import ContentButtons from "./ContentButtons";
import ToolButtons from "../../enum/TOOL_PRESETS";

import renderButtons from "./renderButtons";
import adjustFontSize from "../../tools/adjustFontSize";
import renderTools from "./renderTools";
import reset from "./reset";

import { ILanguage, LANGUAGES } from "../../i18n/Languages";

import css from "./menu.css";
import enableContrast from "@/tools/enableContrast";
import { pluginConfig } from "@/globals/pluginConfig";
import { userSettings, saveUserSettings } from "@/globals/userSettings";
import { changeLanguage } from "@/i18n/changeLanguage";
import toggleMenu from "./toggleMenu";
import { $widget } from "../widget/widget";
import { getNonce } from "@/utils/getNonce";
import { getTrustedHTML } from "@/utils/trustedTypes";

export default function renderMenu() {
    const $container: HTMLElement = document.createElement("div");
    
    const style = document.createElement('style');
    const nonce = getNonce();
    if (nonce) {
        style.setAttribute("nonce", nonce);
    }
    style.textContent = css;
    $container.appendChild(style);

    $container.insertAdjacentHTML('beforeend', getTrustedHTML(template) as string);

    const $menu = $container.querySelector(".asw-menu") as HTMLElement;
    $menu.classList.add('asw-hidden');

    const $overlay = $container.querySelector(".asw-overlay") as HTMLElement;
    $overlay.classList.add('asw-hidden');

    if (pluginConfig?.position?.includes("right")) {
        $menu.classList.add('asw-menu-right');
    }

    $menu.querySelector(".content").insertAdjacentHTML('beforeend', getTrustedHTML(renderButtons(ContentButtons)) as string);
    $menu.querySelector(".tools").insertAdjacentHTML('beforeend', getTrustedHTML(renderButtons(ToolButtons, 'asw-tools')) as string);
    $menu.querySelector(".contrast").insertAdjacentHTML('beforeend', getTrustedHTML(renderButtons(FilterButtons, 'asw-filter')) as string);

    // *** States UI Rendering ***
    const states = userSettings?.states;

    const fontSize = Number(states?.fontSize) || 1;
    if (fontSize != 1) {
        $menu.querySelector(".asw-amount").textContent = `${fontSize * 100}%`;
    }

    if (states) {
        const buttons = Array.from($menu.querySelectorAll('.asw-btn'));

        Object.entries(states).forEach(([key, value]) => {
            if (value && key !== "fontSize") {
                const selector = key === "contrast" ? states[key] : key;
                const btn = buttons.find(b => b.dataset.key === selector);
                if (btn) btn.classList.add("asw-selected");
            }
        });
    }

    // *** Translations ***
    if (!userSettings.lang && pluginConfig?.lang) {
        userSettings.lang = pluginConfig.lang;
    }

    if (!LANGUAGES.some(lang => lang.code === userSettings.lang)) {
        userSettings.lang = "en";
    }

    const $lang = $menu.querySelector("#asw-language") as HTMLSelectElement;
    LANGUAGES.forEach((lang: ILanguage) => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.label;
        $lang.appendChild(option);
    });
    $lang.value = userSettings.lang;
    $lang.addEventListener("change", (event) => {
        changeLanguage(event.target.value);
    });

    // *** Utils ***
    $container.querySelectorAll('.asw-menu-close, .asw-overlay').forEach((el) =>
        el.addEventListener('click', toggleMenu)
    );

    $container.querySelectorAll('.asw-menu-reset').forEach((el) =>
        el.addEventListener('click', reset)
    );

    // *** Controls ***
    $menu.querySelectorAll(".asw-plus, .asw-minus").forEach((el: HTMLElement) => {
        el.addEventListener("click", () => {
            const difference = 0.1;

            let fontSize = userSettings?.states?.fontSize || 1;
            if (el.classList.contains('asw-minus')) {
                fontSize -= difference;
            } else {
                fontSize += difference;
            }

            fontSize = Math.max(fontSize, 0.1);
            fontSize = Math.min(fontSize, 2);
            fontSize = Number(fontSize.toFixed(2));

            document.querySelector(".asw-amount").textContent = `${(fontSize * 100).toFixed(0)}%`;

            adjustFontSize(fontSize);
            userSettings.states.fontSize = fontSize;

            saveUserSettings();
        });
    });

    $menu.querySelectorAll(".asw-btn").forEach((el: HTMLElement) => {
        el.addEventListener("click", () => {
            const key = el.dataset.key;
            const isSelected = !el.classList.contains("asw-selected");
            
            // --- Contrast ---
            if (el.classList.contains("asw-filter")) {
                $menu.querySelectorAll(".asw-filter").forEach((el: HTMLElement) =>
                    el.classList.remove("asw-selected")
                );

                if (isSelected) {
                    el.classList.add("asw-selected");
                }

                userSettings.states.contrast = isSelected ? key : false;
                enableContrast(userSettings.states.contrast);

                saveUserSettings();

                return;
            }
            
            el.classList.toggle("asw-selected", isSelected);
            userSettings.states[key] = isSelected;
            renderTools();

            saveUserSettings();
        });
    });

    $widget.appendChild($container);

    return $menu;
}