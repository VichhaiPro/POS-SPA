document.addEventListener('DOMContentLoaded', () => {
    // Service-related elements
    const serviceListDiv = document.getElementById('service-list');
    const addServiceForm = document.getElementById('add-service-form');
    const serviceNameInput = document.getElementById('service-name');
    const servicePriceInput = document.getElementById('service-price');
    const serviceDescriptionInput = document.getElementById('service-description');
    const addServiceSubmitButton = addServiceForm.querySelector('button[type="submit"]');

    // Order-related elements
    const orderItemsTableBody = document.getElementById('order-items');
    const orderTotalSpan = document.getElementById('order-total-price');
    const orderSubtotalSpan = document.getElementById('order-subtotal-price');
    const orderTotalDiscountSpan = document.getElementById('order-total-discount');
    const orderEmptyMessage = document.getElementById('order-empty-message');
    const customerNameInput = document.getElementById('customer-name');

    // Action buttons
    const printOrderButton = document.getElementById('print-order-button');
    const payButton = document.getElementById('pay-button');
    const saveJpgButton = document.getElementById('save-jpg-button');
    const clearReceiptButton = document.getElementById('clear-receipt-button');

    // ABA QR Payment elements
    const abaQrPaymentSection = document.getElementById('aba-qr-payment-section');
    const abaQrCodeImage = document.getElementById('aba-qr-code-image');
    const abaPaymentAmount = document.getElementById('aba-payment-amount');
    const confirmAbaPaymentButton = document.getElementById('confirm-aba-payment-button');
    const cancelAbaPaymentButton = document.getElementById('cancel-aba-payment-button');

    // App state
    let services = [];
    let order = [];
    let editingServiceIndex = -1;

    // Initial dummy services
    const initialServices = [
        // Existing Spa Services
        { name: 'ម៉ាស្សាប្រេង', price: 15.00, description: 'ការម៉ាស្សាប្រេងបន្ធូរអារម្មណ៍រយៈពេល ៦០ នាទី។' },
        { name: 'ម៉ាស្សាថ្ម', price: 25.00, description: 'ការម៉ាស្សាថ្មក្តៅ ដើម្បីបន្ធូរសាច់ដុំតឹង។' },
        { name: 'ម៉ាស្សាជើង', price: 10.00, description: 'ការម៉ាស្សាជើងរយៈពេល ៣០ នាទី ដើម្បីបំបាត់ភាពអស់កម្លាំង។' },
        { name: 'ម៉ាស្សាមុខ', price: 20.00, description: 'ការម៉ាស្សាមុខបន្ធូរអារម្មណ៍ ជួយស្បែកមុខភ្លឺថ្លា។' },
        { name: 'ស្ក្រាប់ដងខ្លួន', price: 35.00, description: 'ស្ក្រាប់ដងខ្លួន ដើម្បីស្បែកទន់រលោង។' },
        { name: 'រុំដងខ្លួន', price: 40.00, description: 'រុំដងខ្លួនដោយសារធាតុធម្មជាតិដើម្បីបំប៉នស្បែក។' },
        { name: 'ម៉ាស្សាខ្មែរ', price: 22.00, description: 'ម៉ាស្សាខ្មែរបុរាណជាមួយនឹងបច្ចេកទេសពិសេស។' },
        { name: 'សម្អាតមុខ', price: 18.00, description: 'សម្អាតមុខយ៉ាងជ្រៅ ដើម្បីឲ្យស្បែកមុខមានសុខភាពល្អ។' },
        { name: 'ថែរក្សាដៃជើង', price: 28.00, description: 'សេវាកម្មថែរក្សាដៃ និងជើង រួមទាំងការលាបពណ៌ក្រចក។' },
        { name: 'ដកសក់', price: 8.00, description: 'សេវាកម្មដកសក់តំបន់តូចៗ។' },

        // New Cosmetic Surgery Services
        { name: 'វះកាត់ត្របកភ្នែក', price: 1200.00, description: 'សេវាកម្មវះកាត់ត្របកភ្នែកពីរជាន់។' },
        { name: 'វះកាត់ច្រមុះ', price: 2500.00, description: 'សេវាកម្មវះកាត់ច្រមុះ។' },
        { name: 'វះកាត់បបូរមាត់', price: 800.00, description: 'សេវាកម្មវះកាត់បបូរមាត់។' },
        { name: 'បូមខ្លាញ់', price: 3000.00, description: 'សេវាកម្មបូមខ្លាញ់ក្បាលពោះ។' },
        { name: 'ยกกระชับใบหน้า', price: 3500.00, description: 'សេវាកម្មยกกระชับใบหน้า។' },
        { name: 'វះកាត់เสริมសុដន់', price: 5000.00, description: 'សេវាកម្មវះកាត់เสริมសុដន់។' },
        { name: 'ចាក់ហ្វីល័រ', price: 500.00, description: 'សេវាកម្មចាក់ហ្វីល័រកែចង្កា។' },
        { name: 'ចាក់បូថក្ស៍', price: 300.00, description: 'សេវាកម្មចាក់បូថក្ស៍បំបាត់ស្នាមជ្រីវជ្រួញ។' },
        { name: 'ឡាស៊ែរមុខថ្លា', price: 150.00, description: 'សេវាកម្មឡាស៊ែរមុខថ្លា។' },
        { name: 'ប្តូរសក់', price: 4000.00, description: 'សេវាកម្មប្តូរសក់។' },
    ];

    // --- DATA PERSISTENCE ---
    const loadServices = () => {
        const storedServices = localStorage.getItem('spaServices');
        services = storedServices ? JSON.parse(storedServices) : initialServices;
        renderServices();
    };

    const saveServices = () => {
        localStorage.setItem('spaServices', JSON.stringify(services));
    };

    const loadOrder = () => {
        const storedOrder = localStorage.getItem('spaOrder');
        if (storedOrder) {
            order = JSON.parse(storedOrder);
            renderOrder();
        }
    };

    const saveOrder = () => {
        localStorage.setItem('spaOrder', JSON.stringify(order));
    };

    // --- RENDERING ---
    const renderServices = () => {
        serviceListDiv.innerHTML = '';
        services.forEach((service, index) => {
            const serviceItem = document.createElement('div');
            serviceItem.classList.add('service-item');
            serviceItem.innerHTML = `
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <div class="price">${service.price.toFixed(2)}</div>
                <button class="btn add-to-order-btn" data-index="${index}">បន្ថែម</button>
                <button class="btn edit-service-btn" data-index="${index}">កែប្រែ</button>
            `;
            serviceListDiv.appendChild(serviceItem);
        });
        attachServiceButtonListeners();
    };

    const renderOrder = () => {
        orderItemsTableBody.innerHTML = '';
        if (order.length === 0) {
            orderEmptyMessage.style.display = 'block';
            orderItemsTableBody.parentElement.style.display = 'none';
        } else {
            orderEmptyMessage.style.display = 'none';
            orderItemsTableBody.parentElement.style.display = 'table';
            order.forEach((item, index) => {
                const row = document.createElement('tr');
                const itemTotal = item.price * item.quantity * (1 - item.discount / 100);
                row.innerHTML = `
                    <td data-label="សេវាកម្ម">${item.name}</td>
                    <td data-label="តម្លៃ">${item.price.toFixed(2)}</td>
                    <td data-label="បរិមាณ"><input type="number" min="1" value="${item.quantity}" class="item-quantity-input" data-index="${index}"></td>
                    <td data-label="បញ្ចុះតម្លៃ (%)"><input type="number" min="0" max="100" value="${item.discount}" class="item-discount-input" data-index="${index}"></td>
                    <td data-label="សរុប">${itemTotal.toFixed(2)}</td>
                    <td data-label="សកម្មភាព"><button class="btn remove-item-btn" data-name="${item.name}">លុប</button></td>
                `;
                orderItemsTableBody.appendChild(row);
            });
        }
        attachOrderModificationListeners();
        calculateOrderTotal();
    };

    // --- EVENT LISTENERS ---
    const attachServiceButtonListeners = () => {
        document.querySelectorAll('.add-to-order-btn').forEach(btn => {
            btn.addEventListener('click', e => addServiceToOrder(services[e.target.dataset.index]));
        });
        document.querySelectorAll('.edit-service-btn').forEach(btn => {
            btn.addEventListener('click', e => editService(e.target.dataset.index));
        });
    };

    const attachOrderModificationListeners = () => {
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', e => removeOrderItem(e.target.dataset.name));
        });
        document.querySelectorAll('.item-quantity-input, .item-discount-input').forEach(input => {
            input.addEventListener('change', e => {
                const index = e.target.dataset.index;
                const property = e.target.classList.contains('item-quantity-input') ? 'quantity' : 'discount';
                order[index][property] = parseFloat(e.target.value);
                saveOrder();
                renderOrder();
            });
        });
    };

    // --- CORE LOGIC ---
    const addServiceToOrder = (service) => {
        const existingItem = order.find(item => item.name === service.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            order.push({ ...service, quantity: 1, discount: 0 });
        }
        saveOrder();
        renderOrder();
    };

    const removeOrderItem = (serviceName) => {
        order = order.filter(item => item.name !== serviceName);
        saveOrder();
        renderOrder();
    };

    const editService = (index) => {
        const service = services[index];
        serviceNameInput.value = service.name;
        servicePriceInput.value = service.price;
        serviceDescriptionInput.value = service.description;
        addServiceSubmitButton.textContent = 'ปรับปรุงบริการ';
        editingServiceIndex = index;
    };

    addServiceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const serviceData = {
            name: serviceNameInput.value.trim(),
            price: parseFloat(servicePriceInput.value),
            description: serviceDescriptionInput.value.trim()
        };

        if (serviceData.name && !isNaN(serviceData.price) && serviceData.price > 0) {
            if (editingServiceIndex > -1) {
                services[editingServiceIndex] = serviceData;
            } else {
                services.push(serviceData);
            }
            saveServices();
            renderServices();
            addServiceForm.reset();
            addServiceSubmitButton.textContent = 'បន្ថែម​សេវាកម្ម';
            editingServiceIndex = -1;
        } else {
            alert('សូមបញ្ចូលឈ្មោះ និងតម្លៃសេវាកម្មអោយបានត្រឹមត្រូវ');
        }
    });

    const calculateOrderTotal = () => {
        let subtotal = 0, totalDiscount = 0;
        order.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            totalDiscount += itemTotal * (item.discount / 100);
        });
        const finalTotal = subtotal - totalDiscount;

        orderSubtotalSpan.textContent = subtotal.toFixed(2);
        orderTotalDiscountSpan.textContent = totalDiscount.toFixed(2);
        orderTotalSpan.textContent = finalTotal.toFixed(2);
    };

    const clearOrder = () => {
        order = [];
        customerNameInput.value = '';
        saveOrder();
        renderOrder();
    };
    clearReceiptButton.addEventListener('click', clearOrder);

    // --- ACTIONS & INTEGRATIONS ---

    // Payment
    payButton.addEventListener('click', () => {
        const total = orderTotalSpan.textContent;
        if (parseFloat(total) <= 0) return alert('មិនអាចដំណើរការការទូទាត់សម្រាប់ការបញ្ជាទិញដែលនៅទំនេរបានទេ');
        
        const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ABA_PAYMENT_${total}`;
        abaQrCodeImage.src = qrData;
        abaPaymentAmount.textContent = `${total}`;
        abaQrPaymentSection.style.display = 'block';
    });

    confirmAbaPaymentButton.addEventListener('click', () => {
        alert(`ការទូទាត់ចំនួន ${orderTotalSpan.textContent} បានបញ្ជាក់! (ក្លែងធ្វើ)`);
        abaQrPaymentSection.style.display = 'none';
        clearOrder();
    });

    cancelAbaPaymentButton.addEventListener('click', () => {
        abaQrPaymentSection.style.display = 'none';
    });

    // Printing and Saving
    const generateReceiptHTML = () => {
        const subtotal = parseFloat(orderSubtotalSpan.textContent).toFixed(2);
        const totalDiscount = parseFloat(orderTotalDiscountSpan.textContent).toFixed(2);
        const total = parseFloat(orderTotalSpan.textContent).toFixed(2);

        let itemsHtml = order.map(item => {
            let itemHtml = `
                <div class="item" style="margin-bottom: 5px;">
                    <span>${item.name} (${item.quantity}x)</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
            if (item.discount > 0) {
                const discountAmount = (item.price * item.quantity * (item.discount / 100)).toFixed(2);
                itemHtml += `
                    <div class="item" style="font-size: 0.9em; color: #555; padding-left: 15px; margin-bottom: 5px;">
                        <span>បញ្ចុះតម្លៃ (${item.discount}%):</span>
                        <span>-${discountAmount}</span>
                    </div>
                `;
            }
            return itemHtml;
        }).join('');

        return `
            <div class="pos-receipt">
                <h3>វិក្កយបត្រ NamSpa</h3>
                <p>អតិថិជន: ${customerNameInput.value || 'ភ្ញៀវទូទៅ'}</p>
                <hr>
                ${itemsHtml}
                <hr>
                <div class="total" style="margin-top: 10px;">
                    <span>សរុបរង:</span>
                    <span>${subtotal}</span>
                </div>
                <div class="total" style="margin-top: 5px;">
                    <span>បញ្ចុះតម្លៃសរុប:</span>
                    <span>${totalDiscount}</span>
                </div>
                <div class="total" style="margin-top: 5px; font-size: 1.2em;">
                    <span>សរុបរួម:</span>
                    <span>${total}</span>
                </div>
            </div>
        `;
    };

    printOrderButton.addEventListener('click', () => {
        const receiptContent = generateReceiptHTML();
        const printArea = document.getElementById('pos-receipt-print-area');
        printArea.innerHTML = receiptContent;
        
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printArea.innerHTML;
        window.print();
        document.body.innerHTML = originalContent;
        clearOrder(); // Clear everything after printing
        initialize(); // Re-initialize listeners
    });

    saveJpgButton.addEventListener('click', () => {
        const receiptContent = generateReceiptHTML();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = receiptContent;
        document.body.appendChild(tempDiv);
        
        html2canvas(tempDiv.querySelector('.pos-receipt')).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg');
            link.download = 'receipt.jpg';
            link.click();
            document.body.removeChild(tempDiv);
        });
    });

    // --- INITIALIZATION ---
    function initialize() {
        loadServices();
        loadOrder();
    }

    initialize();
});