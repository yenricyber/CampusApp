import React, { useState } from 'react';
import { Course } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  courses,
  onSelectCourse,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.professor.toLowerCase().includes(query.toLowerCase()) ||
      c.classroom.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 flex flex-col gap-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <span className="material-symbols-outlined text-primary-container text-[22px]">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar materia, aula, profesor o código..."
            autoFocus
            className="flex-1 text-sm font-body outline-none text-slate-800 placeholder-slate-400"
          />
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 font-body">
              No se encontraron resultados para "{query}".
            </div>
          ) : (
            filtered.map((course) => (
              <div
                key={course.id}
                onClick={() => {
                  onSelectCourse(course);
                  onClose();
                }}
                className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                      {course.code}
                    </span>
                    <h4 className="font-headline text-[13px] font-bold text-slate-900">
                      {course.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 font-body mt-0.5">
                    {course.professor} • {course.classroom}
                  </p>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400">
                  chevron_right
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
