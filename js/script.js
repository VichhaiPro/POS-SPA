document.addEventListener('DOMContentLoaded', () => {
    const serviceListDiv = document.getElementById('service-list');
    const addServiceForm = document.getElementById('add-service-form');
    const serviceNameInput = document.getElementById('service-name');
    const servicePriceInput = document.getElementById('service-price');
    const serviceDescriptionInput = document.getElementById('service-description');
    const printButton = document.getElementById('print-button');

    let services = [];

    // Function to load services from Local Storage
    const loadServices = () => {
        const storedServices = localStorage.getItem('spaServices');
        if (storedServices) {
            services = JSON.parse(storedServices);
            renderServices();
        } else {
            // Add some initial dummy services if none are stored
            services = [
                { name: 'ម៉ាស្សាប្រេង', price: 15.00, description: 'ការម៉ាស្សាប្រេងបន្ធូរអារម្មណ៍រយៈពេល ៦០ នាទី។' },
                { name: 'ម៉ាស្សាថ្ម', price: 25.00, description: 'ការម៉ាស្សាថ្មក្តៅ ដើម្បីបន្ធូរសាច់ដុំតឹង។' },
                { name: 'ម៉ាស្សាជើង', price: 10.00, description: 'ការម៉ាស្សាជើងរយៈពេល ៣០ នាទី ដើម្បីបំបាត់ភាពអស់កម្លាំង។' }
            ];
            saveServices();
            renderServices();
        }
    };

    // Function to save services to Local Storage
    const saveServices = () => {
        localStorage.setItem('spaServices', JSON.stringify(services));
    };

    // Function to render services
    const renderServices = () => {
        serviceListDiv.innerHTML = ''; // Clear current list
        services.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.classList.add('service-item');
            serviceItem.innerHTML = `
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <p class="price">តម្លៃ: ${service.price.toFixed(2)} ៛</p>
            `;
            serviceListDiv.appendChild(serviceItem);
        });
    };

    // Event listener for adding a new service
    addServiceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = serviceNameInput.value.trim();
        const price = parseFloat(servicePriceInput.value);
        const description = serviceDescriptionInput.value.trim();

        if (name && !isNaN(price) && price > 0) {
            services.push({ name, price, description });
            saveServices();
            renderServices();
            addServiceForm.reset(); // Clear the form
        } else {
            alert('សូមបញ្ចូលឈ្មោះសេវាកម្ម និងតម្លៃត្រឹមត្រូវ។');
        }
    });

    // Event listener for print button
    printButton.addEventListener('click', () => {
        window.print();
    });

    // Initial load of services
    loadServices();
});
