document.addEventListener("DOMContentLoaded", () => {
  const dogBar = document.getElementById("dog-bar");
  const dogInfo = document.getElementById("dog-info");
  const filterBtn = document.getElementById("good-dog-filter");
  let allPups = [];
  let filterOn = false;

  // Fetch all pups and render to dog bar
  function fetchPups() {
    fetch("http://localhost:3000/pups")
      .then((res) => res.json())
      .then((pups) => {
        allPups = pups;
        renderPups();
      });
  }

  // Render pups to dog bar (filtered if needed)
  function renderPups() {
    dogBar.innerHTML = "";
    const pupsToShow = filterOn
      ? allPups.filter((pup) => pup.isGoodDog)
      : allPups;

    pupsToShow.forEach((pup) => {
      const pupSpan = document.createElement("span");
      pupSpan.textContent = pup.name;
      pupSpan.addEventListener("click", () => showPupInfo(pup));
      dogBar.appendChild(pupSpan);
    });
  }

  // Show detailed pup info
  function showPupInfo(pup) {
    dogInfo.innerHTML = `
      <img src="${pup.image}">
      <h2>${pup.name}</h2>
      <button data-id="${pup.id}">${
      pup.isGoodDog ? "Good" : "Bad"
    } Dog!</button>
    `;

    const goodDogBtn = dogInfo.querySelector("button");
    goodDogBtn.addEventListener("click", () => toggleGoodDog(pup));
  }

  // Toggle good/bad dog status
  function toggleGoodDog(pup) {
    const newStatus = !pup.isGoodDog;

    fetch(`http://localhost:3000/pups/${pup.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isGoodDog: newStatus }),
    })
      .then((res) => res.json())
      .then((updatedPup) => {
        // Update in our local array
        const pupIndex = allPups.findIndex((p) => p.id === updatedPup.id);
        allPups[pupIndex] = updatedPup;

        // Update the button text
        const btn = dogInfo.querySelector("button");
        btn.textContent = updatedPup.isGoodDog ? "Good Dog!" : "Bad Dog!";

        // Re-render if filtering is on
        if (filterOn) renderPups();
      });
  }

  // Toggle good dog filter
  filterBtn.addEventListener("click", () => {
    filterOn = !filterOn;
    filterBtn.textContent = `Filter good dogs: ${filterOn ? "ON" : "OFF"}`;
    renderPups();
  });

  // Initialize
  fetchPups();
});
