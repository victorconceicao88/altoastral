import frangoCremoso from './assets/frango-cremoso.jpg';
import picanha from './assets/picanha.jpg';
import costelaRaiz from './assets/costela-raiz.jpg';
import frangoSupremo from './assets/frangosupremo.jpg';
import feijoadaAstral from './assets/feijoada.jpg';
import hamburguer from './assets/hamburguer.jpg';
import chorica from './assets/choriça.jpg';
import Asinha from './assets/Asinha.jpg';
import Picanhacomfritas from './assets/picanha-com-fritas.jpg';
import Filetilapia from './assets/filetilapia.jpg';
import baldedecerveja from './assets/baldecerveja.jpeg';
import vegano from './assets/vegano.jpg';
import hamburgueraltoastral from './assets/hamburgueraltoastral.jpg';
import sandespanado from './assets/sandespanado.jpg';
import negs from './assets/negs.jpg';
import fritascomqueijo from './assets/fritascomqueijo.jpg';
import costelaporco from './assets/costelaporco.jpg';
import pastelfeira from './assets/pastelfeira.jpg';
import abatanado from './assets/abatanado.png';
import chocolatequente from './assets/chocolatequente.jpg';
import caipirinha from './assets/caipirinha.png';
import caipiblack from './assets/caipiblack.png';
import logoBackground from './assets/fotodecapa.jpeg';
import cafe from './assets/cafe.jpg';

export const foodImages = {
  frangoCremoso: frangoCremoso,
  picanhaPremium: picanha,
  costelaRaiz: costelaRaiz,
  frangosupremo: frangoSupremo,
  feijoadaAstral: feijoadaAstral,
  hamburguer: hamburguer,
  chorica: chorica,
  Asinha: Asinha,
  Picanhacomfritas: Picanhacomfritas,
  Filetilapia: Filetilapia,
  baldedecerveja: baldedecerveja,
  vegano: vegano,
  hamburgueraltoastral: hamburgueraltoastral,
  sandespanado: sandespanado,
  negs: negs,
  fritascomqueijo: fritascomqueijo,
  costelaporco: costelaporco,
  pastelfeira: pastelfeira,
  cafe: cafe,
  abatanado: abatanado,
  chocolatequente: chocolatequente,
  caipirinha: caipirinha,
  caipiblack: caipiblack,
  batataFrita: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  pastel: 'https://images.unsplash.com/photo-1631853551243-ca3d3b769de3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  bebida: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  salgado: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  sobremesa: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  background: logoBackground
};

export const menu = {
  semana: [
     { id: 1, name: 'Frango Cremoso', description: 'Strogonoff de frango, arroz branco, salada e batata palha', price: 12.90, veg: false, image: foodImages.frangoCremoso },
     { id: 2, name: 'Picanha Premium', description: 'Picanha grelhada, arroz branco, feijão tropeiro e vinagrete', price: 15.90, veg: false, image: foodImages.picanhaPremium },
     { id: 3, name: 'Costela Raiz', description: 'Costela de vaca com mandioca, arroz branco, farofa e salada', price: 14.90, veg: false, image: foodImages.costelaRaiz },
     { id: 4, name: 'Frango Supremo', description: 'Filé de frango à parmegiana, arroz branco, batata frita e salada', price: 13.90, veg: false, image: foodImages.frangosupremo },
     { id: 5, name: 'Feijoada Astral', description: 'Feijoada brasileira, arroz branco, couve, farofa, torresmo e laranja', price: 12.90, veg: false, image: foodImages.feijoadaAstral },
     { id: 6, name: 'Opção Vegetariana', description: 'Prato vegetariano sob consulta - acompanha bebida e café', price: 12.90, veg: true, image: foodImages.vegano }
   ],
   lanches: [
     { id: 7, name: 'Hambúrguer com Fritas', description: 'Carne, alface, tomate, cebola, cheddar, molho da casa', price: 7.00, image: foodImages.hamburguer },
     { id: 8, name: 'Hambúrguer Alto Astral', description: 'Carne 120g, bacon, queijo, anéis de cebola, alface, tomate, cheddar, molho coquetel e especial', price: 9.90, image: foodImages.hamburgueraltoastral },
     { id: 9, name: 'Hambúrguer Neg\'s', description: 'Carne 120g, frango panado, bacon, queijo, anéis de cebola, cebola crispy, alface, tomate, cheddar, molho coquetel e especial', price: 12.90, image: foodImages.negs },
     { id: 10, name: 'Sandes de Panado', description: 'Frango panado, alface, tomate, cebola, molho da casa', price: 5.50, image: foodImages.sandespanado },
     { id: 11, name: 'Tostas Premium', description: 'Frango ou atum acompanha queijo, alface, tomate e cebola roxa', price: 6.50, image: foodImages.sandespanado },
     { id: 12, name: 'Sandes Natural', description: 'Patê de frango, queijo, rúcula, tomate, cebola roxa e cenoura ralada', price: 6.50, image: foodImages.sandespanado }
   ],
   porcoes: [
     { id: 13, name: 'Batata Frita', description: 'Porção com 400g de batata frita', price: 4.00, image: foodImages.batataFrita },
     { id: 14, name: 'Fritas com Bacon e Queijo', description: 'Porção com 400g de batatas com bacon e queijo cheddar', price: 6.50, image: foodImages.fritascomqueijo },
     { id: 15, name: 'Chouriça com Cebola', description: 'Porção com 600g de chouriça acebolada e pão fatiado', price: 9.00, image: foodImages.chorica },
     { id: 16, name: 'Asinha de Frango', description: 'Porção com 700g de asinhas de frango e molho barbecue', price: 12.00, image: foodImages.Asinha },
     { id: 17, name: 'Costelinha', description: 'Porção com 800g de costelinha e molho barbecue', price: 12.00, image: foodImages.costelaporco },
     { id: 18, name: 'Picanha com Fritas', description: 'Porção com 600g de tiras de picanha temperada com sal de parrilha e acompanhado de batata frita ou doce', price: 18.00, image: foodImages.Picanhacomfritas },
     { id: 19, name: 'Filé de Tilápia', description: 'Porção com 800g de filé de tilápia e molho tartaro', price: 14.00, image: foodImages.Filetilapia }
   ],
   pasteis: [
     { id: 20, name: 'Pastel Simples', description: 'Frango desfiado, carne picada ou queijo', price: 5.00, image: foodImages.pastelfeira },
     { id: 21, name: 'Pastel de Frango com Queijo', description: 'Frango desfiado com queijo', price: 5.50, image: foodImages.pastelfeira },
     { id: 22, name: 'Pastel de Frango com Queijo e Bacon', description: 'Frango desfiado com queijo e bacon em cubos', price: 6.50, image: foodImages.pastelfeira },
     { id: 23, name: 'Pastel de Carne com Queijo', description: 'Carne picada com queijo e azeitona', price: 5.50, image: foodImages.pastelfeira  },
     { id: 24, name: 'Pastel de Carne com Queijo e Bacon', description: 'Carne picada com queijo, azeitona e bacon em cubos', price: 6.50, image: foodImages.pastelfeira },
     { id: 25, name: 'Pastel de Chouriça', description: 'Queijo, chouriça e milho', price: 5.50, image: foodImages.pastelfeira },
     { id: 26, name: 'Pastel Misto', description: 'Fiambre, queijo, azeitona e milho', price: 5.50, image: foodImages.pastelfeira },
     { id: 27, name: 'Pastel de Pizza', description: 'Queijo, fiambre, tomate e orégano', price: 5.50, image: foodImages.pastelfeira },
     { id: 28, name: 'Pastel Alto Astral', description: 'Queijo, bacon, tomate, azeitona, cheddar e orégano', price: 6.50, image: foodImages.pastelfeira },
     { id: 29, name: 'Pastel Romeu e Julieta', description: 'Queijo com goiabada', price: 5.50, image: foodImages.pastelfeira },
     { id: 30, name: 'Pastel de Banana com Nutela', description: 'Queijo, banana e nutella', price: 6.00, image: foodImages.pastelfeira }
   ],
   cafe: [
     { id: 31, name: 'Café Expresso', price: 1.00, image: foodImages.pastel },
     { id: 32, name: 'Café Descafeinado', price: 1.00, image: foodImages.pastel },
     { id: 33, name: 'Café Duplo', price: 2.00, image: foodImages.pastel },
     { id: 34, name: 'Garoto', price: 1.00, image: foodImages.pastel },
     { id: 35, name: 'Abatanado', price: 1.10, image: foodImages.abatanado },
     { id: 36, name: 'Meia de Leite', price: 1.50, image: foodImages.cafe },
     { id: 37, name: 'Galão', price: 1.60, image: foodImages.cafe },
     { id: 38, name: 'Chá', price: 1.60, image: foodImages.cafe },
     { id: 39, name: 'Cappuccino', price: 3.00, image: foodImages.cafe },
     { id: 40, name: 'Caricoa de Limão', price: 1.00, image: foodImages.cafe },
     { id: 41, name: 'Chocolate Quente', price: 3.00, image: foodImages.chocolatequente },
     { id: 42, name: 'Torrada com Pão Caseiro', price: 2.00, image: foodImages.cafe },
     { id: 43, name: 'Torrada com Pão de Forma', price: 1.50, image: foodImages.cafe },
     { id: 44, name: 'Meia Torrada', price: 1.00, image: foodImages.cafe },
     { id: 45, name: 'Croissant Misto', price: 3.00, image: foodImages.cafe },
     { id: 46, name: 'Croissant Misto Tostado', price: 3.20, image: foodImages.cafe },
     { id: 47, name: 'Tosta Mista', price: 3.20, image: foodImages.cafe },
     { id: 48, name: 'Tosta Mista (Pão de Forma)', price: 2.80, image: foodImages.cafe },
     { id: 49, name: 'Sandes Mista', price: 2.20, image: foodImages.cafe },
     { id: 50, name: 'Pão com Ovo', price: 2.20, image: foodImages.cafe },
     { id: 51, name: 'Ovos com Bacon', price: 4.00, image: foodImages.cafe }
   ],
   bebidas: [
     { id: 52, name: 'Caipirinha', description: 'Cachaça 51 ou Velho Barreiro, lima, açúcar e gelo', price: 6.00, image: foodImages.caipirinha },
     { id: 53, name: 'Caipiblack', description: 'Cachaça preta, lima, açúcar e gelo', price: 6.00, image: foodImages.caipiblack },
     { id: 54, name: 'Whiskey Jamenson', price: 3.50, image: foodImages.bebida },
     { id: 55, name: 'Whiskey J&B', price: 3.00, image: foodImages.bebida },
     { id: 56, name: 'Whiskey Jack Daniels', price: 3.50, image: foodImages.bebida },
     { id: 57, name: 'Whiskey Black Label', price: 4.00, image: foodImages.bebida },
     { id: 58, name: 'Vodka', price: 4.00, image: foodImages.bebida },
     { id: 59, name: 'Somersby', price: 2.50, image: foodImages.bebida },
     { id: 60, name: 'Imperial Heineken (0.20)', price: 1.50, image: foodImages.bebida },
     { id: 61, name: 'Caneca Heineken (0.50)', price: 3.00, image: foodImages.bebida },
     { id: 62, name: 'Cerveja Garrafa (0.33ml)', price: 1.40, image: foodImages.bebida },
     { id: 63, name: 'Cerveja Mini (0.20ml)', price: 1.10, image: foodImages.bebida },
     { id: 64, name: 'Taça de Sangria', description: 'Sangria branca, rosé ou tinta', price: 6.00, image: foodImages.bebida },
     { id: 65, name: 'Refrigerante Lata', price: 1.60, image: foodImages.bebida },
     { id: 66, name: 'Água 1.5L', price: 1.50, image: foodImages.bebida },
     { id: 67, name: 'Água 0.5L', price: 1.00, image: foodImages.bebida },
     { id: 68, name: 'Água 0.33L', price: 0.60, image: foodImages.bebida },
     { id: 69, name: 'Água Castelo', price: 1.40, image: foodImages.bebida },
     { id: 70, name: 'Água das Pedras', price: 1.40, image: foodImages.bebida },
     { id: 71, name: 'Balde de Heineken', price: 10.00, image: foodImages.baldedecerveja }
   ],
   salgados: [
     { id: 72, name: 'Pão de Queijo', price: 1.60, image: foodImages.salgado },
     { id: 73, name: 'Pastel de Nata', price: 1.30, image: foodImages.salgado },
     { id: 74, name: 'Empada de Frango', price: 2.00, image: foodImages.salgado },
     { id: 75, name: 'Kibe', price: 2.20, image: foodImages.salgado },
     { id: 76, name: 'Fiambre e Queijo', price: 2.20, image: foodImages.salgado },
     { id: 77, name: 'Bauru', price: 2.20, image: foodImages.salgado },
     { id: 78, name: 'Bola de Queijo', price: 2.20, image: foodImages.salgado },
     { id: 79, name: 'Coxinha de Frango', price: 2.20, image: foodImages.salgado },
     { id: 80, name: 'Coxinha com Catupiry', price: 3.00, image: foodImages.salgado },
     { id: 81, name: 'Hamburgão', price: 3.50, image: foodImages.salgado }
   ],
   sobremesas: [
     { id: 82, name: 'Bolo no Pote - Prestígio', description: 'Chocolate com coco', price: 4.00, image: foodImages.sobremesa },
     { id: 83, name: 'Bolo no Pote - Chocolate', description: 'Massa de chocolate com recheio de chocolate', price: 4.00, image: foodImages.sobremesa },
     { id: 84, name: 'Bolo no Pote - Ananás', description: 'Creme de ninho com pedaços de ananás', price: 4.00, image: foodImages.sobremesa },
     { id: 85, name: 'Bolo no Pote - Choco Misto', description: 'Chocolate preto com ninho', price: 4.00, image: foodImages.sobremesa },
     { id: 86, name: 'Cheesecake - Goiabada', price: 3.50, image: foodImages.sobremesa },
     { id: 87, name: 'Cheesecake - Frutos Vermelhos', price: 3.50, image: foodImages.sobremesa },
     { id: 88, name: 'Brigadeiro Tradicional', price: 1.50, image: foodImages.sobremesa },
     { id: 89, name: 'Brigadeiro Beijinho', price: 1.50, image: foodImages.sobremesa },
     { id: 90, name: 'Brigadeiro Ninho', price: 2.00, image: foodImages.sobremesa },
     { id: 91, name: 'Brigadeiro Paçoca', price: 2.00, image: foodImages.sobremesa },
     { id: 92, name: 'Brigadeiro Morango', price: 2.00, image: foodImages.sobremesa },
     { id: 93, name: 'Brigadeiro Churros', price: 2.00, image: foodImages.sobremesa },
     { id: 94, name: 'Tarte de Toblerone', price: 2.20, image: foodImages.sobremesa },
     { id: 95, name: 'Bolo de Brigadeiro (fatia)', price: 2.20, image: foodImages.sobremesa }
   ]
 };