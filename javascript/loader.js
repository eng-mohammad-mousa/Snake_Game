"use strict";
let loadingDiv = document.getElementById("loadingDiv"), divOpacityString = loadingDiv.style.opacity, divOpacityFloat = parseFloat(divOpacityString);
window.onload = function () {
    setTimeout(removeOpacity, 300);
};
function removeOpacity() {
    divOpacityFloat = 1;
    var fadeEffect = setInterval(function () {
        if (!divOpacityFloat) {
            divOpacityFloat = 1;
        }
        if (divOpacityFloat > 0) {
            divOpacityFloat -= 0.1;
        }
        else {
            clearInterval(fadeEffect);
            loadingDiv.remove();
        }
    }, 30);
}
