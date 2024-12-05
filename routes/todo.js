// Function to show the Edit Todo form with pre-filled data
function editTodoForm(title, description, index) {
    // Display the form
    const editForm = document.getElementById("editForm");
    editForm.style.display = "block";

    // Fill the form with existing data
    document.getElementById("todoTitle").value = title;
    document.getElementById("todoDescription").value = description;
    document.getElementById("todoIndex").value = index;
}

// Function to hide the Edit Todo form
function hideEditForm() {
    const editForm = document.getElementById("editForm");
    editForm.style.display = "none";

    // Clear form fields
    document.getElementById("todoTitle").value = "";
    document.getElementById("todoDescription").value = "";
    document.getElementById("todoIndex").value = "";
}
