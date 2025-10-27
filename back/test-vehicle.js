// Teste de criação de veículo com campos individuais de imagem

async function testVehicle() {
  try {
    console.log('🧪 Testando criação de veículo com campos individuais de imagem...');
    
    const response = await fetch('http://localhost:3333/api/vehicles-multi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MjRkOTEyNC0yNGVlLTRkNTItYWUyZC02MmJkM2RlOGI3ZDEiLCJjb21wYW55SWQiOiJhZDFiYjMzMS1mYTgyLTQ1ZTktYjk5Yi01MDkwZWY2MWM3NDkiLCJlbWFpbCI6InRlc3RlMkBlbXByZXNhLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1OTExOTYyNSwiZXhwIjoxNzU5NzI0NDI1fQ.PhJ61AOXTQ2qlr-2VCxRC1R1fpHcCxmv8wdmZHejyHc'
      },
      body: JSON.stringify({
        title: 'Honda Civic 2020 - Teste',
        price: 85000.00,
        image1: 'https://exemplo.com/imagem1.jpg',
        image2: 'https://exemplo.com/imagem2.jpg',
        image3: 'https://exemplo.com/imagem3.jpg',
        image4: 'https://exemplo.com/imagem4.jpg',
        image5: 'https://exemplo.com/imagem5.jpg',
        image6: 'https://exemplo.com/imagem6.jpg',
        image7: 'https://exemplo.com/imagem7.jpg',
        image8: 'https://exemplo.com/imagem8.jpg',
        mileage: 25000,
        transmission: 'Automático',
        fuel: 'Flex',
        category: 'car',
        brand: 'Honda',
        model: 'Civic',
        year: 2020,
        location: 'São Paulo, SP',
        color: 'Prata',
        doors: 4,
        engine: '1.5 Turbo',
        vin: '1HGBH41JXMN109186',
        description: 'Veículo em excelente estado, único dono, revisões em dia.',
        featured: false
      })
    });
    
    const data = await response.json();
    
    console.log('📊 Status:', response.status);
    console.log('📋 Resposta:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Veículo criado com sucesso!');
      console.log('🆔 ID:', data.data.id);
      console.log('📸 Imagens:');
      console.log('  - image1:', data.data.image1);
      console.log('  - image2:', data.data.image2);
      console.log('  - image3:', data.data.image3);
      console.log('  - image4:', data.data.image4);
      console.log('  - image5:', data.data.image5);
      console.log('  - image6:', data.data.image6);
      console.log('  - image7:', data.data.image7);
      console.log('  - image8:', data.data.image8);
    } else {
      console.log('❌ Erro na criação:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testVehicle();
