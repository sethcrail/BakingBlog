
function storyMode() {
    document.querySelector(".recipe-story").style.display = "flex";
    document.querySelector(".recipe-list").style.display = "none";
}
function listMode() {
    document.querySelector(".recipe-story").style.display = "none";
    document.querySelector(".recipe-list").style.display = "flex";
}

function convertList() {
    document.querySelector(".metric").classList.toggle("hidden");
    document.querySelector(".imperial").classList.toggle("hidden");
}

const ingredientsList = document.getElementById('ingredient-list-container');
let isOpen = true;
console.log(ingredientsList.children[0].children[1]);

function toggleIngredients() {

    if (isOpen) {
        ingredientsList.style.height = "2rem";
        ingredientsList.children[0].children[1].style.transform = 'rotate(0deg)';

    } else {
        ingredientsList.style.height = "100%";
        ingredientsList.children[0].children[1].style.transform = 'rotate(180deg)';

    }
    isOpen = !isOpen;
}