import React, { useState, useEffect } from 'react';
import { FiUser, FiPlus, FiTrash2, FiUsers, FiGrid, FiArrowLeft, FiDownload, FiChevronRight, FiShoppingBag, FiClock, FiDollarSign, FiCheck, FiX, FiEdit2, FiPrinter } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { motion, AnimatePresence } from 'framer-motion';

// Premium Menu Data
const menu = {
  semana: [
    { id: 1, name: 'Frango Cremoso', description: 'Strogonoff de frango, arroz branco, salada e batata palha', price: 12.90, veg: false, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 2, name: 'Picanha Premium', description: 'Picanha grelhada, arroz branco, feijão tropeiro e vinagrete', price: 15.90, veg: false, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 3, name: 'Costela Raiz', description: 'Costela de vaca com mandioca, arroz branco, farofa e salada', price: 14.90, veg: false, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 4, name: 'Frango Supremo', description: 'Filé de frango à parmegiana, arroz branco, batata frita e salada', price: 13.90, veg: false, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 },
    { id: 5, name: 'Feijoada Astral', description: 'Feijoada brasileira, arroz branco, couve, farofa, torresmo e laranja', price: 12.90, veg: false, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 },
    { id: 6, name: 'Opção Vegetariana', description: 'Prato vegetariano sob consulta - acompanha bebida e café', price: 12.90, veg: true, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 }
  ],
  lanches: [
    { id: 7, name: 'Hambúrguer com Fritas', description: 'Carne, alface, tomate, cebola, cheddar, molho da casa', price: 7.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.4 },
    { id: 8, name: 'Hambúrguer Alto Astral', description: 'Carne 120g, bacon, queijo, anéis de cebola, alface, tomate, cheddar, molho coquetel e especial', price: 9.90, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 9, name: 'Hambúrguer Neg\'s', description: 'Carne 120g, frango panado, bacon, queijo, anéis de cebola, cebola crispy, alface, tomate, cheddar, molho coquetel e especial', price: 12.90, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 },
    { id: 10, name: 'Sandes de Panado', description: 'Frango panado, alface, tomate, cebola, molho da casa', price: 5.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.1 },
    { id: 11, name: 'Tostas Premium', description: 'Frango ou atum acompanha queijo, alface, tomate e cebola roxa', price: 6.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.0 },
    { id: 12, name: 'Sandes Natural', description: 'Patê de frango, queijo, rúcula, tomate, cebola roxa e cenoura ralada', price: 6.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 3.9 }
  ],
  porcoes: [
    { id: 13, name: 'Batata Frita', description: 'Porção com 400g de batata frita', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 },
    { id: 14, name: 'Fritas com Bacon e Queijo', description: 'Porção com 400g de batatas com bacon e queijo cheddar', price: 6.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.6 },
    { id: 15, name: 'Chouriça com Cebola', description: 'Porção com 600g de chouriça acebolada e pão fatiado', price: 9.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 16, name: 'Asinha de Frango', description: 'Porção com 700g de asinhas de frango e molho barbecue', price: 12.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.4 },
    { id: 17, name: 'Costelinha', description: 'Porção com 800g de costelinha e molho barbecue', price: 12.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 18, name: 'Picanha com Fritas', description: 'Porção com 600g de tiras de picanha temperada com sal de parrilha e acompanhado de batata frita ou doce', price: 18.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 19, name: 'Filé de Tilápia', description: 'Porção com 800g de filé de tilápia e molho tartaro', price: 14.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 }
  ],
  pasteis: [
    { id: 20, name: 'Pastel Simples', description: 'Frango desfiado, carne picada ou queijo', price: 5.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 },
    { id: 21, name: 'Pastel de Frango com Queijo', description: 'Frango desfiado com queijo', price: 5.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 22, name: 'Pastel de Frango com Queijo e Bacon', description: 'Frango desfiado com queijo e bacon em cubos', price: 6.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 23, name: 'Pastel de Carne com Queijo', description: 'Carne picada com queijo e azeitona', price: 5.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.4 },
    { id: 24, name: 'Pastel de Carne com Queijo e Bacon', description: 'Carne picada com queijo, azeitona e bacon em cubos', price: 6.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.6 },
    { id: 25, name: 'Pastel de Chouriça', description: 'Queijo, chouriça e milho', price: 5.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 },
    { id: 26, name: 'Pastel Misto', description: 'Fiambre, queijo, azeitona e milho', price: 5.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.1 },
    { id: 27, name: 'Pastel de Pizza', description: 'Queijo, fiambre, tomate e orégano', price: 5.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.0 },
    { id: 28, name: 'Pastel Alto Astral', description: 'Queijo, bacon, tomate, azeitona, cheddar e orégano', price: 6.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 29, name: 'Pastel Romeu e Julieta', description: 'Queijo com goiabada', price: 5.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 30, name: 'Pastel de Banana com Nutela', description: 'Queijo, banana e nutella', price: 6.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 }
  ],
  cafe: [
    { id: 31, name: 'Café Expresso', price: 1.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 32, name: 'Café Descafeinado', price: 1.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 },
    { id: 33, name: 'Café Duplo', price: 2.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.6 },
    { id: 34, name: 'Garoto', price: 1.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 },
    { id: 35, name: 'Abatanado', price: 1.10, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.1 },
    { id: 36, name: 'Meia de Leite', price: 1.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.4 },
    { id: 37, name: 'Galão', price: 1.60, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 38, name: 'Chá', price: 1.60, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.0 },
    { id: 39, name: 'Cappuccino', price: 3.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 40, name: 'Caricoa de Limão', price: 1.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 3.9 },
    { id: 41, name: 'Chocolate Quente', price: 3.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 42, name: 'Torrada com Pão Caseiro', price: 2.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 },
    { id: 43, name: 'Torrada com Pão de Forma', price: 1.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.1 },
    { id: 44, name: 'Meia Torrada', price: 1.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.0 },
    { id: 45, name: 'Croissant Misto', price: 3.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.6 },
    { id: 46, name: 'Croissant Misto Tostado', price: 3.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 47, name: 'Tosta Mista', price: 3.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 48, name: 'Tosta Mista (Pão de Forma)', price: 2.80, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.4 },
    { id: 49, name: 'Sandes Mista', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 },
    { id: 50, name: 'Pão com Ovo', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.1 },
    { id: 51, name: 'Ovos com Bacon', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 }
  ],
  bebidas: [
    { id: 52, name: 'Caipirinha', description: 'Cachaça 51 ou Velho Barreiro, lima, açúcar e gelo', price: 6.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 53, name: 'Caipiblack', description: 'Cachaça preta, lima, açúcar e gelo', price: 6.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 },
    { id: 54, name: 'Whiskey Jamenson', price: 3.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 55, name: 'Whiskey J&B', price: 3.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 56, name: 'Whiskey Jack Daniels', price: 3.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 57, name: 'Whiskey Black Label', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 },
    { id: 58, name: 'Vodka', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.6 },
    { id: 59, name: 'Somersby', price: 2.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.4 },
    { id: 60, name: 'Imperial Heineken (0.20)', price: 1.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 61, name: 'Caneca Heineken (0.50)', price: 3.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 62, name: 'Cerveja Garrafa (0.33ml)', price: 1.40, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 },
    { id: 63, name: 'Cerveja Mini (0.20ml)', price: 1.10, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 },
    { id: 64, name: 'Taça de Sangria', description: 'Sangria branca, rosé ou tinta', price: 6.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 65, name: 'Refrigerante Lata', price: 1.60, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.1 },
    { id: 66, name: 'Água 1.5L', price: 1.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.0 },
    { id: 67, name: 'Água 0.5L', price: 1.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.0 },
    { id: 68, name: 'Água 0.33L', price: 0.60, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.0 },
    { id: 69, name: 'Água Castelo', price: 1.40, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 },
    { id: 70, name: 'Água das Pedras', price: 1.40, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 }
  ],
  salgados: [
    { id: 71, name: 'Pão de Queijo', price: 1.60, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 72, name: 'Pastel de Nata', price: 1.30, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 73, name: 'Empada de Frango', price: 2.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.4 },
    { id: 74, name: 'Kibe', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 },
    { id: 75, name: 'Fiambre e Queijo', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.2 },
    { id: 76, name: 'Bauru', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.1 },
    { id: 77, name: 'Bola de Queijo', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.3 },
    { id: 78, name: 'Coxinha de Frango', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.6 },
    { id: 79, name: 'Coxinha com Catupiry', price: 3.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 80, name: 'Hamburgão', price: 3.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 }
  ],
  sobremesas: [
    { id: 81, name: 'Bolo no Pote - Prestígio', description: 'Chocolate com coco', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 82, name: 'Bolo no Pote - Chocolate', description: 'Massa de chocolate com recheio de chocolate', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 },
    { id: 83, name: 'Bolo no Pote - Ananás', description: 'Creme de ninho com pedaços de ananás', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 84, name: 'Bolo no Pote - Choco Misto', description: 'Chocolate preto com ninho', price: 4.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 85, name: 'Cheesecake - Goiabada', price: 3.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 86, name: 'Cheesecake - Frutos Vermelhos', price: 3.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 87, name: 'Brigadeiro Tradicional', price: 1.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.6 },
    { id: 88, name: 'Brigadeiro Beijinho', price: 1.50, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.5 },
    { id: 89, name: 'Brigadeiro Ninho', price: 2.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 90, name: 'Brigadeiro Paçoca', price: 2.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 91, name: 'Brigadeiro Morango', price: 2.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 },
    { id: 92, name: 'Brigadeiro Churros', price: 2.00, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.9 },
    { id: 93, name: 'Tarte de Toblerone', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.7 },
    { id: 94, name: 'Bolo de Brigadeiro (fatia)', price: 2.20, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: 4.8 }
  ]
};

const InterfaceEventos = () => {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('Meu Evento Premium');
  const [guests, setGuests] = useState([]);
  const [currentGuest, setCurrentGuest] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeTab, setActiveTab] = useState('mesas');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeMenuTab, setActiveMenuTab] = useState('semana');
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [customerView, setCustomerView] = useState(false);

  // Generate 50 unique QR Codes for tables
  const generateQRCodes = () => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: `qr-${i + 1}`,
      tableNumber: i + 1,
      url: `${window.location.origin}/order?table=${i + 1}&event=${encodeURIComponent(eventName)}`
    }));
  };

  const qrCodes = generateQRCodes();

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Add guest
  const addGuest = () => {
    if (currentGuest.trim()) {
      setGuests([...guests, { id: Date.now(), name: currentGuest }]);
      setCurrentGuest('');
      showNotification('Convidado adicionado com sucesso!');
    }
  };

  // Remove guest
  const removeGuest = (id) => {
    setGuests(guests.filter(guest => guest.id !== id));
    showNotification('Convidado removido!', 'info');
  };

  // Create table
  const createTable = () => {
    if (guests.length > 0) {
      const newTable = {
        id: Date.now(),
        name: `Mesa ${tables.length + 1}`,
        guests: [...guests],
        qrCodeId: `qr-${tables.length + 1}`,
        activeOrder: null
      };
      setTables([...tables, newTable]);
      setGuests([]);
      showNotification(`Mesa ${tables.length + 1} criada com sucesso!`);
    }
  };

  // Open table details
  const openTable = (table) => {
    setSelectedTable(table);
    // Find any active orders for this table
    const tableOrder = orders.find(order => 
      order.tableId === table.id && order.status !== 'closed'
    );
    if (tableOrder) {
      setCurrentOrder(tableOrder);
    }
  };

  // Close table details
  const closeTable = () => {
    setSelectedTable(null);
    setCurrentOrder(null);
  };

  // Back to dashboard
  const handleBackToDashboard = () => {
    navigate('/restricted');
  };

  // Download single QR Code
  const downloadQRCode = async (qrId) => {
    try {
      setIsLoading(true);
      const qrElement = document.getElementById(qrId);
      const canvas = await html2canvas(qrElement);
      canvas.toBlob((blob) => {
        saveAs(blob, `qr-mesa-${qrId.split('-')[1]}.png`);
      });
      showNotification(`QR Code da ${qrId.replace('-', ' ')} baixado!`);
    } catch (error) {
      showNotification('Erro ao baixar QR Code', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Download all QR Codes
  const downloadAllQRCodes = async () => {
    try {
      setIsLoading(true);
      const zip = new JSZip();
      const qrFolder = zip.folder('qr-codes');
      
      for (const qr of qrCodes) {
        const qrElement = document.getElementById(qr.id);
        const canvas = await html2canvas(qrElement);
        canvas.toBlob((blob) => {
          qrFolder.file(`mesa-${qr.tableNumber}.png`, blob);
        });
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'todos-qr-codes.zip');
      showNotification('Todos QR Codes baixados com sucesso!');
    } catch (error) {
      showNotification('Erro ao baixar QR Codes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Create new order
  const createNewOrder = () => {
    const newOrder = {
      id: Date.now(),
      tableId: selectedTable.id,
      tableName: selectedTable.name,
      items: [],
      status: 'open', // open, preparing, ready, delivered, closed
      createdAt: new Date(),
      subtotal: 0,
      tax: 0,
      total: 0,
      notes: ''
    };
    setOrders([...orders, newOrder]);
    setCurrentOrder(newOrder);
    
    // Update table with active order
    const updatedTables = tables.map(table => 
      table.id === selectedTable.id ? { ...table, activeOrder: newOrder.id } : table
    );
    setTables(updatedTables);
    
    showNotification(`Nova comanda criada para ${selectedTable.name}`);
  };

  // Add item to current order
  const addItemToOrder = (item) => {
    if (!currentOrder) return;
    
    const updatedOrder = {
      ...currentOrder,
      items: [...currentOrder.items, {
        ...item,
        orderItemId: Date.now(),
        status: 'pending', // pending, preparing, ready, delivered
        quantity: 1,
        notes: ''
      }],
      subtotal: currentOrder.subtotal + item.price,
      total: currentOrder.subtotal + item.price
    };
    
    setCurrentOrder(updatedOrder);
    
    // Update orders list
    const updatedOrders = orders.map(order => 
      order.id === currentOrder.id ? updatedOrder : order
    );
    setOrders(updatedOrders);
    
    showNotification(`${item.name} adicionado à comanda`, 'info');
  };

  // Update item quantity
  const updateItemQuantity = (orderItemId, newQuantity) => {
    if (!currentOrder || newQuantity < 1) return;
    
    const updatedItems = currentOrder.items.map(item => {
      if (item.orderItemId === orderItemId) {
        const priceDifference = (newQuantity - item.quantity) * item.price;
        return {
          ...item,
          quantity: newQuantity
        };
      }
      return item;
    });
    
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const updatedOrder = {
      ...currentOrder,
      items: updatedItems,
      subtotal,
      total: subtotal
    };
    
    setCurrentOrder(updatedOrder);
    
    // Update orders list
    const updatedOrders = orders.map(order => 
      order.id === currentOrder.id ? updatedOrder : order
    );
    setOrders(updatedOrders);
  };

  // Remove item from order
  const removeItemFromOrder = (orderItemId) => {
    if (!currentOrder) return;
    
    const itemToRemove = currentOrder.items.find(item => item.orderItemId === orderItemId);
    if (!itemToRemove) return;
    
    const updatedItems = currentOrder.items.filter(item => item.orderItemId !== orderItemId);
    const subtotal = currentOrder.subtotal - (itemToRemove.price * itemToRemove.quantity);
    
    const updatedOrder = {
      ...currentOrder,
      items: updatedItems,
      subtotal,
      total: subtotal
    };
    
    setCurrentOrder(updatedOrder);
    
    // Update orders list
    const updatedOrders = orders.map(order => 
      order.id === currentOrder.id ? updatedOrder : order
    );
    setOrders(updatedOrders);
    
    showNotification(`${itemToRemove.name} removido da comanda`, 'info');
  };

  // Update order status
  const updateOrderStatus = (status) => {
    if (!currentOrder) return;
    
    const updatedOrder = {
      ...currentOrder,
      status
    };
    
    setCurrentOrder(updatedOrder);
    
    // Update orders list
    const updatedOrders = orders.map(order => 
      order.id === currentOrder.id ? updatedOrder : order
    );
    setOrders(updatedOrders);
    
    // If closing order, remove from table's active order
    if (status === 'closed') {
      const updatedTables = tables.map(table => 
        table.id === selectedTable.id ? { ...table, activeOrder: null } : table
      );
      setTables(updatedTables);
    }
    
    showNotification(`Status da comanda atualizado para ${getStatusText(status)}`, 'info');
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Aberta';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronta';
      case 'delivered': return 'Entregue';
      case 'closed': return 'Fechada';
      default: return status;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Print order
  const printOrder = () => {
    if (!currentOrder) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Comanda ${currentOrder.tableName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #4f46e5; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; }
            .total { font-weight: bold; font-size: 1.2em; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .notes { margin-top: 20px; padding: 10px; background-color: #f3f4f6; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Comanda ${currentOrder.tableName}</h1>
            <p>Data: ${new Date(currentOrder.createdAt).toLocaleString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${currentOrder.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.price)}</td>
                  <td>${formatCurrency(item.price * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            Total: ${formatCurrency(currentOrder.total)}
          </div>
          ${currentOrder.notes ? `<div class="notes"><strong>Observações:</strong> ${currentOrder.notes}</div>` : ''}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Toggle customer view
  const toggleCustomerView = () => {
    setCustomerView(!customerView);
  };

  // Add sample data for demonstration
  useEffect(() => {
    if (tables.length === 0 && guests.length === 0) {
      setGuests([
        { id: 1, name: 'Ana Silva' },
        { id: 2, name: 'Carlos Oliveira' },
        { id: 3, name: 'Mariana Santos' }
      ]);
    }
    
    // Simulate some orders for demo
    if (tables.length > 0 && orders.length === 0) {
      const demoOrders = [
        {
          id: 1,
          tableId: tables[0].id,
          tableName: tables[0].name,
          items: [
            { ...menu.semana[0], orderItemId: 101, quantity: 2, status: 'delivered' },
            { ...menu.bebidas[0], orderItemId: 102, quantity: 1, status: 'delivered' }
          ],
          status: 'open',
          createdAt: new Date(Date.now() - 3600000),
          subtotal: menu.semana[0].price * 2 + menu.bebidas[0].price,
          tax: 0,
          total: menu.semana[0].price * 2 + menu.bebidas[0].price,
          notes: 'Sem cebola no strogonoff'
        }
      ];
      setOrders(demoOrders);
      
      // Set active order for first table
      const updatedTables = tables.map((table, index) => 
        index === 0 ? { ...table, activeOrder: 1 } : table
      );
      setTables(updatedTables);
    }
  }, [tables]);

  if (selectedTable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        {/* Notification */}
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
              notification.type === 'error' ? 'bg-red-500' : 
              notification.type === 'info' ? 'bg-blue-500' : 'bg-emerald-500'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
        
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">{selectedTable.name}</h2>
                <p className="text-indigo-100 opacity-90">{eventName}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={toggleCustomerView}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    customerView ? 'bg-white text-indigo-600' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {customerView ? 'Modo Garçom' : 'Modo Cliente'}
                </button>
                <button 
                  onClick={closeTable}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl transition-all backdrop-blur-sm"
                >
                  <FiArrowLeft className="text-white" />
                  <span>Voltar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {customerView ? (
              // Customer View
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
                  <h3 className="text-xl font-semibold mb-4 text-indigo-800 flex items-center">
                    <FiShoppingBag className="mr-2" />
                    Sua Comanda
                  </h3>
                  
                  {currentOrder ? (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}>
                          {getStatusText(currentOrder.status)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {new Date(currentOrder.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        {currentOrder.items.map(item => (
                          <div key={item.orderItemId} className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                            <div>
                              <h4 className="font-medium text-gray-800">{item.name}</h4>
                              <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="font-medium text-gray-700">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                              <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                                {item.quantity}x
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">{formatCurrency(currentOrder.subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Taxas:</span>
                          <span className="font-medium">{formatCurrency(currentOrder.tax)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold text-indigo-700">
                          <span>Total:</span>
                          <span>{formatCurrency(currentOrder.total)}</span>
                        </div>
                      </div>
                      
                      {currentOrder.notes && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                          <h4 className="text-sm font-medium text-yellow-800 mb-1">Observações:</h4>
                          <p className="text-sm text-yellow-700">{currentOrder.notes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <FiShoppingBag className="text-indigo-600 text-2xl" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-700 mb-1">Nenhuma comanda ativa</h4>
                      <p className="text-gray-500">Escaneie o QR Code para fazer seu pedido</p>
                    </div>
                  )}
                </div>
                
                {/* QR Code */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
                  <h3 className="text-xl font-semibold mb-6 text-indigo-800 flex items-center">
                    <FiGrid className="mr-2" />
                    QR Code da Mesa
                  </h3>
                  <div className="flex flex-col items-center">
                    <div className="p-5 bg-white border-2 border-indigo-100 rounded-2xl shadow-sm mb-6">
                      <QRCodeSVG 
                        value={`${window.location.origin}/order?table=${selectedTable.name.replace('Mesa ', '')}&event=${encodeURIComponent(eventName)}`}
                        size={200}
                        level="H"
                        includeMargin={true}
                        fgColor="#4f46e5"
                      />
                    </div>
                    <p className="text-center text-gray-600 mb-6">
                      Escaneie este código para fazer pedidos diretamente
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Waiter View
              <div className="grid lg:grid-cols-2 gap-10">
                {/* Left Column */}
                <div>
                  {/* Guests */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                      <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <FiUsers className="text-indigo-600" />
                      </span>
                      Convidados nesta mesa
                    </h3>
                    <div className="space-y-3 mb-6">
                      {selectedTable.guests.length > 0 ? (
                        selectedTable.guests.map(guest => (
                          <div key={guest.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center mr-3">
                                <FiUser className="text-indigo-600" />
                              </div>
                              <span className="font-medium text-gray-800">{guest.name}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                          <p className="text-gray-500">Nenhum convidado nesta mesa</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Current Order */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                          <FiShoppingBag className="text-indigo-600" />
                        </span>
                        Comanda Atual
                      </h3>
                      {currentOrder && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}>
                          {getStatusText(currentOrder.status)}
                        </span>
                      )}
                    </div>
                    
                    {currentOrder ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">Mesa:</span>
                            <span className="font-medium">{currentOrder.tableName}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">Aberta em:</span>
                            <span className="font-medium">{new Date(currentOrder.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Total:</span>
                            <span className="font-bold text-indigo-600">{formatCurrency(currentOrder.total)}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {currentOrder.items.map(item => (
                            <div key={item.orderItemId} className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-all">
                              <div>
                                <h4 className="font-medium text-gray-800">{item.name}</h4>
                                <p className="text-sm text-gray-500">{item.description}</p>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <button 
                                    onClick={() => updateItemQuantity(item.orderItemId, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateItemQuantity(item.orderItemId, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="font-medium text-gray-700 w-20 text-right">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                                <button
                                  onClick={() => removeItemFromOrder(item.orderItemId)}
                                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-all"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">{formatCurrency(currentOrder.subtotal)}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Taxas:</span>
                            <span className="font-medium">{formatCurrency(currentOrder.tax)}</span>
                          </div>
                          <div className="flex justify-between items-center text-lg font-bold text-indigo-700 border-t border-gray-200 pt-2 mt-2">
                            <span>Total:</span>
                            <span>{formatCurrency(currentOrder.total)}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <button 
                            onClick={() => updateOrderStatus('preparing')}
                            disabled={currentOrder.status !== 'open'}
                            className={`py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                              currentOrder.status !== 'open' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                            }`}
                          >
                            <FiClock />
                            <span>Preparando</span>
                          </button>
                          <button 
                            onClick={() => updateOrderStatus('ready')}
                            disabled={currentOrder.status !== 'preparing'}
                            className={`py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                              currentOrder.status !== 'preparing' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                            }`}
                          >
                            <FiCheck />
                            <span>Pronto</span>
                          </button>
                          <button 
                            onClick={() => updateOrderStatus('delivered')}
                            disabled={currentOrder.status !== 'ready'}
                            className={`py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                              currentOrder.status !== 'ready' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-100 hover:bg-green-200 text-green-800'
                            }`}
                          >
                            <FiCheck />
                            <span>Entregue</span>
                          </button>
                          <button 
                            onClick={() => updateOrderStatus('closed')}
                            disabled={currentOrder.status !== 'delivered'}
                            className={`py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                              currentOrder.status !== 'delivered' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                            }`}
                          >
                            <FiDollarSign />
                            <span>Fechar</span>
                          </button>
                        </div>
                        
                        <div className="flex space-x-3 mt-4">
                          <button 
                            onClick={printOrder}
                            className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all flex items-center justify-center space-x-2"
                          >
                            <FiPrinter />
                            <span>Imprimir</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                          <FiShoppingBag className="text-indigo-600 text-2xl" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-700 mb-1">Nenhuma comanda ativa</h4>
                        <p className="text-gray-500 mb-4">Crie uma nova comanda para começar</p>
                        <button
                          onClick={createNewOrder}
                          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all shadow-md"
                        >
                          <FiPlus />
                          <span>Criar Nova Comanda</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Column */}
                <div>
                  {/* Menu */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                      <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <FiGrid className="text-indigo-600" />
                      </span>
                      Cardápio
                    </h3>
                    
                    {/* Menu Tabs */}
                    <div className="mb-6">
                      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                        {Object.keys(menu).map(category => (
                          <button
                            key={category}
                            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${
                              activeMenuTab === category ? 'bg-white shadow-md text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveMenuTab(category)}
                          >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                      {menu[activeMenuTab].map(item => (
                        <motion.div 
                          key={item.id}
                          whileHover={{ y: -2 }}
                          className="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-all cursor-pointer"
                          onClick={() => currentOrder && addItemToOrder(item)}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">{item.name}</h4>
                              {item.description && (
                                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                              )}
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-sm font-medium text-indigo-600">
                                  {formatCurrency(item.price)}
                                </span>
                                <div className="flex items-center">
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                    {item.rating} ★
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* QR Code */}
                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                      <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <FiGrid className="text-indigo-600" />
                      </span>
                      QR Code da Mesa
                    </h3>
                    <div className="flex flex-col items-center">
                      <div 
                        id={selectedTable.qrCodeId}
                        className="p-3 bg-white border-2 border-indigo-100 rounded-xl mb-2 shadow-sm hover:shadow-md transition-all"
                      >
                        <QRCodeSVG 
                          value={`${window.location.origin}/order?table=${selectedTable.name.replace('Mesa ', '')}&event=${encodeURIComponent(eventName)}`}
                          size={180}
                          level="H"
                          includeMargin={false}
                          fgColor="#4f46e5"
                        />
                      </div>
                      <p className="text-center text-gray-600 mb-6">
                        Os clientes podem escanear este código para fazer pedidos diretamente
                      </p>
                      <button 
                        onClick={() => downloadQRCode(selectedTable.qrCodeId)}
                        disabled={isLoading}
                        className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl transition-all disabled:opacity-70"
                      >
                        <FiDownload className="mr-2" />
                        {isLoading ? 'Baixando...' : 'Baixar QR Code'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Notification */}
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
            notification.type === 'error' ? 'bg-red-500' : 
            notification.type === 'info' ? 'bg-blue-500' : 'bg-emerald-500'
          }`}
        >
          {notification.message}
        </motion.div>
      )}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Gestão de Eventos</h1>
            <p className="text-gray-600 mt-1">Sistema premium para gerenciamento completo</p>
          </div>
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl transition-all shadow-md"
          >
            <FiGrid />
            <span>Voltar para Dashboard</span>
            <FiChevronRight />
          </button>
        </div>
        
        {/* Event Settings */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <FiGrid className="text-indigo-600" />
            </span>
            Configurações do Evento
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2 font-medium">Nome do Evento</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Ex: Aniversário Premium"
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => showNotification('Configurações salvas!')}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl transition-all shadow-md"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            <button
              className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all ${
                activeTab === 'mesas' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('mesas')}
            >
              <div className="flex items-center justify-center space-x-2">
                <FiUsers />
                <span>Mesas e Convidados</span>
              </div>
            </button>
            <button
              className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all ${
                activeTab === 'qrcodes' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('qrcodes')}
            >
              <div className="flex items-center justify-center space-x-2">
                <FiGrid />
                <span>QR Codes</span>
              </div>
            </button>
            <button
              className={`flex-1 py-3 px-4 font-medium rounded-lg transition-all ${
                activeTab === 'comandas' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('comandas')}
            >
              <div className="flex items-center justify-center space-x-2">
                <FiShoppingBag />
                <span>Comandas</span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === 'mesas' ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add Guests */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900 flex items-center">
                <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <FiUser className="text-indigo-600" />
                </span>
                Adicionar Convidados
              </h2>
              <div className="flex mb-6 shadow-sm">
                <input
                  type="text"
                  value={currentGuest}
                  onChange={(e) => setCurrentGuest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGuest()}
                  className="flex-1 p-4 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Nome do convidado"
                />
                <button
                  onClick={addGuest}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 rounded-r-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  <FiPlus size={22} />
                </button>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto pr-2">
                {guests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FiUser className="text-gray-400" size={28} />
                    </div>
                    <p className="text-gray-500 text-lg">Nenhum convidado adicionado</p>
                    <p className="text-gray-400 mt-1">Adicione nomes para começar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {guests.map(guest => (
                      <div key={guest.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center mr-3">
                            <FiUser className="text-indigo-600" />
                          </div>
                          <span className="font-medium text-gray-800">{guest.name}</span>
                        </div>
                        <button
                          onClick={() => removeGuest(guest.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={createTable}
                disabled={guests.length === 0}
                className={`mt-6 w-full py-4 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                  guests.length > 0 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FiUsers size={20} />
                <span>Criar Mesa com {guests.length} Convidado{guests.length !== 1 ? 's' : ''}</span>
                <FiChevronRight />
              </button>
            </div>

            {/* Tables */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900 flex items-center">
                <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <FiGrid className="text-indigo-600" />
                </span>
                Mesas do Evento
              </h2>
              {tables.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiUsers className="text-gray-400" size={28} />
                  </div>
                  <p className="text-gray-500 text-lg">Nenhuma mesa criada</p>
                  <p className="text-gray-400 mt-1">Adicione convidados e crie sua primeira mesa</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {tables.map(table => (
                    <div 
                      key={table.id} 
                      onClick={() => openTable(table)}
                      className="p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-indigo-700 group-hover:text-indigo-800">{table.name}</h3>
                        <span className="flex items-center text-sm bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full">
                          <FiUsers className="mr-1" />
                          {table.guests.length}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          table.activeOrder ? 'bg-emerald-400' : 'bg-gray-400'
                        } mr-2`}></div>
                        {table.activeOrder ? 'Comanda ativa' : 'Mesa disponível'}
                      </div>
                      <div className="mt-2 flex justify-end">
                        <span className="text-xs text-indigo-500 flex items-center">
                          Ver detalhes <FiChevronRight className="ml-1" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'qrcodes' ? (
          /* QR Codes Tab */
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <FiGrid className="text-indigo-600" />
              </span>
              QR Codes para Pedidos
            </h2>
            <div className="mb-8">
              <p className="text-gray-600 max-w-3xl">
                Cada QR Code abaixo é único para uma mesa específica. Quando escaneado, levará os clientes diretamente à página de pedidos daquela mesa. 
                Você pode baixar individualmente ou todos de uma vez.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {qrCodes.map(qr => (
                <div key={qr.id} className="flex flex-col items-center">
                  <div 
                    id={qr.id}
                    className="p-3 bg-white border-2 border-gray-100 rounded-xl mb-2 shadow-sm hover:shadow-md transition-all"
                  >
                    <QRCodeSVG 
                      value={qr.url}
                      size={120}
                      level="H"
                      includeMargin={false}
                      fgColor="#4f46e5"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Mesa {qr.tableNumber}</span>
                  <button 
                    onClick={() => downloadQRCode(qr.id)}
                    disabled={isLoading}
                    className="mt-1 text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <FiDownload className="mr-1" />
                    {isLoading ? 'Baixando...' : 'Baixar'}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button 
                onClick={downloadAllQRCodes}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-8 rounded-xl transition-all shadow-md disabled:opacity-70"
              >
                <FiDownload />
                <span>{isLoading ? 'Preparando arquivo...' : 'Baixar Todos os QR Codes (ZIP)'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Orders Tab */
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <FiShoppingBag className="text-indigo-600" />
              </span>
              Comandas
            </h2>
            
            {/* Order Filters */}
            <div className="mb-6">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    orderStatusFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setOrderStatusFilter('all')}
                >
                  Todas
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    orderStatusFilter === 'open' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                  onClick={() => setOrderStatusFilter('open')}
                >
                  Abertas
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    orderStatusFilter === 'preparing' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                  onClick={() => setOrderStatusFilter('preparing')}
                >
                  Preparando
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    orderStatusFilter === 'ready' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                  onClick={() => setOrderStatusFilter('ready')}
                >
                  Prontas
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    orderStatusFilter === 'delivered' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                  onClick={() => setOrderStatusFilter('delivered')}
                >
                  Entregues
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    orderStatusFilter === 'closed' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setOrderStatusFilter('closed')}
                >
                  Fechadas
                </button>
              </div>
            </div>
            
            {/* Orders List */}
            <div className="space-y-4">
              {orders.filter(order => 
                orderStatusFilter === 'all' || order.status === orderStatusFilter
              ).length > 0 ? (
                orders
                  .filter(order => orderStatusFilter === 'all' || order.status === orderStatusFilter)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map(order => {
                    const table = tables.find(t => t.id === order.tableId);
                    return (
                      <div 
                        key={order.id} 
                        className="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-all cursor-pointer"
                        onClick={() => {
                          if (table) {
                            openTable(table);
                          }
                        }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-gray-800">{order.tableName}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                          <span>{order.items.length} itens</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{new Date(order.createdAt).toLocaleString()}</span>
                          <span className="flex items-center">
                            Ver detalhes <FiChevronRight className="ml-1" />
                          </span>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiShoppingBag className="text-gray-400" size={28} />
                  </div>
                  <p className="text-gray-500 text-lg">Nenhuma comanda encontrada</p>
                  <p className="text-gray-400 mt-1">
                    {orderStatusFilter === 'all' 
                      ? 'Crie mesas e comece a adicionar pedidos' 
                      : `Nenhuma comanda com status "${getStatusText(orderStatusFilter)}"`}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterfaceEventos;