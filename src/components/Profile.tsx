import { useAuth } from '../contexts/AuthContext'
import { 
  LogOut, 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  FileQuestion, 
  ChevronDown, 
  ExternalLink,
  Book
} from 'lucide-react'
import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "How do I start trading?",
    answer: "To start trading, first ensure your account is funded. Then, navigate to the Markets section to view available stocks, or go to the Trading view to place orders."
  },
  {
    question: "How do I deposit funds?",
    answer: "Currently, this is a paper trading platform using Alpaca's paper trading API. No real money is involved in transactions."
  },
  {
    question: "What is paper trading?",
    answer: "Paper trading is a simulated trading process where you can practice trading without using real money. It's perfect for learning and testing strategies."
  },
  {
    question: "How do I view my orders?",
    answer: "You can view all your orders in the Orders section, accessible from the bottom navigation bar. It shows both open and completed orders."
  }
]

const Profile = () => {
  const { logout } = useAuth()
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="py-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      
      {/* Profile Card */}
      <div className="bg-white rounded-lg p-4 shadow space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl text-blue-600">A</span>
          </div>
          <div>
            <h3 className="font-semibold">Admin User</h3>
            <p className="text-gray-600">admin@gmail.com</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Help & Support Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <HelpCircle className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold">Help & Support</h3>
          </div>
        </div>

        {/* Support Links */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium mb-3">Quick Support Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a 
              href="mailto:support@muratrade.com"
              className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Mail size={20} className="text-gray-600" />
              <div>
                <div className="font-medium">Email Support</div>
                <div className="text-sm text-gray-600">Get help via email</div>
              </div>
              <ExternalLink size={16} className="ml-auto text-gray-400" />
            </a>

            <a 
              href="#"
              className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <MessageCircle size={20} className="text-gray-600" />
              <div>
                <div className="font-medium">Live Chat</div>
                <div className="text-sm text-gray-600">Chat with support</div>
              </div>
              <ExternalLink size={16} className="ml-auto text-gray-400" />
            </a>

            <a 
              href="#"
              className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Book size={20} className="text-gray-600" />
              <div>
                <div className="font-medium">Documentation</div>
                <div className="text-sm text-gray-600">Read our guides</div>
              </div>
              <ExternalLink size={16} className="ml-auto text-gray-400" />
            </a>

            <a 
              href="#"
              className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FileQuestion size={20} className="text-gray-600" />
              <div>
                <div className="font-medium">Knowledge Base</div>
                <div className="text-sm text-gray-600">Browse articles</div>
              </div>
              <ExternalLink size={16} className="ml-auto text-gray-400" />
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="p-4">
          <h4 className="font-medium mb-3">Frequently Asked Questions</h4>
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{item.question}</span>
                  <ChevronDown 
                    size={20}
                    className={`text-gray-500 transition-transform ${
                      openFaqIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile