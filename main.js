//// Here we check if there is an array in local storage to save our favourited meals.
//// If not, then an array will be created

if (localStorage.getItem("favouriteMeals") == null) {
    localStorage.setItem("favouriteMeals", JSON.stringify([]));
}



///// This function is used to fetch meals from the api. 
///// Both the name of the dish and its id can be used by changinf the url appropriately 

async function fetchMeals(url,value) {
    const response=await fetch(`${url+value}`);
    const meals=await response.json();
    return meals;
}


//// This function fetches data for a random meal when called

async function fetchRandomMeal(){
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const randomMeal = await response.json();
    return randomMeal;
}




///////  Here we fetch fetails for all the meals and shwo it in our correspondoing section in the html page.
///////  this function is called everytime a key is pressed using the event listener "onkeyup". This gives us updated results on every keypress.

function showMealCards(){
    var inputValue = document.getElementById("search-meal").value;    
    var html = ''; 
    var arr = JSON.parse(localStorage.getItem("favouriteMeals"));
    var url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    if (inputValue ==""){
        html+=``;
        
        document.getElementById('result-section').innerHTML = html;
    }
    else{
        var meals = fetchMeals(url,inputValue);   
        meals.then(data=>{
            if(data.meals){
                data.meals.forEach((e) => {    
                    var isfav=false;
                    ///// Here we check if the results from the search are present in the local array that stores our favorited meals
                    ///// For every search result, we check if the id of the search result  matches the id of any of the elements in local array.
                    ///// If a particular meal already exists in the array, ourr flag becomes true
                    ///// Using this flag we can add distinction to our search results to differentiate between meals that are favourited or not. 
                    ///// This helps in achieving a better user experience
                    for(var i=0; i<arr.length; i++){                                                                  
                        if(arr[i]==e.idMeal){                                           
                            isfav=true;
                        }
                    }
                    if(isfav){
                        html+=`
                        <div class="favmealCard" id="meal-card">
                        <div class="mealimg"><img src='${e.strMealThumb}'></div> 
                            <div class="mealDetails">
                                <h2>${e.strMeal}</h2>
                                <p>${e.strArea}</p>
                                <div class="card-btns">
                                    <button id="modalBtn" onclick="showDetails(${e.idMeal})">Read recipe</button>
                                    <button id="likeBtn" class="likeBtn" onclick="favListFromMain(${e.idMeal})"><i class="fa-solid fa-heart fa-2xl" style="color: #ff0000;"></i></button>
                                </div>
                            </div>
                        </div>
                        <dialog id="dialog" class="modal">
                        </dialog>
                        `;
                    }
                    else{
                        html+=`
                        <div class="mealCard" id="meal-card">
                            <div class="mealimg"><img src='${e.strMealThumb}'></div>                            
                            <div class="mealDetails">
                                <h2>${e.strMeal}</h2>
                                <p>${e.strArea}</p>
                                <div class="card-btns">
                                    <button id="modalBtn" onclick="showDetails(${e.idMeal})">Read recipe</button>
                                    <button id="likeBtn" class="likeBtn" onclick="favListFromMain(${e.idMeal})"><i class="fa-solid fa-heart fa-2xl" style="color: #ffffff;"></i></button>
                                </div>
                            </div>
                        </div>
                        <dialog id="dialog" class="modal">
                        </dialog>
                        `;
                    }                 
                        
                                              
                });
            
            }

            ///// if the inputed value yields no search results, we inform the user about the same.
            else{
                html+=`
                <div class="noMealFound">
                        
                <div class="img404">
                    <img src="assets/404.png" alt="">
                </div>
                <div class="text404">
                    No meals Found
                </div>
            </div>
                `;
            }
            document.getElementById('result-section').innerHTML = html;
        });
}
    

}


///// this function is invoked when the random button is clicked, in order to display a random meal for teh user
///// This function then calls for another function "showRandomCard" which adds the result to the appropriate section of our html file

function showRandomMeal(){
    resp = fetchRandomMeal();
    resp.then(data=>{
        showRandomCard(data.meals[0].idMeal);
});

console.log("Done");


}


//// This function generates the result for a random meal to user when the random button is chlicked
//// This function like the previous showMealCards function, uses the same logic to determine if the random meal generated is already a favorited meal by the user
//// Using that information we then create subtly different results that differentiates between a favourited meal and all others.
//// Here we also make a change to the function that adds or removes the meal to favourites

async function showRandomCard(id){
    html="";    
    var arr = JSON.parse(localStorage.getItem("favouriteMeals"));
    var url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";    
    await fetchMeals(url,id).then(data=>{
        data.meals.forEach((e) => {    
            var isfav=false;
            for(var i=0; i<arr.length; i++){
                if(arr[i]==e.idMeal){
                    isfav=true;
                }
            }
            if(isfav){
                html+=`
                <div class="favmealCard" id="meal-card">
                    <div class="mealimg"><img src='${e.strMealThumb}'></div> 
                    <div class="mealDetails">
                        <h2>${e.strMeal}</h2>
                        <p>${e.strArea}</p>
                        <div class="card-btns">
                            <button id="modalBtn" onclick="showDetails(${e.idMeal})">Read recipe</button>
                            <button id="likeBtn" class="likeBtn" onclick="favFromRandom(${e.idMeal})"><i class="fa-solid fa-heart fa-2xl" style="color: #ff0000;"></i></button>
                        </div>
                    </div>
                </div>
                <dialog id="dialog" class="modal">
                </dialog>
                `;
            }
            else{
                html+=`
                <div class="mealCard" id="meal-card">
                    
                <div class="mealimg"><img src='${e.strMealThumb}'></div> 
                    <div class="mealDetails">
                        <h2>${e.strMeal}</h2>
                        <p>${e.strArea}</p>
                        <div class="card-btns">
                            <button id="modalBtn" onclick="showDetails(${e.idMeal})">Read recipe</button>
                            <button id="likeBtn" class="likeBtn" onclick="favFromRandom(${e.idMeal})"><i class="fa-solid fa-heart fa-2xl" style="color: #ffffff;"></i></button>
                        </div>
                    </div>
                </div>
                <dialog id="dialog" class="modal">
                    
                </dialog>
                `;
            }
                
                
                                      
        });
        
        document.getElementById('result-section').innerHTML = html;
                
                
                                      
        });
    
}


///// This function is used to show details of any meal when the button for the same is clicked.
///// Here we add the desired data inside of a modal pop up

async function showDetails(id) {
    console.log(id);
    var url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    var html="";
    await fetchMeals(url,id).then(data=>{
        
        html += `
        <div class="top">
            <button onclick="closeModal();" class="x"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modalRecipe" id="modalRecipe">
          
            <div class="recipeBanner">
                <div class="recipeImg"><img src="${data.meals[0].strMealThumb}" alt=""></div>
                <div class="recipeTitle">
                    <div class="recipeName">${data.meals[0].strMeal}</div>
                    <div class="categoryAndCountry">
                        <div class="recipeCategory">${data.meals[0].strCategory}</div>
                        <div class="recipeCountry">${data.meals[0].strArea}</div>
                    </div>    
                    <div class="recipeActions">
                        <div><a href="${data.meals[0].strYoutube}" target="_blank"><i class="fa-brands fa-youtube fa-2xl"></i></a></div>
                    </div>        
                </div>
            </div>
            `;
    
    const ingredients = [];                                                                                      //// Here we are storing the ingredients and its measure in an array.
    for (var j= 1; j <= 20; j++) {                                                                               //// We can use that array later to show the ingredients and its 
      if (data.meals[0][`strIngredient${j}`]) {                                                                  //// corresponding measure.
        ingredients.push(
          `${data.meals[0][`strIngredient${j}`]} : <span> ${data.meals[0][`strMeasure${j}`]} </span>`             
        );
      } else {
        break;
      }
    }
    
    
    html+=`
    
        <div class="recipeDetails">
            <div class="ingredients">
                <h3>Ingredients</h3>
                <ul id = "inList">${ingredients.map((e) => `<li>${e}</li>`).join('')}</ul>
            </div>
            <div class="instructions">
                <h3>Inscructions</h3>
                <p>${data.meals[0].strInstructions}</p>
            </div>
        </div>    
    </div>
        `;
    });
    
    document.getElementById('dialog').innerHTML = html;
    dialog.showModal();
    document.body.classList.toggle("overflowhidden"); 
}

function closeModal(){
    document.body.classList.toggle("overflowhidden");     
    dialog.close();

}


///// This function shows our overlay that we are using as the favourites page
function showfavpage(){
    var wrapper = document.getElementById("favmeals");
    wrapper.classList.toggle("wrapper");
    document.getElementById("favPageBtn").classList.toggle("hide-btn");                                   //these switch the buttons
    document.getElementById("closeFavPageBtn").classList.toggle("hide-btn");                              //When overlay is opened or closed
    document.body.classList.toggle("overflowhidden");                                                     
    showFavMealList();
    showMealCards();
}



//// This function shows the meals favourited by the users inside of our favourites overlay
//// This is called Whenever the overlay is maximised

async function showFavMealList() {
    var arr=JSON.parse(localStorage.getItem("favouriteMeals"));
    var url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    var html="";
    
    if (arr.length==0) {
        html+=`
        
        <h2>Your Favourites</h2>
        <h3>you have ${arr.length} favourited meals</h3>`;
        document.getElementById("favtxt").innerHTML=html;
        html=`<img src="assets/404.png">`;        
        document.getElementById("favs").innerHTML=html;
    } else {
        html+=`
        <h2>Your Favourites</h2>
        <h3>you have ${arr.length} favourited meals</h3>`;
        document.getElementById("favtxt").innerHTML=html;
        html="";

            
        for (var index = 0; index < arr.length; index++) {
            await fetchMeals(url,arr[index]).then(data=>{
                
                html+=`
                
                <div class="favmealCardInside">
                    <div class="mealimg"><img src='${data.meals[0].strMealThumb}'></div> 
                        <div class="mealDetails">
                            <h2>${data.meals[0].strMeal}</h2>
                            <p>${data.meals[0].strArea}</p>
                            <div class="card-btns">
                                <button id="modalBtn" onclick="showDetails(${data.meals[0].idMeal})">Read recipe</button>
                                <button id="likeBtn" class="likeBtn" onclick="removeFromFavPage(${data.meals[0].idMeal})"><i class="fa-solid fa-heart fa-2xl" style="color: #ff0000;"></i></button>
                        </div>                    
                    </div>
                </div>
                `;
            });   
            
        }
        document.getElementById("favs").innerHTML=html;
        console.log(html)
    }
    
}




///// this function is being used to add or remove meals from the array in local storarage
function favManipulator(id){
    var arr=JSON.parse(localStorage.getItem("favouriteMeals"));
    var flag=false;
    for(var i =0; i<arr.length; i++){                          //// This determines if  the id of whatever meal the user chose exists in the local array or not
        if(id==arr[i]){
            flag=true;                                        //// If the meal does exist, the flag becomes true
        }
    }
    if (flag) {
        var number = arr.indexOf(id);                       //// if the meal already exists, we assume that the user wants to remove it from favourites
        arr.splice(number, 1);                              //// Hence we splice the particular meal from the array
    
        
    
    } else {
        arr.push(id);                                        //// if the meal is not present iun local arreay, it is added to it
        
    }
    
    localStorage.setItem("favouriteMeals",JSON.stringify(arr));           //// this stringifies the array again for it to be stored in local array

}




function favListFromMain(id){
    favManipulator(id);
    showMealCards();       // The showMealCards function is called again to update the card details to reflect the favourites if added or removed.
}







///// this function removes a selected meal from the favourites list on the local array
//// This function is only called from the favourite overlay that is showing all of users favourite meals.
//// This function will only remove meal from the array. 
//// Since the function is being called on the meals that are already favoutited they cannot be added to tthe array. They can only be removed. 

function removeFromFavPage(id){    
    favManipulator(id);
    showFavMealList();  // The showFavMealList function is called again to update the meals in the favouriotes list.

}


//// this function is fairly similar to the "favListFromMain" function. The only difference being this will be called the the user when they want to add or remove a random generated meal to the favourites list
function favFromRandom(id){
    favManipulator(id);
    showRandomCard(id);            //// This changes the card details for the random meal to reflect if it is added or removed from the favourites list
}








