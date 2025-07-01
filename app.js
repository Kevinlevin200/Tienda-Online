// Espera a que todo el contenido del DOM esté completamente cargado antes de ejecutar el código
// Esto asegura que todos los elementos HTML estén disponibles para ser manipulados
document.addEventListener('DOMContentLoaded', () => {

    // --- GESTIÓN DE ESTADO ---
    // Variables globales que mantienen el estado de la aplicación en memoria
    let allProducts = []; // Array que almacena todos los productos obtenidos de la API
    let cart = []; // Array que representa el carrito de compras actual del usuario
  
    // --- ELEMENTOS DEL DOM ---
    // Referencias a elementos HTML que necesitamos manipular frecuentemente
    // Obtener estas referencias una sola vez mejora el rendimiento
    const productGrid = document.getElementById('product-grid'); // Contenedor donde se muestran las tarjetas de productos
    const categoryFilter = document.getElementById('category-filter'); // Dropdown para filtrar por categoría
    const sortFilter = document.getElementById('sort-filter'); // Dropdown para ordenar productos
    const searchInput = document.getElementById('search-input'); // Campo de búsqueda de productos
    const loader = document.getElementById('loader'); // Indicador de carga mientras se obtienen datos
    
    // Elementos relacionados con el carrito de compras
    const cartToggleBtn = document.getElementById('cart-toggle-btn'); // Botón para abrir el carrito
    const cartCloseBtn = document.getElementById('cart-close-btn'); // Botón para cerrar el carrito
    const cartSidebar = document.getElementById('cart-sidebar'); // Panel lateral del carrito
    const cartOverlay = document.getElementById('cart-overlay'); // Fondo oscuro cuando el carrito está abierto
    const cartItemsContainer = document.getElementById('cart-items'); // Contenedor de los artículos en el carrito
    const cartTotalPriceEl = document.getElementById('cart-total-price'); // Elemento que muestra el precio total
    const cartCounter = document.getElementById('cart-counter'); // Contador de artículos en el botón del carrito
    const checkoutBtn = document.getElementById('checkout-btn'); // Botón para finalizar la compra
  
    // --- MANEJO DE API Y DATOS ---
  
    /**
     * Obtiene los productos desde la API y inicializa la tienda.
     * Incluye manejo robusto de errores para casos como:
     * - Falta de conexión a internet
     * - Errores del servidor (404, 500, etc.)
     * - Respuestas malformadas
     */
    async function fetchProducts() {
        showLoader(true); // Muestra el indicador de carga
        try {
            // Realiza una petición HTTP a la API de productos falsos
            const response = await fetch('https://fakestoreapi.com/products');
            
            // Verifica si la respuesta HTTP fue exitosa (códigos 200-299)
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            // Convierte la respuesta JSON en un array de objetos JavaScript
            allProducts = await response.json();
            
            // Renderiza todos los productos en la página
            renderProducts(allProducts);
            
            // Popula el filtro de categorías con las categorías únicas encontradas
            populateCategoryFilter();
        } catch (error) {
            // Si ocurre cualquier error, lo registra en la consola para depuración
            console.error("Failed to fetch products:", error);
            
            // Muestra un mensaje de error amigable al usuario
            productGrid.innerHTML = `<p class="error-message">Oops! No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.</p>`;
        } finally {
            // Este bloque siempre se ejecuta, sin importar si hubo éxito o error
            showLoader(false); // Oculta el indicador de carga
        }
    }
  
    /**
     * Carga el carrito desde localStorage (almacenamiento local del navegador).
     * Incluye manejo robusto de errores para datos corruptos o malformados.
     * localStorage persiste los datos entre sesiones del navegador.
     */
    function loadCart() {
        try {
            // Intenta obtener los datos del carrito guardados previamente
            const savedCart = localStorage.getItem('shoppingCart');
            
            if (savedCart) {
                // Convierte la cadena JSON de vuelta a un objeto JavaScript
                cart = JSON.parse(savedCart);
                
                // Validación básica: verifica que los datos sean un array válido
                if (!Array.isArray(cart)) {
                    throw new Error("Cart data is not an array");
                }
            }
        } catch (error) {
            // Si los datos están corruptos o hay algún problema
            console.error("Failed to load or parse cart from localStorage:", error);
            cart = []; // Reinicia el carrito vacío para prevenir errores de la aplicación
            localStorage.removeItem('shoppingCart'); // Elimina los datos corruptos
        }
        updateCartUI(); // Actualiza la interfaz del carrito
    }
  
    /**
     * Guarda el estado actual del carrito en localStorage.
     * Esto permite que el carrito persista entre recargas de página y sesiones.
     */
    function saveCart() {
        try {
            // Convierte el array del carrito a una cadena JSON y la guarda
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
        } catch (error) {
            // Puede fallar si el almacenamiento está lleno o no está disponible
            console.error("Could not save cart to localStorage:", error);
            alert("Hubo un error al guardar tu carrito. Es posible que el almacenamiento de tu navegador esté lleno.");
        }
    }
  
    // --- RENDERIZADO ---
  
    /**
     * Renderiza los productos en el DOM creando tarjetas HTML dinámicamente.
     * @param {Array} products - El array de productos a renderizar.
     * Cada producto debe tener: id, title, price, image, category
     */
    function renderProducts(products) {
        productGrid.innerHTML = ''; // Limpia el contenedor de productos
        
        // Si no hay productos que mostrar pero sí hay productos cargados (filtros aplicados)
        if (products.length === 0 && allProducts.length > 0) {
            productGrid.innerHTML = `<p class="error-message">No se encontraron productos que coincidan con tu búsqueda.</p>`;
            return;
        }
        
        // Itera sobre cada producto y crea su tarjeta HTML
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            // Crea el HTML interno de la tarjeta usando template literals
            // toFixed(2) asegura que el precio tenga exactamente 2 decimales
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">Agregar al Carrito</button>
                </div>
            `;
            
            // Añade la tarjeta al contenedor de productos en el DOM
            productGrid.appendChild(productCard);
        });
    }
  
    /**
     * Popula el dropdown de filtro de categorías con las categorías únicas de los productos.
     * Usa Set para eliminar duplicados automáticamente.
     */
    function populateCategoryFilter() {
        // Extrae todas las categorías y elimina duplicados usando Set
        const categories = [...new Set(allProducts.map(p => p.category))];
        
        // Crea una opción para cada categoría única
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            // Capitaliza la primera letra de la categoría para mejor presentación
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        });
    }
  
    /**
     * Muestra u oculta el indicador de carga.
     * @param {boolean} show - true para mostrar, false para ocultar
     */
    function showLoader(show) {
        loader.style.display = show ? 'block' : 'none';
    }
  
    // --- LÓGICA DEL CARRITO ---
  
    /**
     * Añade un producto al carrito o incrementa su cantidad si ya existe.
     * @param {number} productId - El ID del producto a añadir.
     * Implementa lógica para evitar duplicados y manejar cantidades.
     */
    function addToCart(productId) {
        // Busca el producto completo en el array de todos los productos
        const productToAdd = allProducts.find(p => p.id === productId);
        if (!productToAdd) return; // Si no se encuentra el producto, sale de la función
  
        // Verifica si el producto ya existe en el carrito
        const existingItem = cart.find(item => item.id === productId);
  
        if (existingItem) {
            // Si ya existe, incrementa la cantidad
            existingItem.quantity++;
        } else {
            // Si es nuevo, añade el producto con cantidad 1
            cart.push({
                id: productToAdd.id,
                title: productToAdd.title,
                price: productToAdd.price,
                image: productToAdd.image,
                quantity: 1,
            });
        }
        
        saveCart(); // Persiste el carrito en localStorage
        updateCartUI(); // Actualiza la interfaz del carrito
        openCart(); // Abre automáticamente el carrito para mostrar el producto añadido
    }
  
    /**
     * Elimina completamente un producto del carrito.
     * @param {number} productId - El ID del producto a eliminar.
     * No reduce cantidad, elimina el producto por completo.
     */
    function removeFromCart(productId) {
        // Filtra el carrito manteniendo solo los productos que NO coinciden con el ID
        cart = cart.filter(item => item.id !== productId);
        saveCart(); // Guarda los cambios
        updateCartUI(); // Actualiza la interfaz
    }

    /**
     * Actualiza la cantidad de un producto en el carrito.
     * @param {number} productId - El ID del producto a actualizar.
     * @param {number} quantity - La nueva cantidad deseada.
     * Asegura que la cantidad no sea menor a 1.
     */
    function updateQuantity(productId, quantity) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            quantity = parseInt(quantity);
            if (quantity < 1) quantity = 1; // Prevent quantities less than 1
            cartItem.quantity = quantity;
            saveCart(); // Guarda los cambios en localStorage
            updateCartUI(); // Actualiza la interfaz
        }
    }
  
    /**
     * Actualiza toda la interfaz de usuario del carrito (sidebar, total, contador).
     * Esta función se llama cada vez que el carrito cambia.
     */
    function updateCartUI() {
        cartItemsContainer.innerHTML = ''; // Limpia el contenedor de artículos
        
        if (cart.length === 0) {
            // Si el carrito está vacío, muestra un mensaje
            cartItemsContainer.innerHTML = '<p class="cart-empty-message">Tu carrito está vacío.</p>';
        } else {
            // Para cada artículo en el carrito, crea su elemento HTML
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-info">
                        <p class="cart-item-title">${item.title}</p>
                        <input type="number" value="${item.quantity}" min="1" class="w-16 p-1 border rounded cart-item-quantity" data-id="${item.id}">
                        <p class="cart-item-price">${item.quantity} x $${item.price.toFixed(2)}</p>
                    </div>
                    <button class="remove-from-cart-btn" data-id="${item.id}">×</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }
  
        // Calcula el precio total sumando precio × cantidad de cada artículo
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotalPriceEl.textContent = `$${total.toFixed(2)}`;
        
        // Calcula el número total de artículos (suma de todas las cantidades)
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
        // Muestra el contador solo si hay artículos, lo oculta si está vacío
        cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    /**
     * Simula el proceso de checkout (finalización de compra).
     * En una aplicación real, esto se conectaría con un sistema de pagos.
     */
    function handleCheckout() {
        if (cart.length === 0) {
            alert("Tu carrito está vacío. Añade productos antes de finalizar la compra.");
            return;
        }
        
        // Calcula el total final
        const totalFinal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        // Muestra un mensaje de confirmación simulado
        alert(`¡Gracias por tu compra!\n\nTotal pagado: $${totalFinal.toFixed(2)}\n\nTu pedido ha sido procesado.`);
        
        // Limpia el carrito después de la "compra"
        cart = [];
        saveCart(); // Guarda el carrito vacío
        updateCartUI(); // Actualiza la interfaz
        closeCart(); // Cierra el panel del carrito
    }
    
    /**
     * Abre el panel lateral del carrito añadiendo clases CSS.
     * Las clases CSS 'open' contienen las animaciones y estilos para mostrar el carrito.
     */
    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('open'); // Muestra el fondo oscuro
    }
    
    /**
     * Cierra el panel lateral del carrito removiendo clases CSS.
     */
    function closeCart() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
    }
  
    // --- FILTRADO, ORDENAMIENTO Y BÚSQUEDA ---
  
    /**
     * Aplica todos los filtros activos, ordenamiento y búsqueda a la lista de productos.
     * Esta función se ejecuta cada vez que el usuario cambia algún filtro.
     * Procesa los datos en este orden: filtros → búsqueda → ordenamiento
     */
    function applyFiltersAndSort() {
        // Crea una copia del array original para no modificarlo
        let filteredProducts = [...allProducts];
  
        // 1. Filtrar por Categoría
        const selectedCategory = categoryFilter.value;
        if (selectedCategory !== 'all') {
            // Mantiene solo los productos de la categoría seleccionada
            filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
        }
  
        // 2. Filtrar por Término de Búsqueda
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            // Busca el término tanto en el título como en la descripción
            filteredProducts = filteredProducts.filter(p => 
                p.title.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
        }
  
        // 3. Ordenar según la opción seleccionada
        const sortValue = sortFilter.value;
        switch (sortValue) {
            case 'price-asc':
                // Ordena por precio ascendente (menor a mayor)
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                // Ordena por precio descendente (mayor a menor)
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                // Ordena alfabéticamente por nombre (A-Z)
                filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                // Ordena alfabéticamente por nombre (Z-A)
                filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }
  
        // Renderiza los productos filtrados y ordenados
        renderProducts(filteredProducts);
    }
  
    // --- ESCUCHADORES DE EVENTOS ---
    // Conectan las acciones del usuario con las funciones correspondientes
  
    // Filtros y Búsqueda - se ejecutan cuando el usuario cambia estos elementos
    categoryFilter.addEventListener('change', applyFiltersAndSort);
    sortFilter.addEventListener('change', applyFiltersAndSort);
    searchInput.addEventListener('input', applyFiltersAndSort); // 'input' se dispara mientras el usuario escribe
  
    // Añadir al carrito - usa delegación de eventos para mejor rendimiento
    // En lugar de añadir un listener a cada botón, escucha clicks en el contenedor padre
    productGrid.addEventListener('click', (e) => {
        // Verifica si el elemento clickeado es un botón de "añadir al carrito"
        if (e.target.classList.contains('add-to-cart-btn')) {
            // Obtiene el ID del producto desde el atributo data-id
            const productId = parseInt(e.target.dataset.id, 10);
            addToCart(productId);
        }
    });
  
    // Eliminar del carrito y actualizar cantidades - también usa delegación de eventos
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const productId = parseInt(e.target.dataset.id, 10);
            removeFromCart(productId);
        }
    });

    // Actualizar cantidad del carrito
    cartItemsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('cart-item-quantity')) {
            const productId = parseInt(e.target.dataset.id, 10);
            const quantity = e.target.value;
            updateQuantity(productId, quantity);
        }
    });
    
    // Controles de la interfaz del carrito
    cartToggleBtn.addEventListener('click', openCart); // Botón para abrir carrito
    cartCloseBtn.addEventListener('click', closeCart); // Botón X para cerrar carrito
    cartOverlay.addEventListener('click', closeCart); // Click en el fondo oscuro cierra el carrito
  
    // Proceso de checkout
    checkoutBtn.addEventListener('click', handleCheckout);
  
    // --- INICIALIZACIÓN ---
    // Estas funciones se ejecutan cuando la página termina de cargar
    loadCart(); // Carga el carrito guardado del usuario (si existe)
    fetchProducts(); // Obtiene y muestra los productos de la API
});
