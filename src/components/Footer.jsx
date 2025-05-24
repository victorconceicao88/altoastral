import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiLock,
  FiMail,
  FiCalendar,
  FiInstagram,
  FiFacebook,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import WavePattern from '../assets/altoastral-foto.jpeg';
import EventImage1 from '../assets/eventos/evento1.jpg';
import EventImage2 from '../assets/eventos/evento2.jpg';
import EventImage3 from '../assets/eventos/evento3.jpg';

const UltraFooter = () => {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  const [activeEvent, setActiveEvent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const events = [
    {
      id: 1,
      title: "Eventos Corporativos",
      description: "Soluções completas para seu evento empresarial com menu personalizado e ambiente exclusivo",
      image: EventImage1,
      features: [
        "Coffee breaks premium",
        "Estrutura completa",
        "Equipe especializada",
        "Personalização total"
      ]
    },
    {
      id: 2,
      title: "Celebrações Especiais",
      description: "Transforme seus momentos importantes em memórias inesquecíveis com nossa gastronomia",
      image: EventImage2,
      features: [
        "Buffet completo",
        "Decoração temática",
        "Sobremesas exclusivas",
        "Coordenação de evento"
      ]
    },
    {
      id: 3,
      title: "Experiências Privadas",
      description: "Jantares íntimos e experiências gastronômicas personalizadas em ambiente exclusivo",
      image: EventImage3,
      features: [
        "Menu degustação",
        "Chef exclusivo",
        "Harmonização premium",
        "Atendimento VIP"
      ]
    }
  ];

  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setActiveEvent((prev) => (prev + 1) % events.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovering, events.length]);

  return (
    <footer className="bg-[#918e89] text-white relative overflow-hidden">
      {/* Container da onda responsivo */}
      <div className="w-full h-16 md:h-24 lg:h-32 -mt-px overflow-hidden">
        <img 
          src={WavePattern} 
          alt=""
          className="w-full h-full object-cover object-bottom scale-105"
          style={{ transform: 'scaleX(1.05) translateY(1px)' }}
        />
      </div>

      {/* Espaçamento seguro para mobile */}
      <div className="pt-8 md:pt-12 lg:pt-16"></div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 sm:px-6 pb-8 md:pb-12">
        {/* Destaque premium para eventos - Totalmente reformulado */}
        <div 
          className="relative rounded-xl md:rounded-2xl mb-10 md:mb-16 mx-2 sm:mx-0 shadow-2xl overflow-hidden border border-[#b8b4ae]/20"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Background gradient com overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#7a6d5d]/90 to-[#5a5148]/90 z-0"></div>
          
          {/* Imagens dos eventos em carrossel */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={events[activeEvent].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <img 
                  src={events[activeEvent].image} 
                  alt={events[activeEvent].title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/40"></div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Conteúdo sobreposto */}
          <div className="relative z-10 p-6 md:p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              {/* Texto e informações */}
              <div className="flex-1 space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="inline-flex items-center text-[#d5c8b6] px-4 py-2 rounded-full border border-[#d5c8b6]/50 mb-4">
                    <FiCalendar className="text-xl text-[#d5c8b6] mr-2" />
                    <span className="font-sans-serif text-[#d5c8b6] font-medium">Eventos Exclusivos</span>
                  </div>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`title-${events[activeEvent].id}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold font-sans-serif text-[#fffaf1] leading-tight">
                      {events[activeEvent].title}
                    </h3>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`desc-${events[activeEvent].id}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <p className="text-lg md:text-xl text-[#fffaf1] mt-2 md:mt-4 max-w-2xl">
                      {events[activeEvent].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AnimatePresence>
                    {events[activeEvent].features.map((feature, index) => (
                      <motion.div
                        key={`feature-${events[activeEvent].id}-${index}`}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + (index * 0.1) }}
                        className="flex items-center"
                      >
                        <div className="bg-[#d5c8b6]/40 p-1 rounded-full mr-3">
                          <FiCheck className="text-[#d5c8b6] text-sm" />
                        </div>
                        <span className="text-[[#fffaf1]] text-sm md:text-base">{feature}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Controles e CTA */}
              <div className="w-full lg:w-auto flex flex-col items-start lg:items-end space-y-6">
                {/* Indicadores do carrossel */}
                <div className="flex space-x-2">
                  {events.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveEvent(index)}
                      className={`w-3 h-3 rounded-full transition-all ${activeEvent === index ? 'bg-[#d5c8b6] w-6' : 'bg-white/30'}`}
                      aria-label={`Mostrar evento ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Botão CTA */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <a
                    href="https://wa.me/351282038830"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#d5c8b6] text-  px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold flex items-center transition-all duration-300 shadow-lg group"
                  >
                    <span className=" font-sans-serif text-black md:text-lg font- mr-3">Saber Mais</span>
                    <FiArrowRight className="text-black transition-transform group-hover:translate-x-1" />
                  </a>
                </motion.div>

                <p className=" font-sans-serif text-[#fffaf1]/80 text-sm md:text-base text-right hidden lg:block">
                  Entre em contato para orçamentos personalizados
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 text-[#fffaf1] px-2 sm:px-0">
          {/* Branding e contato */}
          <div className="space-y-6 md:space-y-8">
            <div className="text-center md:text-left">
              <h3 className=" font-sans-serif text-3xl md:text-4xl font-bold  tracking-tight text-[[#fffaf1]]">Alto Astral</h3>
              <p className="font-sans-serif text-[#d1cfcc] text-base md:text-lg mt-1 md:mt-2">Experiências Gastronômicas Memoráveis</p>
            </div>
            
            <div className="space-y-4 md:space-y-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3">
                <div className="bg-[#f4df86]/20 p-2 rounded-lg flex-shrink-0">
                  <FiMapPin className="text-xl text-[#f4df86]" />
                </div>
                <a 
                  href="https://www.google.com/maps?q=Rua+Agostinho+Da+Silva+Lote+20,+Loja+2,+8500-826+Portimão,+Portugal,+Urb.+Horta+De+São+Pedro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-sans-serif text-[[#fffaf1]] leading-relaxed hover:text-white transition-colors"
                >
                  Rua Agostinho Da Silva Lote 20, Loja 2<br />
                  8500-826 Portimão, Portugal<br />
                  Urb. Horta De São Pedro
                </a>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <div className="bg-[#f4df86]/20 p-2 rounded-lg">
                  <FiPhone className="text-xl text-[#f4df86]" />
                </div>
                <a href="tel:+351282038830" className="hover:text-white transition-colors text-base md:text-lg">(+351) 282 038 830</a>
              </div>
            </div>
          </div>

          {/* Horário - centralizado em mobile */}
          <div className="flex justify-center">
            <div className="bg-[#a09b94]/90 border border-[#b8b4ae]/30 rounded-xl md:rounded-2xl p-6 md:p-8 w-full max-w-xs shadow-xl">
              <div className="bg-[#f4df86]/20 w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 border border-[#f4df86]/30">
                <FiClock className="text-2xl md:text-3xl text-[#f4df86]" />
              </div>
              <h4 className="text-xl md:text-2xl font-sans-serif font-semibold mb-3 md:mb-4 text-center text-[#f8f5f0]">Horário</h4>
              <div className="text-center space-y-1 md:space-y-2">
                <p className="font-sans-serif font-medium text-base md:text-lg">8:30 - 20:00</p>
                <p className=" font-sans-serif text-[#d1cfcc] text-sm md:text-base">Segunda a Sábado</p>
              </div>
            </div>
          </div>

          {/* Redes sociais */}
          <div className="space-y-6 md:space-y-8">
            <h4 className="text-lg md:text-xl font-semibold uppercase tracking-wider border-b border-[#b8b4ae]/40 pb-2 md:pb-3 text-center md:text-left text-[#fffaf1]">Conecte-se</h4>
            <div className="flex justify-center md:justify-start gap-4 md:gap-5">
              <motion.a 
                href="#" 
                whileHover={{ y: -3 }}
                className="bg-gradient-to-br from-[#f09433] to-[#bc1888] w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
              >
                <FiInstagram className="text-xl md:text-2xl" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -3 }}
                className="bg-[#3b5998] w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
              >
                <FiFacebook className="text-xl md:text-2xl" />
              </motion.a>
            </div>

            {!isLoggedIn && (
              <div className="pt-4 md:pt-6 flex justify-center md:justify-start">
                <Link
                  to="/login"
                  className="inline-flex items-center border-2 border-[#b8b4ae]/40 hover:border-[#f4df86] px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl hover:text-[#f4df86] transition-all duration-300 group bg-[#a09b94]/20"
                >
                  <FiLock className="mr-2 md:mr-3 text-lg md:text-xl" />
                  <span className="font-medium text-sm md:text-base">Acesso Exclusivo</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-[#b8b4ae]/30 mt-12 md:mt-16 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#d1cfcc] text-sm md:text-base text-center md:text-left">
              © {new Date().getFullYear()} <span className="text-[#fffaf1]">Alto Astral</span>. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UltraFooter;