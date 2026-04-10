import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Pricing() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // --- DYNAMIC STATE ---
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);

  // --- FETCH FROM DATABASE ---
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/settings');
        setPlans(response.data.pricingPlans);
      } catch (error) {
        console.error("Failed to fetch pricing plans:", error);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePlanClick = async (plan) => {
    if (!user) {
      alert("Please log in or sign up to select a plan!");
      navigate('/login');
      return;
    }

    if (plan.name === 'Free') {
      navigate('/dashboard');
      return;
    }

    if (plan.name === 'Enterprise') {
      window.location.href = "mailto:sales@omnicode.ai?subject=Enterprise Inquiry";
      return;
    }

    setProcessingPlan(plan.name);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Failed to load payment gateway. Please check your internet connection.');
        setProcessingPlan(null);
        return;
      }

      const token = localStorage.getItem('omnicode_token');
      const headers = { Authorization: `Bearer ${token}` };

      const orderResponse = await axios.post(
        'http://localhost:5000/api/payment/create-order', 
        { amount: parseInt(plan.price) }, 
        { headers }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'Omnicode AI',
        description: `${plan.name} Plan Upgrade`,
        order_id: orderResponse.data.id,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(
              'http://localhost:5000/api/payment/verify-payment',
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amountPaid: parseInt(plan.price) 
              },
              { headers }
            );

            updateUser({ 
              credits: verifyResponse.data.newCreditBalance,
              plan: verifyResponse.data.newPlan 
            });
            
            alert(`Welcome to the ${verifyResponse.data.newPlan} Plan! Your credits have been updated.`);
            navigate('/dashboard');
            
          } catch (err) {
            console.error(err);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.fullName || '',
          email: user.email || '',
        },
        theme: { color: '#4f46e5' },
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response){
        alert("Payment failed! Reason: " + response.error.description);
      });

      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert('Could not initiate payment. Please try again.');
    } finally {
      setProcessingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-24 bg-slate-950 border-t border-white/5 relative overflow-hidden min-h-screen">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-lg text-slate-400 font-medium leading-relaxed">Start for free and scale as you grow. No hidden fees, just pure productivity.</p>
        </motion.div>

        {loadingPlans ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={48} className="animate-spin text-indigo-500" />
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {plans.map((plan, i) => (
              <motion.div 
                key={plan.id || i} 
                variants={cardVariants} 
                className={`relative p-8 lg:p-10 rounded-[2.5rem] flex flex-col h-full transition-all duration-300 backdrop-blur-xl ${
                  plan.premium 
                    ? 'bg-gradient-to-b from-indigo-900/40 to-slate-900/80 text-white shadow-2xl shadow-indigo-500/20 border border-indigo-500/30 md:-mt-8 md:mb-8' 
                    : 'bg-white/5 text-white border border-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:border-white/20 hover:-translate-y-1'
                }`}
              >
                
                {plan.premium && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                    <Star size={12} className="fill-white" /> Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-black mb-3">{plan.name}</h3>
                  <p className={`text-sm font-medium leading-relaxed ${plan.premium ? 'text-indigo-200' : 'text-slate-400'}`}>{plan.description}</p>
                </div>

                <div className="mb-8 pb-8 border-b border-white/10">
                  <div className="flex items-baseline gap-1">
                    {plan.price !== 'Custom' && <span className="text-3xl font-bold text-slate-500">₹</span>}
                    <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className={`font-bold ml-1 ${plan.premium ? 'text-indigo-300' : 'text-slate-500'}`}>/mo</span>}
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {/* Safely split features by newline and render */}
                  {plan.features?.split('\n').filter(f => f.trim() !== '').map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className={`flex-shrink-0 mt-0.5 ${plan.premium ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className={`font-medium text-sm leading-relaxed ${plan.premium ? 'text-indigo-50' : 'text-slate-300'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handlePlanClick(plan)}
                  disabled={processingPlan === plan.name}
                  className={`w-full py-4 rounded-xl font-black text-[15px] flex justify-center items-center gap-2 transition-all active:scale-[0.98] outline-none focus:ring-4 focus:ring-indigo-500/30
                  ${plan.premium 
                    ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/5'
                  }`}
                >
                  {processingPlan === plan.name ? (
                    <><Sparkles size={18} className="animate-spin" /> Processing...</>
                  ) : (
                    plan.buttonText || "Choose Plan"
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }} className="text-center mt-12 text-slate-500 text-sm font-medium">
          Payments are securely processed by Razorpay.
        </motion.p>
      </div>
    </section>
  );
}