import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 glass bg-white/80 dark:bg-surface-900/80 border-b border-surface-200 dark:border-surface-700"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-glow">
                <ApperIcon name="CheckSquare" className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gradient">TaskFlow</h1>
                <p className="text-xs md:text-sm text-surface-600 dark:text-surface-400 hidden sm:block">Organize • Track • Complete</p>
              </div>
            </motion.div>
            
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 md:p-3 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-200 shadow-neu-light dark:shadow-neu-dark"
            >
              <ApperIcon 
                name={darkMode ? "Sun" : "Moon"} 
                className="w-5 h-5 md:w-6 md:h-6 text-surface-600 dark:text-surface-400" 
              />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="py-8 md:py-16 lg:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6"
            >
              Master Your <span className="text-gradient">Productivity</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg md:text-xl lg:text-2xl text-surface-600 dark:text-surface-400 leading-relaxed"
            >
              Transform your workflow with intelligent task management that adapts to your style
            </motion.p>
          </div>

          {/* Feature Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-16 max-w-3xl mx-auto"
          >
            {[
              { icon: "Target", label: "Goal Tracking", desc: "Set & achieve targets" },
              { icon: "Users", label: "Team Sync", desc: "Collaborate seamlessly" },
              { icon: "BarChart3", label: "Analytics", desc: "Track your progress" }
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                className="text-center p-4 md:p-6 rounded-2xl bg-white/60 dark:bg-surface-800/60 glass border border-surface-200 dark:border-surface-700 hover:shadow-glow transition-all duration-300"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-card">
                  <ApperIcon name={feature.icon} className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">{feature.label}</h3>
                <p className="text-xs md:text-sm text-surface-600 dark:text-surface-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Main Feature Section */}
      <MainFeature />

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="py-8 md:py-12 border-t border-surface-200 dark:border-surface-700 bg-white/40 dark:bg-surface-900/40 glass"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-surface-900 dark:text-surface-100">TaskFlow</span>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400 text-center md:text-right">
              Crafted with passion for productivity enthusiasts
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home