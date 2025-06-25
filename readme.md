# Tienda Online 🛒

Una aplicación web moderna de e-commerce construida con JavaScript vanilla, HTML5 y CSS3. Esta tienda online proporciona una experiencia de compra completa con carrito de compras persistente, filtros avanzados y una interfaz de usuario responsiva.

## 🚀 Características

### Funcionalidades Principales
- **Catálogo de Productos**: Muestra productos obtenidos de la FakeStore API
- **Carrito de Compras**: Sistema completo de carrito con persistencia en localStorage
- **Filtros y Búsqueda**: Filtrado por categoría, ordenamiento y búsqueda por texto
- **Interfaz Responsiva**: Diseño adaptable para dispositivos móviles y desktop
- **Experiencia de Usuario**: Animaciones suaves y feedback visual

### Características Técnicas
- **Sin Dependencias**: Construido con JavaScript vanilla puro
- **Persistencia de Datos**: El carrito se mantiene entre sesiones del navegador
- **Manejo Robusto de Errores**: Validación y recuperación ante fallos de red
- **Rendimiento Optimizado**: Delegación de eventos y renderizado eficiente
- **Código Limpio**: Ampliamente documentado con comentarios explicativos

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con variables CSS y Flexbox/Grid
- **JavaScript ES6+**: Funciones asíncronas, destructuring, y módulos
- **FakeStore API**: Fuente de datos para productos de demostración
- **localStorage**: Persistencia del carrito de compras

## 📁 Estructura del Proyecto

```
tienda-online/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS con variables y responsive design
├── app.js             # Lógica JavaScript de la aplicación
└── README.md          # Documentación del proyecto
```

## 🎯 Funcionalidades Detalladas

### Gestión de Productos
- Obtención de productos desde la FakeStore API
- Renderizado dinámico de tarjetas de productos
- Indicador de carga durante la obtención de datos
- Manejo de errores de conexión

### Sistema de Carrito
- Añadir/eliminar productos del carrito
- Persistencia automática en localStorage
- Contador visual de productos en el carrito
- Cálculo automático de totales
- Proceso de checkout simulado

### Filtros y Búsqueda
- **Filtro por Categoría**: Dropdown con todas las categorías disponibles
- **Ordenamiento**: Por precio (ascendente/descendente) y nombre (A-Z/Z-A)
- **Búsqueda**: Por nombre o descripción del producto
- **Combinación**: Todos los filtros trabajan en conjunto

### Interfaz de Usuario
- **Header Fijo**: Con logo, barra de búsqueda y botón del carrito
- **Sidebar del Carrito**: Panel deslizante con overlay
- **Diseño Responsivo**: Adaptación automática a diferentes tamaños de pantalla
- **Animaciones**: Efectos hover y transiciones suaves

## 🚀 Instalación y Uso

### Prerrequisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet para obtener productos de la API

### Instrucciones de Instalación

1. **Clona o descarga el proyecto**:
   ```bash
   git clone [url-del-repositorio]
   cd tienda-online
   ```

2. **Abre el proyecto**:
   - Abre `index.html` directamente en tu navegador, o
   - Usa un servidor local como Live Server en VS Code

3. **¡Listo para usar!**:
   - Los productos se cargarán automáticamente
   - Navega, filtra y añade productos al carrito
   - El carrito se guardará automáticamente

## 💡 Cómo Usar la Aplicación

### Para Usuarios
1. **Explorar Productos**: Los productos se cargan automáticamente al abrir la página
2. **Filtrar**: Usa los dropdowns para filtrar por categoría u ordenar
3. **Buscar**: Escribe en la barra de búsqueda para encontrar productos específicos
4. **Añadir al Carrito**: Haz clic en "Agregar al Carrito" en cualquier producto
5. **Ver Carrito**: Haz clic en el ícono del carrito para ver tus productos
6. **Finalizar Compra**: Usa el botón "Finalizar Compra" para simular el checkout

### Para Desarrolladores
- El código está ampliamente documentado con comentarios explicativos
- Sigue patrones de JavaScript moderno y buenas prácticas
- Estructura modular fácil de extender y mantener

## 🔧 Configuración y Personalización

### Variables CSS
El archivo `styles.css` incluye variables CSS para fácil personalización:
```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2c3e50;
  --background-color: #f4f6f8;
  /* ... más variables */
}
```

### API de Productos
Actualmente usa FakeStore API. Para cambiar la fuente de datos:
1. Modifica la URL en la función `fetchProducts()`
2. Ajusta el mapeo de propiedades si es necesario

## 🌟 Características Avanzadas

### Persistencia de Datos
- El carrito se guarda automáticamente en localStorage
- Recuperación automática del carrito al recargar la página
- Manejo robusto de datos corruptos

### Manejo de Errores
- Validación de respuestas de la API
- Mensajes de error amigables para el usuario
- Recuperación elegante ante fallos de conexión

### Optimización de Rendimiento
- Delegación de eventos para mejor rendimiento
- Renderizado eficiente de grandes listas de productos
- Carga asíncrona de datos

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome (versión 60+)
- Firefox (versión 55+)
- Safari (versión 11+)
- Edge (versión 79+)

### Dispositivos
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Móvil (320px - 767px)

## 🤝 Contribuir

¿Quieres contribuir al proyecto? ¡Genial! Algunas ideas para mejoras:

- Añadir autenticación de usuarios
- Implementar wishlist/favoritos
- Agregar reseñas y calificaciones
- Mejorar la simulación de checkout
- Añadir más opciones de filtrado

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **FakeStore API** por proporcionar los datos de productos de prueba
- **Comunidad de desarrolladores** por las mejores prácticas implementadas

---

**¡Disfruta explorando la tienda online!** 🛍️

Para preguntas o sugerencias, no dudes en abrir un issue o contactar al equipo de desarrollo.

![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)