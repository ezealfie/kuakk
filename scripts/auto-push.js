// Script para hacer commit y push automático
// Se ejecuta automáticamente después de cambios

const { execSync } = require('child_process');

function autoPush(message = 'Actualización automática') {
  try {
    // Verificar si hay cambios
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    
    if (!status.trim()) {
      console.log('✓ No hay cambios para commitear.');
      return;
    }

    // Agregar todos los cambios
    execSync('git add .', { stdio: 'inherit' });
    
    // Hacer commit
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
    
    // Obtener la rama actual
    const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    
    // Hacer push
    execSync(`git push -u origin ${branch}`, { stdio: 'inherit' });
    
    console.log('✓ Cambios subidos exitosamente a GitHub!');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  const message = process.argv[2] || 'Actualización automática';
  autoPush(message);
}

module.exports = { autoPush };

