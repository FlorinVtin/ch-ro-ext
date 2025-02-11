document.getElementById("arrowBtn").addEventListener("click", function() {
    let inputForm = document.getElementById("inputForm");
    let arrow = document.querySelectorAll(".arrow");
    if (inputForm.style.display === "none" || inputForm.style.display === "") {
        inputForm.style.display = "block";
        // arrow.classList.remove("rotate");
        arrow.classList.toggle("rotate")
    } else {
        inputForm.style.display = "none";
        arrow.classList.toggle("rotate")

        // arrow.classList.add("rotate");
        // arrow.classList.remove("rotate");

    }
  });