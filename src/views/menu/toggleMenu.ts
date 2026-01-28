import { $menu } from "./menu";
import { $widget } from "../widget/widget";

export default function toggleMenu() {
    $menu.classList.toggle('asw-hidden');

    const $overlay = $menu.parentElement.querySelector('.asw-overlay');
    $overlay?.classList.toggle('asw-hidden');
    
    const isVisible = !$menu.classList.contains('asw-hidden');
    if (isVisible) {
        $widget.classList.add('asw-menu-opened');
    } else {
        $widget.classList.remove('asw-menu-opened');
    }
}