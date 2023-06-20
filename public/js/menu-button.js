function openNav() {
    document.querySelector(".side-nav").style.width = "clamp(200px, 30%, 250px)";
    document.querySelector("body", "html").style.overflowY = 'hidden';
    document.querySelector("body", "html").style.touchAction = 'none';
}