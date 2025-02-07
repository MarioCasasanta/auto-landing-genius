
import React from "react";
import NavBar from "@/components/NavBar";
import LandingPageQuestionnaire from "@/components/LandingPageQuestionnaire";

const Questionnaire = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="pt-20">
        <LandingPageQuestionnaire />
      </main>
    </div>
  );
};

export default Questionnaire;
