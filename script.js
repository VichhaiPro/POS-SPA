document.addEventListener('DOMContentLoaded', () => {
    const serviceListDiv = document.getElementById('service-list');
    const addServiceForm = document.getElementById('add-service-form');
    const serviceNameInput = document.getElementById('service-name');
    const servicePriceInput = document.getElementById('service-price');
    const serviceDescriptionInput = document.getElementById('service-description');
    const printButton = document.getElementById('print-button');

    const orderItemsTableBody = document.getElementById('order-items');
    const orderTotalSpan = document.getElementById('order-total-price');
    const orderEmptyMessage = document.getElementById('order-empty-message');

    let services = [];
    let order = [];

    // Initial dummy services (10 services in USD)
    const initialServices = [
        { name: 'ម៉ាស្សាប្រេង', price: 15.00, description: 'ការម៉ាស្សាប្រេងបន្ធូរអារម្មណ៍រយៈពេល ៦០ នាទី។' },
        { name: 'ម៉ាស្សាថ្ម', price: 25.00, description: 'ការម៉ាស្សាថ្មក្តៅ ដើម្បីបន្ធូរសាច់ដុំតឹង។' },
        { name: 'ម៉ាស្សាជើង', price: 10.00, description: 'ការម៉ាស្សាជើងរយៈពេល ៣០ នាទី ដើម្បីបំបាត់ភាពអស់កម្លាំង។' },
        { name: 'ម៉ាស្សាស្មា', price: 12.00, description: 'ម៉ាស្សាស្មា និងក្បាលរយៈពេល ៣០ នាទី។' },
        { name: 'ម៉ាស្សាមុខ', price: 20.00, description: 'ការម៉ាស្សាមុខបន្ធូរអារម្មណ៍ ជួយស្បែកមុខភ្លឺថ្លា។' },
        { name: 'ម៉ាស្សាខ្លួន', price: 30.00, description: 'ការម៉ាស្សាខ្លួនពេញមួយម៉ោង ដើម្បីបំបាត់ភាពតានតឹង។' },
        { name: 'ម៉ាស្សាខ្មែរ', price: 22.00, description: 'ម៉ាស្សាខ្មែរបុរាណជាមួយនឹងបច្ចេកទេសពិសេស។' },
        { name: 'សម្អាតមុខ', price: 18.00, description: 'សម្អាតមុខយ៉ាងជ្រៅ ដើម្បីឲ្យស្បែកមុខមានសុខភាពល្អ។' },
        { name: 'ថែរក្សាដៃជើង', price: 28.00, description: 'សេវាកម្មថែរក្សាដៃ និងជើង រួមទាំងការលាបពណ៌ក្រចក។' },
        { name: 'ដកសក់', price: 8.00, description: 'សេវាកម្មដកសក់តំបន់តូចៗ។' }
    ];

    // Function to load services from Local Storage
    const loadServices = () => {
        const storedServices = localStorage.getItem('spaServices');
        if (storedServices) {
            services = JSON.parse(storedServices);
        } else {
            services = initialServices;
            saveServices();
        }
        renderServices();
    };

    // Function to save services to Local Storage
    const saveServices = () => {
        localStorage.setItem('spaServices', JSON.stringify(services));
    };

    // Function to load order from Local Storage
    const loadOrder = () => {
        const storedOrder = localStorage.getItem('spaOrder');
        if (storedOrder) {
            order = JSON.parse(storedOrder);
            renderOrder();
        }
    };

    // Function to save order to Local Storage
    const saveOrder = () => {
        localStorage.setItem('spaOrder', JSON.stringify(order));
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
                <p class="price">តម្លៃ: ${service.price.toFixed(2)} USD</p>
                <button class="btn add-to-order-btn" data-name="${service.name}" data-price="${service.price}" data-description="${service.description}">បន្ថែមទៅបញ្ជី</button>
            `;
            serviceListDiv.appendChild(serviceItem);
        });
        attachAddToOrderListeners();
    };

    // Function to attach event listeners to "Add to Order" buttons
    const attachAddToOrderListeners = () => {
        document.querySelectorAll('.add-to-order-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                const price = parseFloat(e.target.dataset.price);
                const description = e.target.dataset.description;
                addServiceToOrder({ name, price, description });
            });
        });
    };

    // Function to add a service to the order
    const addServiceToOrder = (serviceToAdd) => {
        const existingItemIndex = order.findIndex(item => item.name === serviceToAdd.name);

        if (existingItemIndex > -1) {
            order[existingItemIndex].quantity += 1;
        } else {
            order.push({ ...serviceToAdd, quantity: 1 });
        }
        saveOrder();
        renderOrder();
    };

    // Function to remove a service from the order
    const removeOrderItem = (serviceName) => {
        order = order.filter(item => item.name !== serviceName);
        saveOrder();
        renderOrder();
    };

    // Function to render the order list
    const renderOrder = () => {
        orderItemsTableBody.innerHTML = ''; // Clear current order list
        if (order.length === 0) {
            orderEmptyMessage.style.display = 'block';
            orderItemsTableBody.style.display = 'none';
        } else {
            orderEmptyMessage.style.display = 'none';
            orderItemsTableBody.style.display = 'table-row-group';
            order.forEach(item => {
                const row = document.createElement('tr');
                const itemTotal = item.price * item.quantity;
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>${itemTotal.toFixed(2)}</td>
                    <td><button class="btn remove-item-btn" data-name="${item.name}">លុបចេញ</button></td>
                `;
                orderItemsTableBody.appendChild(row);
            });
            attachRemoveItemListeners();
        }
        calculateOrderTotal();
    };

    // Function to attach event listeners to "Remove Item" buttons
    const attachRemoveItemListeners = () => {
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                removeOrderItem(name);
            });
        });
    };

    // Function to calculate and display the total order price
    const calculateOrderTotal = () => {
        const total = order.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        orderTotalSpan.textContent = total.toFixed(2);
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

    // Initial loads
    loadServices();
    loadOrder();
});