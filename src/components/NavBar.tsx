
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">LandingAI</div>
        <div className="flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
            Como Funciona
          </a>
          <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
            Preços
          </a>
          <Link to="/dashboard">
            <Button variant="outline" className="gap-2">
              <LogIn className="h-4 w-4" />
              Área do Cliente
            </Button>
          </Link>
          <Link to="/questionnaire">
            <Button className="bg-accent hover:bg-accent/90 transition-colors">
              Começar Agora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
