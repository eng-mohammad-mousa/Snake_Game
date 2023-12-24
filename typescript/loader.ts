let
    loadingDiv = document.getElementById("loadingDiv") as HTMLDivElement,

    divOpacityString: string = loadingDiv.style.opacity,
    divOpacityFloat: number = parseFloat(divOpacityString);

window.onload = function (): void {
    setTimeout(removeOpacity, 300);
}

function removeOpacity(): void {

    divOpacityFloat = 1;

    var fadeEffect = setInterval(function () {
        if (!divOpacityFloat) {
            divOpacityFloat = 1;
        }
        if (divOpacityFloat > 0) {
            divOpacityFloat -= 0.1;
        } else {
            clearInterval(fadeEffect);
            loadingDiv.remove();
        }
    }, 30);
}