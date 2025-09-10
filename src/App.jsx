import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Header from './components/Header/Header';
import PriceTicker from './components/PriceTicker/PriceTicker';
import Footer from './components/Footer/Footer'; // Add this import
import ErrorBoundary from './components/Common/ErrorBoundary';

// Pages
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Home from './pages/Home/Home';
import Markets from './pages/Markets/Markets';
import MarketDetail from './pages/Markets/MarketDetail';
import News from './pages/News/News';
import CoinDetails from './pages/CoinDetails/CoinDetails';
import Opinion from './pages/Opinion/Opinion';
import OpinionDetail from './pages/Opinion/OpinionDetail';
import FollowUp from './pages/FollowUp/FollowUp';
import FollowUpDetail from './pages/FollowUp/FollowUpDetail';
import Predictions from './pages/Predictions/Predictions';
import PredictionDetail from './pages/Predictions/PredictionDetail';
import Prices from './pages/Prices/Prices';
import Learn from './pages/Learn/Learn';
import Guides from './pages/Guides/Guides';
import Analysis from './pages/Analysis/Analysis';
import Tools from './pages/Tools/Tools';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';

// Styles
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  useEffect(() => {
    // Remove loading spinner
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.style.display = 'none';
    }
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    duration: 0.3
  };

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <div className="min-h-screen bg-white text-black">
              {/* Header */}
              <Header />
              
              {/* Price Ticker */}
              <PriceTicker />
              
              {/* Main Content */}
              <main className="relative">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <motion.div
                          key="home"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Home />
                        </motion.div>
                      } 
                    />
                    
                    {/* News Routes */}
                    <Route 
                      path="/news" 
                      element={
                        <motion.div
                          key="news"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <News />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/news/category/:category" 
                      element={
                        <motion.div
                          key="news-category"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <News />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/news/:slug" 
                      element={
                        <motion.div
                          key="news-article"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <News />
                        </motion.div>
                      } 
                    />
                    
                    {/* Opinion Routes */}
                    <Route 
                      path="/opinion" 
                      element={
                        <motion.div
                          key="opinion"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Opinion />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/opinion/:articleId" 
                      element={
                        <motion.div
                          key="opinion-detail"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <OpinionDetail />
                        </motion.div>
                      } 
                    />
                    
                    {/* Follow-up Routes */}
                    <Route 
                      path="/follow-up" 
                      element={
                        <motion.div
                          key="follow-up"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <FollowUp />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/follow-up/:articleId" 
                      element={
                        <motion.div
                          key="follow-up-detail"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <FollowUpDetail />
                        </motion.div>
                      } 
                    />
                    
                    {/* Markets Routes */}
                    <Route 
                      path="/markets" 
                      element={
                        <motion.div
                          key="markets"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Markets />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/markets/:articleId" 
                      element={
                        <motion.div
                          key="market-detail"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <MarketDetail />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/markets/:section" 
                      element={
                        <motion.div
                          key="markets-section"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Markets />
                        </motion.div>
                      } 
                    />
                    
                    {/* Predictions Routes */}
                    <Route 
                      path="/predictions" 
                      element={
                        <motion.div
                          key="predictions"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Predictions />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/predictions/:articleId" 
                      element={
                        <motion.div
                          key="prediction-detail"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <PredictionDetail />
                        </motion.div>
                      } 
                    />
                    
                    {/* Trading & Analysis Pages */}
                    <Route 
                      path="/prices" 
                      element={
                        <motion.div
                          key="prices"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Prices />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/analysis" 
                      element={
                        <motion.div
                          key="analysis"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Analysis />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/tools" 
                      element={
                        <motion.div
                          key="tools"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Tools />
                        </motion.div>
                      } 
                    />
                    
                    {/* Educational Pages */}
                    <Route 
                      path="/learn" 
                      element={
                        <motion.div
                          key="learn"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Learn />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/guides" 
                      element={
                        <motion.div
                          key="guides"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Guides />
                        </motion.div>
                      } 
                    />
                    
                    {/* Company Pages */}
                    <Route
                      path="/terms"
                      element={
                        <motion.div
                          key="terms"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Terms />
                        </motion.div>
                      }
                    />

                    <Route 
                      path="/privacy-policy" 
                      element={
                        <motion.div
                          key="privacy-policy"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <PrivacyPolicy />
                        </motion.div>
                      } 
                    />

                    <Route 
                      path="/about" 
                      element={
                        <motion.div
                          key="about"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <About />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/contact" 
                      element={
                        <motion.div
                          key="contact"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <Contact />
                        </motion.div>
                      } 
                    />
                    
                    {/* Coin Details */}
                    <Route 
                      path="/coin/:coinId" 
                      element={
                        <motion.div
                          key="coin-details"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <CoinDetails />
                        </motion.div>
                      } 
                    />
                    
                    {/* Legacy/Alternative Routes */}
                    <Route path="/category/:category" element={<News />} />
                    <Route path="/tag/:tag" element={<News />} />
                    
                    {/* 404 Route */}
                    <Route 
                      path="*" 
                      element={
                        <motion.div
                          key="not-found"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={pageTransition}
                        >
                          <NotFound />
                        </motion.div>
                      } 
                    />
                  </Routes>
                </AnimatePresence>
              </main>
              
              {/* Use Footer Component */}
              <Footer />
            </div>
            
            {/* Toast notifications */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#000000',
                  border: '1px solid #d1d5db',
                },
                success: {
                  iconTheme: {
                    primary: '#059669',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#dc2626',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </Router>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;