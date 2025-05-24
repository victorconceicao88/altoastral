import { motion, AnimatePresence } from 'framer-motion'
import { GiBrazil, GiCoffeeCup, GiPieSlice, GiMeal } from 'react-icons/gi'
import confetti from 'canvas-confetti'
import React from "react"

const WelcomeModal = ({ onClose }) => {
  // Efeito de confete ao abrir o modal
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e6be44', '#b0aca6', '#ffffff']
    })
  }

  // Animação personalizada
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-transparent backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        onAnimationComplete={triggerConfetti}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ 
            scale: 1, 
            y: 0, 
            opacity: 1,
            transition: { 
              type: "spring", 
              damping: 10, 
              stiffness: 100 
            }
          }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-[#e6be44]/20 relative"
        >
          {/* Efeito de brilho */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#e6be44]/10 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#b0aca6]/10 rounded-full filter blur-3xl"></div>
          </div>

          {/* Cabeçalho premium */}
          <div className="bg-gradient-to-r from-[#e6be44] to-[#d8b23d] p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-10"></div>
            <motion.h2 
              className="text-3xl font-bold text-black flex items-center justify-center gap-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <GiBrazil className="text-black" size={28} />
              Bem-vindo ao Alto Astral
            </motion.h2>
            <p className="text-black/80 mt-1">Sua viagem aos sabores do Brasil começa aqui</p>
          </div>
          
          {/* Corpo do modal */}
          <div className="p-6 relative">
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Item 1 */}
              <motion.div 
                className="flex items-start bg-[#ffffff]/5 p-4 rounded-xl border border-[#ffffff]/10 backdrop-blur-sm"
                variants={itemVariants}
              >
                <div className="bg-[#e6be44] p-2 rounded-lg mr-4 flex-shrink-0">
                  <GiPieSlice className="text-black" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Pastel de Feira</h3>
                  <p className="text-[#b0aca6] text-sm">Servidos diariamente a partir das 15h</p>
                </div>
              </motion.div>

              {/* Item 2 */}
              <motion.div 
                className="flex items-start bg-[#ffffff]/5 p-4 rounded-xl border border-[#ffffff]/10 backdrop-blur-sm"
                variants={itemVariants}
              >
                <div className="bg-[#e6be44] p-2 rounded-lg mr-4 flex-shrink-0">
                  <GiCoffeeCup className="text-black" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Especialidades</h3>
                  <p className="text-[#b0aca6] text-sm">Pastéis disponíveis o dia inteiro aos sábados</p>
                </div>
              </motion.div>

              {/* Item 3 */}
              <motion.div 
                className="flex items-start bg-[#ffffff]/5 p-4 rounded-xl border border-[#ffffff]/10 backdrop-blur-sm"
                variants={itemVariants}
              >
                <div className="bg-[#e6be44] p-2 rounded-lg mr-4 flex-shrink-0">
                  <GiMeal className="text-black" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Feijoada Astral</h3>
                  <p className="text-[#b0aca6] text-sm">Servida exclusivamente às sextas-feiras</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Rodapé */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-[#e6be44] to-[#d8b23d] text-black hover:from-[#d8b23d] hover:to-[#c9a437] font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[#e6be44]/30"
              >
                Explorar Cardápio
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default WelcomeModal

