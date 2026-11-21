# PC Builder Pro

Configurador de PC con catálogo local en `src/data/components.js`, validación en vivo, presupuesto en USD/ARS, guardado local y asistente de armado.

El catálogo contiene entre 14 y 16 opciones por categoría. Cada artículo tiene las mismas propiedades dentro de su categoría y un ID estable, además de precios USD de referencia y `priceArs` inicial. En la aplicación, el importe ARS se calcula con la cotización editable; los precios locales personalizados quedan guardados en el navegador. Se puede elegir Hardware manual, MEP o Blue. La actualización automática usa DolarApi (`bolsa` para MEP y `blue` para Blue); si falla la conexión, el tipo de cambio sigue editable.

La navegación incluye seis PCs recomendadas verificadas contra el motor de compatibilidad, comparación lado a lado de hasta tres armados y enlaces de búsqueda por tienda para cada pieza seleccionada. Los enlaces de búsqueda se pueden incluir al copiar el resumen o imprimirlo.

Los precios base del catálogo se calibraron con referencias de mercado local publicadas en Mendoza: refrigeraciones AIO 240mm alrededor de ARS 155.000, AIO 360mm alrededor de ARS 180.000 y las demás categorías con bandas locales equivalentes. `priceArs` conserva esa referencia inicial; `price` guarda su equivalente USD a la cotización base configurable, de modo que el armador, las recomendaciones y la comparación recalculan sus importes desde el mismo catálogo.

## Requisitos

- Node.js 20.19+ o 22.12+ (incluye npm).

## Ejecutar localmente

Desde una terminal, entrá a la carpeta del proyecto y ejecutá:

```bash
npm install
npx netlify dev
```

Netlify CLI sirve Vite y `/.netlify/functions/fetch-prices` en el mismo origen para que la consulta automática funcione también en desarrollo. La caché de precios por provincia y componente dura seis horas. En producción, Netlify detecta `netlify.toml` y publica la función junto con la compilación.

Para generar una compilación de producción:

```bash
npm run build
npm run preview
```

Los armados y la cotización se guardan en el almacenamiento local del navegador. El catálogo y sus precios referenciales se pueden editar en `src/data/components.js`.
