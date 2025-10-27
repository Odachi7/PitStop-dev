// Script completo para configurar o sistema
import { runAllMigrations } from './run-all-migrations';
import { createSuperAdmin } from './create-super-admin';

async function setupSystem() {
  try {
    console.log('🔧 Configurando sistema PitStop...\n');

    // 1. Executar migrations
    console.log('📊 Executando migrations do banco de dados...');
    await runAllMigrations();

    console.log('\n' + '='.repeat(50) + '\n');

    // 2. Criar super admin
    console.log('👤 Criando super admin...');
    await createSuperAdmin();

    console.log('\n' + '='.repeat(50) + '\n');
    console.log('✅ Sistema configurado com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('1. Altere a senha padrão do super admin após o primeiro login');
    console.log('2. Configure as variáveis de ambiente no arquivo .env');
    console.log('3. Inicie o servidor com: npm run dev');
    console.log('\n🔐 Credenciais do Super Admin:');
    console.log('Email: admin@pitstop.com');
    console.log('Senha: admin123');
    console.log('\n⚠️  IMPORTANTE: Altere a senha padrão imediatamente!');

  } catch (error) {
    console.error('❌ Erro durante a configuração do sistema:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
setupSystem();

export { setupSystem };
