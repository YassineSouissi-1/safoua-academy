import React, { useState } from "react";
import Lesson1 from "./Lesson1";
import Lesson2 from "./Lesson2";
import Lesson3 from "./Lesson3";
import Lesson4 from "./Lesson4";
import Exercises from "./Exercises";

const lessons = [
  { id: 1, title: "Les Principes de Base", component: Lesson1 },
  { id: 2, title: "Organisation de l'Emploi du Temps", component: Lesson2 },
  { id: 3, title: "Méthodes de Répétition Efficaces", component: Lesson3 },
  { id: 4, title: "Surmonter les Défis", component: Lesson4 }
];

export default function Module1() {
  const [activeTab, setActiveTab] = useState("lessons");
  const [activeLessonId, setActiveLessonId] = useState(1);

  const ActiveLessonComponent = lessons.find(l => l.id === activeLessonId)?.component;
  const ExercisesComponent = Exercises;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-black mb-2">Module 1: Techniques de Mémorisation</h1>
        <p className="text-purple-100">Apprenez les principes fondamentaux et les techniques pour réussir votre Hifz</p>
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
              <ExercisesComponent />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
