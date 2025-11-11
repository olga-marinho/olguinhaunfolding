document.addEventListener('DOMContentLoaded', async () => {
    try {
        let pageName = window.location.pathname.split('/').pop(); 
        const validYears = ['index.html','2017.html','2020.html','2021.html','2022.html','2023.html','2024.html','2025.html','2030.html'];

        if (!validYears.includes(pageName)) {
            console.log('Page without JSON data, script stopped.');
            return;
        }

        let currentYear = 2017; 
        let match = pageName.match(/\d{4}/);
        if (match) currentYear = parseInt(match[0]);

        let response = await fetch('data.json');
        let data = await response.json();

        let filteredEntries = data.filter(entry => entry.year === currentYear);

        let main = document.querySelector('main');

        const htmlContent = filteredEntries.map(entry => {
            const numImgs = entry.img.length;

            const imagesHTML = entry.img.slice(0, 3).map((imageUrl, index) => {
                let imgClass = '';
                 if (numImgs === 1) imgClass = 'division1_1';
                else if (numImgs === 2) imgClass = index === 0 ? 'division2_1' : 'division2_2';
                else if (numImgs === 3) imgClass = `division3_${index + 1}`;

                return `<img class="dropdown-content ${imgClass}" src="${imageUrl}" alt="${entry.category}">`;
            }).join('');

            return `
                <a class="dropdown ${entry.category}">
                    <section class="grid">
                        <h2 class="month">${entry.month}</h2>
                        <h2 class="category">${entry.category}</h2>
                        <h2 class="description">${entry.description}</h2>
                        ${imagesHTML}
                    </section>
                </a>
            `;
        }).join('');

        main.innerHTML = filteredEntries.length > 0 
            ? htmlContent 
            : `<p>No data available for the year ${currentYear}</p>`;

        const dropdownElements = document.querySelectorAll(".dropdown");

          for (const dropdownElement of dropdownElements) {
              dropdownElement.addEventListener("click", clickEvent => {
              clickEvent.preventDefault();
              dropdownElement.classList.toggle("open");
          });
        }

    } catch (error) {
        console.error('Error loading data.json file:', error);
        document.querySelector('main').innerHTML = '<p>Error loading data</p>';
    }
});