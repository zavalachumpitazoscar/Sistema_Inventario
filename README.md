# Sistema de Inventario

Aplicación web profesional y responsive para gestionar el inventario de una empresa.

## Primera versión

- Panel de control con valorización, alertas de stock y actividad reciente.
- Productos, categorías y marcas.
- Entradas, salidas y transferencias.
- Proveedores, clientes, compras, ventas y comprobantes.
- Reportes de inventario, kardex, movimientos y rentabilidad.
- Usuarios, roles y auditoría.
- Alertas de stock mínimo y productos agotados.
- Diseño adaptable a computadora, tablet y celular.

## Puesta en marcha

La interfaz funciona inmediatamente en modo demostración y conserva los datos en el navegador.
Para conectar Firebase, crea un proyecto independiente para la empresa, activa Authentication
y Firestore, copia `firebase-config.example.js` como `firebase-config.js` y completa sus valores.

Antes de publicar para uso real se debe integrar el adaptador de Firebase, crear al primer
administrador y desplegar las reglas de seguridad incluidas.

## Estructura sugerida en Firestore

`users`, `products`, `categories`, `brands`, `partners`, `purchases`, `sales`,
`movements`, `warehouses`, `alerts` y `auditLogs`.
