import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiMapPin, FiPhone, FiClock, FiLock, FiCalendar,
  FiInstagram, FiFacebook, FiArrowRight, FiCheck, FiShoppingBag
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import evento1 from '../assets/evento1.jpg';
import altoastralFoto from '../assets/altoastral-foto.jpeg';
import salgadosDocesFoto from '../assets/salgados-doces.jpg'; // Certifique-se de que esta imagem existe

const UltraFooter = () => {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  const [activeContentIndex, setActiveContentIndex] = useState(0); // 0 for events, 1 for orders
  const [isHovering, setIsHovering] = useState(false);

  // Conteúdos dinâmicos para eventos e encomendas
  const contents = [
    {
      id: 'events',
      type: 'eventos',
      label: 'Eventos Exclusivos',
      icon: FiCalendar,
      title: "Ambiente Acolhedor para Eventos",
      description: "Oferecemos um serviço completo para tornar seu evento ainda mais especial. Nosso buffet conta com um espaço acolhedor, bem estruturado e preparado para receber festas, eventos corporativos e confraternizações com conforto e elegância.",
      image: evento1,
      features: [
        "Espaço versátil para eventos",
        "Ambiente climatizado e organizado",
        "Ideal para confraternizações e celebrações",
        "Equipe pronta para atender"
      ],
      ctaText: "Saber Mais sobre Eventos",
      whatsappMessage: "Olá, gostaria de obter mais informações sobre os eventos."
    },
    {
      id: 'orders',
      type: 'encomendas',
      label: 'Encomendas Personalizadas',
      icon: FiShoppingBag,
      title: "Salgados e Doces Fresquinhos para sua Festa!",
      description: "Desfrute da nossa variedade de salgados e doces artesanais, feitos com ingredientes frescos e muito carinho. Perfeitos para aniversários, reuniões ou para adoçar o seu dia. Faça sua encomenda e surpreenda-se com o sabor e a qualidade!",
      image: salgadosDocesFoto,
      features: [
        "Variedade de salgados e doces",
        "Ingredientes frescos e de qualidade",
        "Opções personalizadas para seu evento",
        "Entrega e retirada facilitadas"
      ],
      ctaText: "Encomendar Agora",
      whatsappMessage: "Olá, gostaria de fazer uma encomenda de salgados/doces."
    }
  ];

  // Efeito para alternar o conteúdo automaticamente quando não estiver com o mouse em cima
  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setActiveContentIndex((prev) => (prev + 1) % contents.length);
      }, 8000); // Alterna a cada 8 segundos
      return () => clearInterval(interval);
    }
  }, [isHovering, contents.length]);

  const CurrentIcon = contents[activeContentIndex].icon; // Seleciona o ícone dinamicamente

  return (
    <footer className="bg-[#918e89] text-white relative overflow-hidden">
      {/* Top image section - completely clean without any effects */}
      <div className="w-full h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 -mt-px overflow-hidden">
        <img
          src={altoastralFoto}
          alt="Alto Astral"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 pb-6 sm:pb-8 md:pb-10 lg:pb-12">
        {/* Dynamic content slider for Events and Orders - now responsive for all devices */}
        <div
          className="relative rounded-lg sm:rounded-xl md:rounded-2xl mb-8 sm:mb-10 md:mb-12 lg:mb-16 mx-0 shadow-lg sm:shadow-xl md:shadow-2xl overflow-hidden border border-[#b8b4ae]/20"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#7a6d5d]/90 to-[#5a5148]/90 z-0"></div>

          <div className="absolute inset-0 overflow-hidden z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={contents[activeContentIndex].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                <img
                  src={contents[activeContentIndex].image}
                  alt={contents[activeContentIndex].title}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40"></div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4 sm:gap-6 md:gap-8">
              <div className="flex-1 space-y-4 sm:space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 1 }}
                >
                  <div className="inline-flex items-center text-[#d5c8b6] px-3 py-1 sm:px-4 sm:py-2 rounded-full border border-[#d5c8b6]/50 mb-2 sm:mb-3 md:mb-4">
                    <CurrentIcon className="text-lg sm:text-xl text-[#d5c8b6] mr-2" />
                    <span className="font-sans-serif text-[#d5c8b6] text-sm sm:text-base font-medium">{contents[activeContentIndex].label}</span>
                  </div>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`title-${contents[activeContentIndex].id}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 1.2 }}
                  >
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-sans-serif text-[#fffaf1] leading-tight">
                      {contents[activeContentIndex].title}
                    </h3>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`desc-${contents[activeContentIndex].id}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 1.4, delay: 0.2 }}
                  >
                    <p className="text-base sm:text-lg md:text-xl text-[#fffaf1] mt-1 sm:mt-2 md:mt-3 lg:mt-4 max-w-2xl">
                      {contents[activeContentIndex].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-4 sm:mt-5 md:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <AnimatePresence>
                    {contents[activeContentIndex].features.map((feature, index) => (
                      <motion.div
                        key={`feature-${contents[activeContentIndex].id}-${index}`}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                        className="flex items-start sm:items-center"
                      >
                        <div className="bg-[#d5c8b6]/40 p-1 rounded-full mr-2 sm:mr-3 mt-0.5 sm:mt-0">
                          <FiCheck className="text-[#d5c8b6] text-xs sm:text-sm" />
                        </div>
                        <span className="text-[#fffaf1] text-xs sm:text-sm md:text-base">{feature}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="w-full lg:w-auto flex flex-col items-start lg:items-end space-y-4 sm:space-y-5 md:space-y-6 mt-4 sm:mt-0">
                <div className="flex space-x-2 self-center lg:self-auto">
                  {contents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveContentIndex(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${activeContentIndex === index ? 'bg-[#d5c8b6] w-4 sm:w-6' : 'bg-white/30'}`}
                      aria-label={`Mostrar conteúdo ${index + 1}`}
                    />
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-full sm:w-auto"
                >
                  <a
                    href={`https://wa.me/351282038830?text=${encodeURIComponent(contents[activeContentIndex].whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#d5c8b6] text-black px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl font-bold flex items-center justify-center sm:justify-start transition-all duration-300 shadow-md sm:shadow-lg group w-full"
                  >
                    <span className="font-sans-serif text-sm sm:text-base md:text-lg mr-2 sm:mr-3">{contents[activeContentIndex].ctaText}</span>
                    <FiArrowRight className="text-black transition-transform group-hover:translate-x-1" />
                  </a>
                </motion.div>
                <p className="font-sans-serif text-[#fffaf1]/80 text-xs sm:text-sm md:text-base text-center lg:text-right">
                  Entre em contato para {contents[activeContentIndex].type === 'eventos' ? 'orçamentos personalizados' : 'solicitar seu pedido'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 text-[#fffaf1] px-2 sm:px-0">
          {/* Brand info */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 order-1">
            <div className="text-center sm:text-left">
              <h3 className="font-sans-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#fffaf1]">Alto Astral</h3>
              <p className="font-sans-serif text-[#d1cfcc] text-sm sm:text-base md:text-lg mt-1 sm:mt-2">Experiências Gastronômicas Memoráveis</p>
            </div>

            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
                <div className="bg-[#f4df86]/20 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <FiMapPin className="text-lg sm:text-xl text-[#f4df86]" />
                </div>
                <a
                  href="https://www.google.com/maps/place/Rua+Agostinho+Da+Silva+Lote+20,+Loja+2,+8500-826+Portim%C3%A3o,+Portugal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans-serif text-[#fffaf1] text-sm sm:text-base leading-relaxed hover:text-white transition-colors"
                >
                  Rua Agostinho Da Silva Lote 20, Loja 2<br />
                  8500-826 Portimão, Portugal<br />
                  Urb. Horta De São Pedro
                </a>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <div className="bg-[#f4df86]/20 p-1.5 sm:p-2 rounded-lg">
                  <FiPhone className="text-lg sm:text-xl text-[#f4df86]" />
                </div>
                <a href="tel:+351282038830" className="hover:text-white transition-colors text-sm sm:text-base md:text-lg">(+351) 282 038 830</a>
              </div>
            </div>
          </div>

          {/* Opening hours */}
          <div className="flex justify-center order-3 lg:order-2">
            <div className="bg-[#a09b94]/90 border border-[#b8b4ae]/30 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 w-full max-w-xs sm:max-w-sm shadow-lg sm:shadow-xl">
              <div className="bg-[#f4df86]/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-5 lg:mb-6 border border-[#f4df86]/30">
                <FiClock className="text-xl sm:text-2xl md:text-3xl text-[#f4df86]" />
              </div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-sans-serif font-semibold mb-2 sm:mb-3 md:mb-4 text-center text-[#f8f5f0]">Horário</h4>
              <div className="text-center space-y-1 sm:space-y-2">
                <p className="font-sans-serif font-medium text-sm sm:text-base md:text-lg">8:30 - 20:00</p>
                <p className="font-sans-serif text-[#d1cfcc] text-xs sm:text-sm md:text-base">Segunda a Sábado</p>
              </div>
            </div>
          </div>

          {/* Social media and Admin Login */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 order-2 lg:order-3">
            <h4 className="text-base sm:text-lg md:text-xl font-semibold uppercase tracking-wider border-b border-[#b8b4ae]/40 pb-2 sm:pb-3 text-center sm:text-left text-[#fffaf1]">Conecte-se</h4>
            <div className="flex justify-center sm:justify-start gap-3 sm:gap-4 md:gap-5">
              <motion.a
                href="https://www.instagram.com/altoastralsnackbar?igsh=MXUzMHVmamx6MDFvbA=="
                whileHover={{ y: -3 }}
                className="bg-gradient-to-br from-[#f09433] to-[#bc1888] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-md sm:rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-md sm:shadow-lg hover:shadow-xl transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiInstagram className="text-lg sm:text-xl md:text-2xl" />
              </motion.a>

              <motion.a
                href="https://www.facebook.com/p/Alto-Astral-Snack-Bar-100083351294242/"
                whileHover={{ y: -3 }}
                className="bg-[#3b5998] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-md sm:rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-md sm:shadow-lg hover:shadow-xl transition-all"
                target='_blank'
                rel="noopener noreferrer"
              >
                <FiFacebook className="text-lg sm:text-xl md:text-2xl" />
              </motion.a>
            </div>

            {!isLoggedIn && (
              <div className="pt-3 sm:pt-4 md:pt-5 lg:pt-6 flex justify-center sm:justify-start">
                <Link
                  to="/login"
                  className="inline-flex items-center border-2 border-[#b8b4ae]/40 hover:border-[#f4df86] px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-md sm:rounded-lg md:rounded-xl hover:text-[#f4df86] transition-all duration-300 group bg-[#a09b94]/20"
                >
                  <FiLock className="mr-2 text-base sm:text-lg md:text-xl" />
                  <span className="font-medium text-xs sm:text-sm md:text-base">Acesso Exclusivo</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-[#b8b4ae]/30 mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16 pt-4 sm:pt-5 md:pt-6 lg:pt-7 xl:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-4">
            <p className="text-[#d1cfcc] text-xs sm:text-sm md:text-base text-center sm:text-left">
              © {new Date().getFullYear()} <span className="text-[#fffaf1]">Alto Astral</span>. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UltraFooter;