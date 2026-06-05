import React, { useState } from "react";
import Lesson1 from "./Lesson1";
import Lesson2 from "./Lesson2";

const Module2Exercises = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const exercises = [
    {
      id: 1,
      question: "Combien de versets a la sourate An-Nas?",
      options: ["5", "6", "7", "8"],
      correctAnswer: "6",
      explanation: "La sourate An-Nas contient 6 versets et est la 114ème sourate du Coran."
    },
    {
      id: 2,
      question: "Combien de versets a la sourate Al-Falaq?",
      options: ["4", "5", "6", "7"],
      correctAnswer: "5",
      explanation: "La sourate Al-Falaq contient 5 versets et est la 113ème sourate du Coran."
    },
    {
      id: 3,
      question: "Laquelle des sourates suivantes est la 113ème?",
      options: ["An-Nas", "Al-Falaq", "Al-Ikhlas", "Al-Masad"],
      correctAnswer: "Al-Falaq",
      explanation: "Al-Falaq (L'Aube) est la 113ème sourate. An-Nas (Les Hommes) est la 114ème."
    },
    {
      id: 4,
      question: "Comment s'appelle les deux sourates de protection?",
      options: ["Alif-Lam-Meem", "Mu'awwidhatain", "Qaul", "Tawheed"],
      correctAnswer: "Mu'awwidhatain",
      explanation: "Les deux sourates de protection (An-Nas et Al-Falaq) sont appelées Mu'awwidhatain."
    },
    {
      id: 5,
      question: "Quel mot signifie 'le tentateur qui se dérobe' dans An-Nas?",
      options: ["Al-Jinnah", "Al-Waswas Al-Khanas", "An-Naffath", "Al-Hasid"],
      correctAnswer: "Al-Waswas Al-Khanas",
      explanation: "Al-Waswas Al-Khanas signifie le tentateur qui se dérobe ou qui fait des suggestions malveillantes."
    },
    {
      id: 6,
      question: "Que signifie 'Rabb Al-Falaq'?",
      options: ["Le Roi", "Le Seigneur de l'aube", "Le Créateur", "Le Protecteur"],
      correctAnswer: "Le Seigneur de l'aube",
      explanation: "Rabb Al-Falaq signifie littéralement 'le Seigneur de l'aube', symbolisant la lumière qui chasse l'obscurité."
    },
    {
      id: 7,
      question: "Quel est le principal sujet de protection dans Al-Falaq?",
      options: ["Les tentations internes", "Les maux externes (création, envie, sorcellerie)", "Le manque de foi", "L'ignorance"],
      correctAnswer: "Les maux externes (création, envie, sorcellerie)",
      explanation: "Al-Falaq protège contre les maux externes: la création, la nuit, la sorcellerie, et l'envie."
    },
    {
      id: 8,
      question: "Pourquoi ces sourates sont-elles appelées 'Sourates de Protection'?",
      options: [
        "Elles sont longues",
        "Elles protègent contre tous les maux, internes et externes",
        "Elles sont les plus difficiles à mémoriser",
        "Elles sont révélées à Médine"
      ],
      correctAnswer: "Elles protègent contre tous les maux, internes et externes",
      explanation: "An-Nas et Al-Falaq ensemble offrent une protection spirituelle complète: An-Nas contre les maux internes, Al-Falaq contre les maux externes."
    }
  ];

  const handleAnswerChange = (exerciseId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [exerciseId]: answer
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    exercises.forEach(exercise => {
      if (answers[exercise.id] === exercise.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const percentage = Math.round((score / exercises.length) * 100);

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-8">
        <h2 className="text-2xl font-black text-purple-900 mb-2">📋 Exercices - Module 2</h2>
        <p className="text-slate-700 mb-6">Testez votre compréhension des sourates An-Nas et Al-Falaq</p>

        <div className="space-y-6">
          {exercises.map((exercise, index) => (
            <div key={exercise.id} className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="bg-purple-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 mb-4">{exercise.question}</p>
                  
                  <div className="space-y-3 mb-4">
                    {exercise.options.map((option, optIdx) => (
                      <label key={optIdx} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`exercise-${exercise.id}`}
                          value={option}
                          checked={answers[exercise.id] === option}
                          onChange={(e) => handleAnswerChange(exercise.id, e.target.value)}
                          disabled={submitted}
                          className="w-4 h-4"
                        />
                        <span className={`text-slate-700 ${answers[exercise.id] === option ? 'font-bold' : ''}`}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>

                  {submitted && (
                    <div className={`rounded-lg p-3 ${
                      answers[exercise.id] === exercise.correctAnswer
                        ? 'bg-green-100 border border-green-300'
                        : 'bg-red-100 border border-red-300'
                    }`}>
                      <p className={`text-sm font-bold mb-1 ${
                        answers[exercise.id] === exercise.correctAnswer ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {answers[exercise.id] === exercise.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                      </p>
                      <p className="text-sm text-slate-700">{exercise.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={submitted}
            className={`flex-1 py-3 px-6 font-bold rounded-lg transition-all ${
              submitted
                ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {submitted ? 'Déjà soumis' : 'Soumettre les réponses'}
          </button>
          
          {submitted && (
            <button
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
              className="flex-1 py-3 px-6 font-bold rounded-lg bg-slate-600 text-white hover:bg-slate-700 transition-all"
            >
              Recommencer
            </button>
          )}
        </div>

        {submitted && (
          <div className={`mt-8 rounded-lg p-6 ${
            percentage >= 70 ? 'bg-green-100 border-2 border-green-300' : 'bg-amber-100 border-2 border-amber-300'
          }`}>
            <h3 className={`font-bold text-2xl mb-2 ${
              percentage >= 70 ? 'text-green-900' : 'text-amber-900'
            }`}>
              Votre Score: {score}/{exercises.length} ({percentage}%)
            </h3>
            <p className={`text-sm ${percentage >= 70 ? 'text-green-800' : 'text-amber-800'}`}>
              {percentage >= 70 
                ? 'Excellent! Vous avez bien compris les deux sourates de protection.' 
                : 'Bon effort! Continuez à réviser les leçons.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Module2() {
  const [activeTab, setActiveTab] = useState("lessons");
  const [activeLessonId, setActiveLessonId] = useState(1);

  const lessons = [
    { id: 1, title: "Sourate An-Nas", component: Lesson1 },
    { id: 2, title: "Sourate Al-Falaq", component: Lesson2 }
  ];

  const ActiveLessonComponent = lessons.find(l => l.id === activeLessonId)?.component;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-black mb-2">Module 2: Sourates An-Nas et Al-Falaq</h1>
        <p className="text-purple-100">Les deux sourates de protection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-3">
          <h3 className="font-black text-slate-900 text-lg">📚 Les Leçons</h3>
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => {
                setActiveLessonId(lesson.id);
                setActiveTab("lessons");
              }}
              className={`w-full text-left p-4 rounded-lg font-bold transition-all ${
                activeLessonId === lesson.id
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span className="text-lg mr-2">📖</span>
              {lesson.title}
            </button>
          ))}

          <button
            onClick={() => setActiveTab("exercises")}
            className={`w-full text-left p-4 rounded-lg font-bold transition-all ${
              activeTab === "exercises"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span className="text-lg mr-2">✏️</span>
            Exercices & Quiz
          </button>
        </div>

        <div className="lg:col-span-3">
          {activeTab === "lessons" && ActiveLessonComponent && (
            <div className="animate-fadeIn">
              <ActiveLessonComponent />
            </div>
          )}

          {activeTab === "exercises" && (
            <div className="animate-fadeIn">
              <Module2Exercises />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
