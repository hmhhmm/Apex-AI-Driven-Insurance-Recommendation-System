import { motion } from 'framer-motion'
import { useCartStore } from '../store/cartStore'
import { useState } from 'react'

const Purchase = () => {
  const { items, addItem, removeItem, total } = useCartStore()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const categories = [
    {
      id: 'health',
      name: 'Health Insurance',
      icon: '🏥',
      plans: [
        { id: 'health-essential', name: 'Essential', price: 199, features: ['Basic coverage', '$5,000 deductible', 'Emergency care'] },
        { id: 'health-standard', name: 'Standard', price: 299, features: ['Comprehensive', '$2,000 deductible', 'Dental & Vision', 'Prescription drugs'] },
        { id: 'health-premium', name: 'Premium', price: 399, features: ['Full coverage', '$500 deductible', 'All prescriptions', 'Mental health'] },
      ],
    },
    {
      id: 'auto',
      name: 'Auto Insurance',
      icon: '🚗',
      plans: [
        { id: 'auto-liability', name: 'Liability', price: 49, features: ['State minimum', 'Basic protection'] },
        { id: 'auto-comprehensive', name: 'Comprehensive', price: 89, features: ['Collision', 'Theft coverage', 'Glass protection'] },
        { id: 'auto-full', name: 'Full Coverage', price: 129, features: ['Everything', 'Roadside assistance', 'Rental car'] },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">Browse Insurance Plans</h1>
              <p className="text-gray-400">Select plans to build your custom bundle</p>
            </div>

            {categories.map((category) => (
              <section key={category.id} className="card">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                  <span className="text-3xl">{category.icon}</span>
                  {category.name}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {category.plans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ y: -4 }}
                      className="bg-zinc-950 rounded-xl p-6 border border-zinc-800 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50 transition"
                    >
                      <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                      <div className="text-3xl font-bold text-blue-400 mb-4">
                        ${plan.price}
                        <span className="text-sm text-gray-500 font-normal">/month</span>
                      </div>
                      
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-green-500">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => addItem({ ...plan, type: category.name })}
                        className="w-full btn-primary"
                      >
                        Add to Cart
                      </button>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Cart Sidebar (Desktop) */}
          <div className="hidden lg:block w-80">
            <div className="sticky top-24 card">
              <h3 className="text-xl font-bold mb-4 text-white">Your Cart</h3>
              
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                        <div>
                          <div className="font-semibold text-sm text-white">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.type}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white">${item.price}</span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-zinc-800 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-gray-300">Total</span>
                      <span className="text-2xl font-bold text-blue-400">${total}/mo</span>
                    </div>
                    <button className="w-full btn-primary">
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cart FAB (Mobile) */}
          {items.length > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="lg:hidden fixed bottom-20 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40"
            >
              <span className="text-2xl">🛒</span>
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                {items.length}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Purchase
