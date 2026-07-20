import React from "react";
import { motion } from "framer-motion";
import { BiSolidLeftArrowSquare } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

function Pricing() {
  const navigate = useNavigate();

  const subscriptionPlans = [
    {
      id: "free",
      name: "Starter",
      price: 0,
      credits: 100,
      description: "Ideal for exploring AI website generation capabilities.",
      features: [
        "Access to AI Website Generator",
        "1 Generated Project",
        "Community Support",
        "Standard Speed Generation",
        "Basic Customizations",
      ],
      popular: false,
      buttonText: "Get Started Free",
    },
    {
      id: "pro",
      name: "Pro Developer",
      price: 49,
      credits: 500,
      description: "Designed for professionals and small teams building multiple sites.",
      features: [
        "500 Generation & Update Credits",
        "Up to 10 Live Hosted Sites",
        "Instant Live Deployment",
        "Priority AI Processing",
        "Full HTML & CSS Source Export",
        "Custom Domain Mapping",
      ],
      popular: true,
      buttonText: "Upgrade to Pro",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 149,
      credits: 1400,
      description: "Full suite for agencies requiring high volume generation.",
      features: [
        "1,400 Generation & Update Credits",
        "Unlimited Live Hosted Sites",
        "Dedicated High-Speed Queue",
        "24/7 Premium Priority Support",
        "Team Collaboration & Analytics",
        "White-label Export Capabilities",
      ],
      popular: false,
      buttonText: "Upgrade to Enterprise",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen pb-20">
      {/* Top Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full border-b border-zinc-800 bg-zinc-950/60 backdrop-blur-md mb-12"
      >
        <div
          className="max-w-6xl mx-auto flex items-center gap-3 cursor-pointer px-6 py-4 group"
          onClick={() => navigate("/dashboard")}
        >
          <BiSolidLeftArrowSquare
            size={26}
            className="text-zinc-400 group-hover:text-white transition"
          />
          <span className="text-sm font-semibold tracking-wide text-zinc-300 group-hover:text-white transition">
            Back to Dashboard
          </span>
        </div>
      </motion.div>

      {/* Header Heading */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Flexible & Transparent <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Pricing</span>
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg">
          Purchase generation credits as you need. No hidden fees or recurring subscriptions.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {subscriptionPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className={`rounded-2xl p-8 flex flex-col justify-between border ${
              plan.popular
                ? "border-amber-400 bg-zinc-900/90 shadow-2xl shadow-amber-500/10 relative"
                : "border-zinc-800 bg-zinc-950/60"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-black font-extrabold text-xs tracking-wider px-4 py-1 rounded-full uppercase shadow-md">
                MOST POPULAR
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
              <p className="text-zinc-400 text-xs sm:text-sm mb-6 min-h-[40px]">
                {plan.description}
              </p>

              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">${plan.price}</span>
                <span className="text-zinc-400 text-sm font-medium">
                  / {plan.credits} Credits
                </span>
              </div>

              <hr className="border-zinc-800 mb-6" />

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300">
                    <FaCheck size={12} className="text-amber-400 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className={`w-full py-3 rounded-xl font-bold text-sm transition cursor-pointer shadow-lg ${
                plan.popular
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:brightness-110 shadow-yellow-500/20"
                  : "bg-zinc-800 hover:bg-zinc-700 text-white"
              }`}
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
