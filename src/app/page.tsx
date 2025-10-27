"use client";
import { useState, useEffect } from 'react';
import Tiles from '../components/hometiles';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { KeyboardArrowDown } from '@mui/icons-material';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  
  const scrollToModels = () => {
    document.getElementById('models-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  return (
    <div className="w-full">
      <motion.section 
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <Image 
                src="/graph.svg" 
                width={80} 
                height={80} 
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24" 
                alt="HyperViz Logo" 
              />
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent ml-4 font-blackOps">
                HyperViz
              </h1>
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl lg:text-3xl text-gray-700 mb-4 font-light"
          >
            Interactive Machine Learning Visualization Platform
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6">
              Explore, understand, and visualize machine learning algorithms with our comprehensive suite of interactive tools. 
              From clustering to neural networks, dive deep into the world of ML with beautiful, real-time visualizations.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-gray-800 mb-2">Interactive Learning</h3>
                <p className="text-gray-600 text-sm">Hands-on exploration of ML algorithms</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-gray-800 mb-2">Real-time Visualization</h3>
                <p className="text-gray-600 text-sm">See algorithms in action with live updates</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="font-semibold text-gray-800 mb-2">Educational Focus</h3>
                <p className="text-gray-600 text-sm">Learn through visual understanding</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col items-center"
          >
            <p className="text-gray-500 mb-4 text-sm">Explore Our Models</p>
            <motion.button
              onClick={scrollToModels}
              className="group bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <KeyboardArrowDown className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300" fontSize="large" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      <section id="models-section" className="w-full py-16 sm:py-20 bg-white">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 font-blackOps">
              Machine Learning Models
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive collection of ML algorithms. Each model comes with interactive visualizations, 
              parameter tuning, and detailed explanations to enhance your learning experience.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <Tiles modelName={"kmeans"} name={"KMeans"} picture={"/kmeans_thumbnail.png"}/>
            <Tiles modelName={"linear"} name={"Linear Regression"} picture={"lr_thumbnail.png"}/>
            <Tiles modelName={"DBSCAN"} name={"DBSCAN"} picture={"dbscan_thumbnail.png"}/>
            <Tiles modelName={"NaiveBayes"} name={"Naive Bayes"} picture={"nb_thumbnail.jpg"}/>
            <Tiles modelName={"neural"} name={"Neural networks"} picture={"nn_thumbnail.png"} />
            <Tiles modelName={"Qlearning"} name={"Reinforcement Learning"} picture={"rl_thumbnail.png"} />
            <Tiles modelName={"PCA"} name={"PCA"} picture={"pca_thumbnail.png"}/>
            <Tiles modelName={"SOM"} name={"SOM"} picture={"som_thumbnail.png"}/>
            <Tiles modelName={"DecisionTree"} name={"Decision Tree"} picture={"dt_thumbnail.png"} />
          </motion.div>
        </div>
      </section>
    </div>
  );
}