let searchButton = document.querySelector(".button")
let input = document.querySelector(".searchbox")
let imagecontainer = document.querySelector(".image")
let popup = document.querySelector(".pop")
let intro = document.querySelector(".intro")

async function displayitems() {
    intro.innerText = "Fetching Responses...";
    let food = input.value;
    let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`;
    
    try {
        let response_i = await fetch(url);
        if (!response_i.ok) {
            throw new Error(`HTTP error! Status: ${response_i.status}`);
        }
        let responses = await response_i.json();

        if (!responses.meals) {
            intro.innerText = "No recipes found for the entered food.";
            imagecontainer.innerHTML = "";
            return;
        }

        let len = responses.meals.length;

        let content = "";
        for (let i = 0; i < len; i++) {
            console.log(responses.meals[i].strMeal);

            content += `
                <div class="bg-white w-80 h-100 px-5 py-5 flex flex-col justify-center content-center items-center rounded-lg border-2 border-solid border-blue-950 shadow-lg shadow-black transform transition duration-300 hover:scale-105">
                    <div>    
                        <a href="${responses.meals[i].strMealThumb}" target="_blank"><img src="${responses.meals[i].strMealThumb}" class="w-60 h-50 border-2 border-blue-950 rounded"></a>
                    </div>
                    <div>    
                        <p class="text-xl"><b>${responses.meals[i].strMeal}</b></p>
                    </div>
                    <div>    
                        <p><u>${responses.meals[i].strArea}</u> Dish</p>
                    </div>
                    <div>   
                        <p>Belongs to <i>${responses.meals[i].strCategory}</i> Category</p>
                    </div>
                    <div>
                        <button class="next bg-blue-700 text-white font-bold rounded-md px-5 py-2 mt-3 hover:bg-blue-950" data-meal-index="${i}">View Recipe</button>
                    </div>
                </div>
            `;
        }

        intro.innerText = "";
        imagecontainer.innerHTML = content;

        document.querySelectorAll(".next").forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                let mealIndex = e.target.getAttribute('data-meal-index');
                openPopup(responses.meals[mealIndex]);
            });
        });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        intro.innerText = "Error in fetching recipes. Please try again later.";
        imagecontainer.innerHTML = "";
    }
}


searchButton.addEventListener("click", (e) => {
    e.preventDefault()
    displayitems()
})

function openPopup(meal) {
    let Ingredients = ""
    for(let i=1; i<=20; i++){
        let ingredient = meal[`strIngredient${i}`]
        let measurement =  meal[`strMeasure${i}`]
        if(ingredient){
            Ingredients += `<li class="list-disc">${ingredient} - ${measurement}</li>`
        }
        else{
            break
        }


    }
    popup.innerHTML = `
        <div class="flex flex-col justify-center items-center mt-28">
            <div class="bg-white rounded-3xl p-5 w-1/3 h-[600px] overflow-auto hover:overflow-y-scroll ">
                <div class="flex flex-row justify-between items-center content-center mb-2 ">
                    <h2 class="text-3xl font-bold mb-4">${meal.strMeal}</h2>
                    <button class="close-popup text-3xl font-bold border-2 border-red-600 rounded-md pb-1 px-2 mt-0">&times;</button>
                </div>
                <img src="${meal.strMealThumb}" class="w-full h-60 object-cover rounded-md mb-4">
                <p><b>Ingredients:</b></p>
                <ul>
                    ${Ingredients}
                <ul>
                <p><b>Instructions:-<b></p>
                <p class="font-medium ">${meal.strInstructions}</p>
            </div>
        </div>
    `
    popup.classList.remove("hidden")
    popup.classList.add("block")

    document.querySelector(".close-popup").addEventListener("click", () => {
        popup.classList.add("hidden")
        popup.classList.remove("block")
    })
}
