# Guia de Deploy a Vercel (5 minutos)

## Opcion A: Deploy directo con Vercel CLI (mas rapido)

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# 1. Instalar Vercel CLI (solo la primera vez)
npm install -g vercel

# 2. Hacer deploy (te pedira iniciar sesion la primera vez)
vercel --yes

# 3. Para hacer deploy a produccion:
vercel --prod
```

Vercel te dara una URL publica como: `https://tu-proyecto.vercel.app`

---

## Opcion B: GitHub + Vercel (recomendado para enlace permanente)

### Paso 1: Crear repo en GitHub
1. Ve a https://github.com/new
2. Nombre: `ecommerce-dasw`
3. Dejalo publico
4. NO marques "Add a README" ni nada
5. Click "Create repository"

### Paso 2: Subir el codigo (ejecutar en terminal dentro de la carpeta del proyecto)
```bash
git init -b main
git add -A
git commit -m "Proyecto e-commerce DASW"
git remote add origin https://github.com/TU_USUARIO/ecommerce-dasw.git
git push -u origin main
```

### Paso 3: Conectar a Vercel
1. Ve a https://vercel.com (inicia sesion con GitHub)
2. Click "Add New..." → "Project"
3. Selecciona el repo `ecommerce-dasw`
4. Click "Deploy"
5. Listo! Vercel te da tu URL publica

---

## Despues del deploy
Copia la URL publica y pegala en el PDF del entregable.
