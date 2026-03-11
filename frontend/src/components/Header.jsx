import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, Phone, Menu, FileText } from 'lucide-react'
import { useState } from 'react'
import logoOab from '../assets/logo oab.png'

function Header() {
  const { isAuthenticated, advogado, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)

  const handleLogout = async () => { await logout(); navigate('/login') }
  const primeiroNome = advogado?.nome_completo?.split(' ')[0]?.toUpperCase()

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Barra superior azul escuro */}
      <div className="bg-blue-900 text-white py-2 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Central de atendimento: 0800 123 4060</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo + Título - ao clicar vai ao dashboard quando logado */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center border border-blue-200 shadow">
              <img src={logoOab} alt="Logo OAB" className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900">OAB - Portal de Negociações</h1>
              <p className="text-xs sm:text-sm text-gray-600">Simples, Rápido e Seguro</p>
            </div>
          </Link>

          {/* Nav desktop */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  <i className="fi fi-rr-earnings text-lg align-middle" aria-hidden />
                  Minhas oportunidades
                </Link>
                <Link
                  to="/meus-acordos"
                  className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  Meus acordos
                </Link>
                <div className="flex items-center space-x-2">
                  <User className="w-6 h-6 text-blue-600" />
                  <span className="text-sm text-gray-700">Olá, {primeiroNome}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 px-3 py-1 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sair</span>
                </button>
              </div>
            </nav>
          )}

          {/* Nav mobile */}
          {isAuthenticated && (
            <div className="md:hidden flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">{primeiroNome}</span>
              </div>
              <button
                onClick={() => setMenuAberto(!menuAberto)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          )}
        </div>

          {/* Menu mobile expandido */}
          {isAuthenticated && menuAberto && (
            <div className="md:hidden mt-3 pt-3 border-t border-gray-200 space-y-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-700 hover:text-primary py-2 w-full"
                onClick={() => setMenuAberto(false)}
              >
                <i className="fi fi-rr-earnings text-base align-middle" aria-hidden />
                <span className="text-sm font-medium">Minhas oportunidades</span>
              </Link>
              <Link
                to="/meus-acordos"
                className="flex items-center gap-2 text-gray-700 hover:text-primary py-2 w-full"
                onClick={() => setMenuAberto(false)}
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Meus acordos</span>
              </Link>
              <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 py-2 w-full"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
