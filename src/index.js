console.log("uncomment lines 3-end for the ES5 syntax version")




let addToy = false;

const addBtn = document.querySelector("#new-toy-btn");

const formContainer = document.querySelector(".container");

const toyForm = document.querySelector(".add-toy-form");

const toysEndpoint = `http://localhost:3000/toys`;

const toyContainer = document.getElementById("toy-collection");



function renderIndividualToy(toy){

  let likeValue = `${toy.likes}`;

  let ternary = likeValue === "1" ? "Like" : "Likes";
 
  toyContainer.innerHTML += `<div class="card" data-id="${toy.id}">
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${likeValue} ${ternary}</p>
    <button class="like-btn">Like <3</button>
  </div>`;
}


function renderToys(toysArray){

  toyContainer.innerHTML = ``;

  toysArray.forEach(function(toy){

    renderIndividualToy(toy);
  })
}


function fetchToys(){
  fetch(toysEndpoint)
    .then(function(resp){
      return resp.json()
    })
    .then(function(toysArray){
   
      renderToys(toysArray);
    })
    .catch(function(err){
   
      console.log(err);
    })
}


function handlePostToy(e){

  e.preventDefault();

  const formData = {
    name: e.target["name"].value,
    image: e.target["image"].value,
    likes: 0
  }

  e.target.reset();



  const reqObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  }

  fetch(toysEndpoint, reqObj)
    .then(function(resp){
      return resp.json();
    })
    .then(function(individualToy){
   
      renderIndividualToy(individualToy);
    })
    .catch(function(err){
      console.log(err);
    })
}


function handleLikeButton(e){

  const toyId = e.target.parentElement.dataset.id;

  const likeCount = parseInt(e.target.parentElement.children[2].innerText.split(" ")[0]);

  const likeData = {
    likes: likeCount + 1
  }


  const reqObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(likeData)
  }

 
  fetch(toysEndpoint + `/${toyId}`, reqObj)
    .then(function(resp){
      return resp.json();
    })
    .then(function(data){
      console.log(data);
     
      fetchToys();
    })
    .catch(function(err){
      console.log(err);
    })

}






fetchToys();




addBtn.addEventListener("click", function(){

  addToy = !addToy;

  addToy ? formContainer.style.display = "block" : formContainer.style.display = "none";
});

toyForm.addEventListener("submit", handlePostToy);

document.addEventListener("click", function(e){
  if (e.target.className === "like-btn") {
    handleLikeButton(e);
  }
});
