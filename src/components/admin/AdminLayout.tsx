
import { Link, Outlet } from "react-router-dom";
import {
  Users,
  Layout,
  FileTemplate,
  Files,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">Painel Admin</h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link to="/admin/users" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 mr-3" />
              Usuários
            </Link>
            <Link to="/admin/landing-pages" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Layout className="w-5 h-5 mr-3" />
              Landing Pages
            </Link>
            <Link to="/admin/templates" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <FileTemplate className="w-5 h-5 mr-3" />
              Templates
            </Link>
            <Link to="/admin/swipe-files" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Files className="w-5 h-5 mr-3" />
              Swipe Files
            </Link>
            <Link to="/admin/subscriptions" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <CreditCard className="w-5 h-5 mr-3" />
              Assinaturas
            </Link>
            <Link to="/admin/settings" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 mr-3" />
              Configurações
            </Link>
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
