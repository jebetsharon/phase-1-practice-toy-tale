document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  const toyURL = "http://localhost:3000/toys";

  // Fetch and display toys
  function fetchToys() {
      fetch(toyURL)
          .then(response => response.json())
          .then(toys => toys.forEach(renderToy));
  }

  function renderToy(toy) {
      const toyCard = document.createElement("div");
      toyCard.className = "card";
      toyCard.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
      `;
      toyCollection.appendChild(toyCard);

      // Add event listener for likes
      toyCard.querySelector(".like-btn").addEventListener("click", () => likeToy(toy));
  }

  // Handle adding a new toy
  toyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newToy = {
          name: e.target.name.value,
          image: e.target.image.value,
          likes: 0
      };

      fetch(toyURL, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
          },
          body: JSON.stringify(newToy)
      })
      .then(response => response.json())
      .then(renderToy);
  });

  // Handle liking a toy
  function likeToy(toy) {
      const newLikes = toy.likes + 1;

      fetch(`${toyURL}/${toy.id}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
          },
          body: JSON.stringify({ likes: newLikes })
      })
      .then(response => response.json())
      .then(updatedToy => {
          document.querySelector(`[data-id='${updatedToy.id}']`).previousElementSibling.textContent = `${updatedToy.likes} Likes`;
      });
  }

  fetchToys();
});
