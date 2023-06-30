function getRecipe(selection) {
    if (selection == "New Recipe") {
        const inputs = document.getElementsByClassName("input");
        Array.from(inputs).forEach((input)=> {
            input.value = "";
        });
    } else {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/" + selection);
        xhr.send();
        xhr.responseType = "json";
        xhr.onload = () => {
            if(xhr.readyState == 4 & xhr.status == 200) {
                const foundRecipe = xhr.response[0];
                //use for loop?
                document.getElementById('food-name').value = foundRecipe.foodName;
                document.getElementById('title').value = foundRecipe.title;
                document.getElementById('body').value = foundRecipe.body.join('\r\n\r\n');
                document.getElementById('quote').value = foundRecipe.quote;
                document.getElementById('quote-author').value = foundRecipe.citation;
                document.getElementById('ingredients-imperial').value = foundRecipe.ingredientsListImperial.join('\r\n\r\n');
                document.getElementById('ingredients-metric').value = foundRecipe.ingredientsListMetric.join('\r\n\r\n');
                document.getElementById('directions').value = foundRecipe.directionsList.join('\r\n\r\n');
            } else {
                console.log('Error: ${xhr.status}');
            }
        };
    }


};