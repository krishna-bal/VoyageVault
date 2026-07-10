document.addEventListener("DOMContentLoaded", () => {
    const filters = document.querySelectorAll(".filter");

    const updateActiveFilter = () => {
        filters.forEach((item) => item.classList.remove("active-filter"));

        const currentPath = decodeURIComponent(window.location.pathname);
        const match = currentPath.match(/\/listings\/filter\/([^/?]+)/);
        const activeCategory = match ? match[1] : null;

        if (!activeCategory) return;

        const activeFilter = Array.from(filters).find(
            (filter) => filter.dataset.category ===
             activeCategory
        );

        if (activeFilter) {
            activeFilter.classList.add("active-filter");
        }
    };

    filters.forEach((filter) => {
        filter.addEventListener("click", () => {
            filters.forEach((item) => item.classList.remove("active-filter"));
            filter.classList.add("active-filter");
        });
    });

    updateActiveFilter();
    window.addEventListener("pageshow", updateActiveFilter);
    
    let taxSwitch = document.getElementById("switchCheckDefault")
    let tax_info_all = document.querySelectorAll(".tax_info")
    taxSwitch.addEventListener("click", ()=>{
            for (let tax_info of tax_info_all){ 
                console.log(tax_info.style.display)
            if(tax_info.style.display === "inline"){
                tax_info.style.display = "none";
            }
            else{
                tax_info.style.display = "inline";
            }
        }
    })
});
    