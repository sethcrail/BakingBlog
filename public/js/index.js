function storyMode() {
    document.querySelector(".recipe-story").style.display = "flex";
    document.querySelector(".recipe-list").style.display = "none";
}
function listMode() {
    document.querySelector(".recipe-story").style.display = "none";
    document.querySelector(".recipe-list").style.display = "flex";
}

// Fade between hero and recipe
window.addEventListener('scroll', ()=> {
    var scrolled = window.scrollY;

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;

    const distance = Math.round((scrolled / scrollable) * 100) / 100;

    document.querySelector(".hero").style.opacity = 1 - distance * 3;
});
