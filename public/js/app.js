document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#delete-form");

    if (form) {
        form.addEventListener("submit", (e) => {
            const res = confirm("Do you want to delete this listing?");
            if (!res) e.preventDefault();
        });
    }
});
