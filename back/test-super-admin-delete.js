// Teste para verificar se super admin consegue deletar veículos
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000';

async function testSuperAdminDelete() {
  try {
    console.log('🔐 Testando login do super admin...');
    
    // 1. Fazer login como super admin
    const loginResponse = await fetch(`${API_BASE}/api/auth-multi/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@pitstop.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.error('❌ Erro no login:', loginData.error);
      return;
    }

    console.log('✅ Login realizado com sucesso!');
    console.log('👤 Role do usuário:', loginData.user.role);
    console.log('🆔 User ID:', loginData.user.id);

    const token = loginData.token;

    // 2. Listar veículos para pegar um ID
    console.log('\n📋 Listando veículos...');
    const listResponse = await fetch(`${API_BASE}/api/vehicles-multi`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const vehiclesData = await listResponse.json();
    
    if (!vehiclesData.success || !vehiclesData.data || vehiclesData.data.length === 0) {
      console.log('⚠️  Nenhum veículo encontrado para testar');
      
      // Criar um veículo de teste
      console.log('\n🚗 Criando veículo de teste...');
      const createResponse = await fetch(`${API_BASE}/api/vehicles-multi`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Veículo de Teste',
          price: 50000,
          brand: 'Toyota',
          model: 'Corolla',
          year: 2020,
          category: 'car',
          mileage: 50000,
          transmission: 'Automatic',
          fuel: 'Gasoline',
          color: 'Branco',
          doors: 4,
          location: 'São Paulo',
          description: 'Veículo de teste para super admin'
        })
      });

      const createData = await createResponse.json();
      
      if (!createData.success) {
        console.error('❌ Erro ao criar veículo:', createData.error);
        return;
      }

      console.log('✅ Veículo criado com sucesso!');
      console.log('🆔 ID do veículo:', createData.data.id);
      
      // Tentar deletar o veículo
      console.log('\n🗑️  Tentando deletar veículo...');
      const deleteResponse = await fetch(`${API_BASE}/api/vehicles-multi/${createData.data.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const deleteData = await deleteResponse.json();
      
      if (deleteData.success) {
        console.log('✅ Veículo deletado com sucesso pelo super admin!');
      } else {
        console.error('❌ Erro ao deletar veículo:', deleteData.error);
      }
      
    } else {
      // Usar o primeiro veículo da lista
      const vehicleId = vehiclesData.data[0].id;
      console.log(`📋 Usando veículo ID: ${vehicleId}`);
      
      // Tentar deletar o veículo
      console.log('\n🗑️  Tentando deletar veículo...');
      const deleteResponse = await fetch(`${API_BASE}/api/vehicles-multi/${vehicleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const deleteData = await deleteResponse.json();
      
      if (deleteData.success) {
        console.log('✅ Veículo deletado com sucesso pelo super admin!');
      } else {
        console.error('❌ Erro ao deletar veículo:', deleteData.error);
      }
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testSuperAdminDelete();
