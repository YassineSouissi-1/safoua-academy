import React, { useState, useEffect } from "react";
import { Search, Volume2, BookOpen, Globe } from "lucide-react";
import axios from "axios";

function Dictionary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchLanguage, setSearchLanguage] = useState("english"); // 'english' or 'french'

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError("Veuillez entrer un mot à chercher");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/dictionary/translate`,
        {
          params: {
            word: searchTerm.trim(),
            language: searchLanguage
          }
        }
      );

      if (response.data.success) {
        setResults(response.data);
      } else {
        setError(response.data.message || "Impossible de traduire ce mot. Veuillez essayer un autre.");
        setResults(null);
      }
    } catch (err) {
      console.error("Erreur lors de la traduction:", err);
      setError("Une erreur est survenue. Veuillez vérifier votre connexion internet.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const speakWord = (arabic) => {
    if (!("speechSynthesis" in window)) {
      alert("La synthèse vocale n'est pas supportée dans votre navigateur");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(arabic);
    utterance.lang = "ar-SA";
    utterance.rate = 0.8;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6 md:p-12 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-4">
            Dictionnaire <span className="text-emerald-600">Arabe</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Cherchez un mot en anglais ou en français pour obtenir sa traduction en arabe, 
            son synonyme et sa prononciation.
          </p>
        </header>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Language Toggle */}
            <div className="flex gap-4 justify-center mb-6">
              <button
                type="button"
                onClick={() => {
                  setSearchLanguage("english");
                  setResults(null);
                  setSearchTerm("");
                }}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  searchLanguage === "english"
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchLanguage("french");
                  setResults(null);
                  setSearchTerm("");
                }}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  searchLanguage === "french"
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                🇫🇷 Français
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-4 text-emerald-600" size={28} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  searchLanguage === "english"
                    ? "Tapez un mot en anglais... (ex: peace, hello)"
                    : "Tapez un mot en français... (ex: paix, bonjour)"
                }
                className="w-full pl-14 pr-6 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-lg transition-colors"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 text-lg shadow-lg"
            >
              {loading ? "Recherche en cours..." : "🔍 Chercher"}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl font-bold text-center">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {results && (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
            {/* Arabic Word - Main Result */}
            <div className="text-center">
              <h2 className="text-sm text-slate-500 font-bold uppercase tracking-wide mb-2">
                Traduction en Arabe
              </h2>
              <div className="flex items-center justify-center gap-6">
                <p className="text-6xl font-black text-emerald-600">
                  {results.arabic}
                </p>
                <button
                  onClick={() => speakWord(results.arabic)}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-600 p-4 rounded-full transition-all transform hover:scale-110 shadow-lg"
                  title="Écoutez la prononciation"
                >
                  <Volume2 size={28} />
                </button>
              </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

            {/* Pronunciation */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-xl border border-emerald-200">
              <h3 className="text-sm text-slate-600 font-bold uppercase tracking-wide mb-2">
                📢 Prononciation
              </h3>
              <p className="text-2xl font-bold text-emerald-700 italic">
                [{results.pronunciation || "Prononciation générée"}]
              </p>
            </div>

            {/* Meaning */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-sm text-slate-600 font-bold uppercase tracking-wide mb-2">
                📖 Sens / Définition
              </h3>
              <p className="text-lg text-slate-800 leading-relaxed">
                {results.meaning || "Traduction trouvée via Google Translate"}
              </p>
            </div>

            {/* Source Info */}
            <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-200">
              <p className="flex items-center justify-center gap-2">
                <Globe size={16} />
                Traduction en ligne - Safoua Academy
              </p>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {!results && !loading && !error && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Globe size={48} className="mx-auto text-emerald-600 mb-4" />
            <p className="text-slate-600 text-lg">
              Commencez votre recherche en entrant un mot ci-dessus pour découvrir 
              sa traduction en arabe, son synonyme et sa prononciation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dictionary;
