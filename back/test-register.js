// Usando fetch nativo do Node.js

async function testRegister() {
  try {
    console.log('🧪 Testando registro de empresa...');
    
    const response = await fetch('http://localhost:3333/api/auth-multi/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'teste2@empresa.com',
        password: 'Ryan.0412',
        firstName: 'Urek',
        lastName: 'Odachi',
        companyName: 'Outlegacy',
        role: 'admin'
      })
    });
    
    const data = await response.json();
    
    console.log('📊 Status:', response.status);
    console.log('📋 Resposta:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Registro realizado com sucesso!');
      console.log('🔑 Token:', data.data.token);
    } else {
      console.log('❌ Erro no registro:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testRegister();
