# Consulta Previa Proxy - Archivos Estáticos

## Propósito

Esta carpeta contiene el **build de producción** del frontend React (`consulta-previa/`).

**⚠️ NO EDITAR MANUALMENTE** - Los archivos se generan automáticamente.

## Regenerar Build

```bash
cd ../consulta-previa && npm run build
```

## Estructura

```
├── index.html          # Entry point
├── assets/
│   ├── index-*.js      # Bundle JavaScript
│   └── index-*.css     # Estilos compilados
└── images/             # Assets estáticos
```

## Deployment

Servir como archivos estáticos con cualquier servidor web (nginx, whitenoise, etc.)
