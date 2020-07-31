let mainWrapper = document.querySelector(".main-wrapper");

createLightDarkModeToggle()

function createLightDarkModeToggle() {
    let html = document.querySelector("html");
    html.setAttribute("data-theme", "light-mode");

    let input = document.querySelector(".theme-changer");

    input.addEventListener("click", function(event) {
        if (this.checked) {
            html.dataset.theme = "dark-mode";
            input.dataset.daytimeStatus = "dark-mode";
        } else {
            html.dataset.theme = "light-mode";
            input.dataset.daytimeStatus = "light-mode";
        }
    })
}