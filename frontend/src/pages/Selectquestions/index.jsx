import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash,
  Code,
  Type,
  ListChecks,
  ToggleLeft,
  Save,
  Eye,
  EyeOff,
  Terminal,
  HelpCircle,
  ChevronLeft,
  Play,
} from 'lucide-react';
import {
  createQuestion,
  deleteQuestion,
  getQuestionsBySphere,
  updateQuestion,
} from '../../services/api';

export default function SphereQuestionsAligned() {
  // --- STATE ---
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sphereId =
    searchParams.get('sphereId') ||
    localStorage.getItem('latestSphereId') ||
    '';
  const [questions, setQuestions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [activeType, setActiveType] = useState('MCQ');
  const [draft, setDraft] = useState({
    title: '',
    options: ['', '', '', ''],
    correctOption: 0,
    codeLanguage: 'javascript',
    starterCode: '// Write your code here...',
    boolAnswer: true,
    textAnswer: '',
  });

  // --- HANDLERS ---
  const mapApiQuestionToUi = (question) => ({
    id: question._id,
    type: question.type,
    title: question.questionText,
    options: question.options?.length ? question.options : ['', '', '', ''],
    correctOption:
      typeof question.correctAnswer === 'number' ? question.correctAnswer : 0,
    codeLanguage: question.codeLanguage || 'javascript',
    starterCode: question.starterCode || '// Write your code here...',
    boolAnswer:
      typeof question.correctAnswer === 'boolean'
        ? question.correctAnswer
        : true,
    textAnswer:
      typeof question.correctAnswer === 'string' ? question.correctAnswer : '',
  });

  const toApiPayload = () => {
    const payload = {
      sphereId,
      type: activeType,
      questionText: draft.title,
    };

    if (activeType === 'MCQ') {
      payload.options = draft.options;
      payload.correctAnswer = draft.correctOption;
    } else if (activeType === 'CODE') {
      payload.codeLanguage = draft.codeLanguage;
      payload.starterCode = draft.starterCode;
      payload.correctAnswer = draft.textAnswer || '';
    } else if (activeType === 'TEXT') {
      payload.correctAnswer = draft.textAnswer;
    } else if (activeType === 'BOOL') {
      payload.correctAnswer = draft.boolAnswer;
    }

    return payload;
  };

  const resetDraft = () => {
    setDraft({
      title: '',
      options: ['', '', '', ''],
      correctOption: 0,
      codeLanguage: 'javascript',
      starterCode: '// Write your code here...',
      boolAnswer: true,
      textAnswer: '',
    });
    setEditingId(null);
  };

  useEffect(() => {
    const loadQuestions = async () => {
      if (!sphereId) {
        setError('Missing sphereId in URL');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await getQuestionsBySphere(sphereId);
        setQuestions(data.map(mapApiQuestionToUi));
      } catch (apiError) {
        const message =
          apiError?.response?.data?.message || 'Failed to load questions';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [sphereId]);

  const handleAddQuestion = async () => {
    if (!draft.title.trim() || !sphereId) return;

    setError('');

    try {
      if (editingId) {
        const updated = await updateQuestion(editingId, toApiPayload());
        const uiQuestion = mapApiQuestionToUi(updated);
        setQuestions((prev) =>
          prev.map((item) => (item.id === editingId ? uiQuestion : item)),
        );
      } else {
        const created = await createQuestion(toApiPayload());
        setQuestions((prev) => [...prev, mapApiQuestionToUi(created)]);
      }

      resetDraft();
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || 'Failed to save question';
      setError(message);
    }
  };

  const removeQuestion = async (id) => {
    setError('');

    try {
      await deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      if (editingId === id) {
        resetDraft();
      }
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || 'Failed to delete question';
      setError(message);
    }
  };

  const startEditQuestion = (question) => {
    setActiveType(question.type);
    setEditingId(question.id);
    setDraft({
      title: question.title,
      options: question.options?.length ? question.options : ['', '', '', ''],
      correctOption: question.correctOption ?? 0,
      codeLanguage: question.codeLanguage || 'javascript',
      starterCode: question.starterCode || '// Write your code here...',
      boolAnswer:
        typeof question.boolAnswer === 'boolean' ? question.boolAnswer : true,
      textAnswer: question.textAnswer || '',
    });
  };

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);
  const updateOption = (index, value) => {
    const newOptions = [...draft.options];
    newOptions[index] = value;
    setDraft({ ...draft, options: newOptions });
  };

  const handleSaveProgress = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setError('');
      // Store current questions in localStorage as backup
      localStorage.setItem(
        `sphere_${sphereId}_questions`,
        JSON.stringify(questions),
      );
      // Show confirmation
      alert(`✓ Progress saved! ${questions.length} question(s) ready.`);
    }, 800);
  };

  const handleExitAndReady = () => {
    if (questions.length === 0) {
      setError('⚠ Add at least 1 question before starting');
      return;
    }

    // Store sphere data and navigate to sphere lobby
    const gameCode = localStorage.getItem('gameCode');
    localStorage.setItem(
      'sphereReady',
      JSON.stringify({
        sphereId,
        gameCode,
        questionCount: questions.length,
        readyTime: new Date().toISOString(),
      }),
    );

    navigate(`/dashboard/sphere/${sphereId}/lobby`);
  };

  const handleBack = () => {
    const confirmed = window.confirm(
      `Exit question editor? (${questions.length} questions saved)`,
    );
    if (confirmed) {
      navigate('/');
    }
  };

  return (
    <div className="h-screen w-full bg-[#FFFDF0] font-sans text-stone-900 flex overflow-hidden">
      {/* --- LEFT SIDEBAR --- */}
      <aside className="w-[350px] flex flex-col border-r-4 border-stone-200 border-dashed bg-white z-20 shadow-xl flex-shrink-0">
        {/* LEFT HEADER (h-20) */}
        <div className="h-20 px-6 border-b-4 border-stone-200 border-dashed flex items-center justify-between flex-shrink-0 bg-[#FFFDF0]">
          <h2 className="text-xl font-black uppercase tracking-tight italic">
            Quest Log
          </h2>
          <div className="bg-stone-900 text-yellow-400 text-[10px] font-black px-2 py-1 rounded shadow-sm">
            LVL {questions.length}
          </div>
        </div>

        {/* LEFT LIST (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-stone-50/50">
          {loading ? (
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Loading questions...
            </p>
          ) : null}
          {error ? (
            <p className="text-sm font-semibold text-red-600">{error}</p>
          ) : null}
          <AnimatePresence>
            {questions.length === 0 && (
              <div className="text-center py-12 opacity-50 border-2 border-dashed border-stone-300 rounded-xl">
                <p className="text-sm font-black text-stone-400 uppercase">
                  Log Empty
                </p>
              </div>
            )}

            {questions.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group relative bg-white border-2 border-stone-900 rounded-xl transition-all duration-200
                  ${expandedId === q.id ? 'shadow-[4px_4px_0px_0px_#facc15] -translate-y-1' : 'shadow-sm hover:shadow-md'}
                `}
              >
                {/* Header */}
                <div className="p-3 flex items-start gap-3">
                  <div className="bg-stone-100 border border-stone-900 w-6 h-6 flex items-center justify-center rounded font-mono text-[10px] font-black">
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 mb-1">
                      <TypeBadge type={q.type} />
                    </div>
                    <h4 className="font-bold text-xs line-clamp-1 leading-tight">
                      {q.title}
                    </h4>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => startEditQuestion(q)}
                      className="w-6 h-6 flex items-center justify-center border-2 border-stone-900 rounded bg-white hover:bg-blue-200 transition-colors text-[10px] font-black"
                    >
                      E
                    </button>
                    <button
                      onClick={() => toggleExpand(q.id)}
                      className={`w-6 h-6 flex items-center justify-center border-2 border-stone-900 rounded bg-white hover:bg-yellow-300 transition-colors ${expandedId === q.id ? 'bg-yellow-400' : ''}`}
                    >
                      {expandedId === q.id ? (
                        <EyeOff size={12} strokeWidth={2.5} />
                      ) : (
                        <Eye size={12} strokeWidth={2.5} />
                      )}
                    </button>
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className="w-6 h-6 flex items-center justify-center border-2 border-stone-900 rounded bg-white hover:bg-red-400 transition-colors"
                    >
                      <Trash size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedId === q.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t-2 border-stone-900 bg-stone-50 rounded-b-lg"
                    >
                      <div className="p-3 text-[10px] font-mono space-y-2 text-stone-600">
                        {q.type === 'MCQ' &&
                          q.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-2 ${i === q.correctOption ? 'text-green-700 font-bold' : ''}`}
                            >
                              <div
                                className={`w-1.5 h-1.5 border border-stone-900 rounded-full ${i === q.correctOption ? 'bg-green-500' : 'bg-white'}`}
                              ></div>
                              {opt || '...'}
                            </div>
                          ))}
                        {q.type === 'CODE' && (
                          <div className="bg-stone-900 text-yellow-400 p-2 rounded border border-stone-900">
                            {q.starterCode.substring(0, 40)}...
                          </div>
                        )}
                        {q.type === 'BOOL' && (
                          <div>
                            ANSWER: {q.boolAnswer.toString().toUpperCase()}
                          </div>
                        )}
                        {q.type === 'TEXT' && (
                          <div>ANSWER: {q.textAnswer || '...'}</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* LEFT FOOTER (h-20) */}
        <div className="h-20 px-4 border-t-4 border-stone-200 border-dashed bg-[#FFFDF0] flex items-center justify-center flex-shrink-0">
          <button
            onClick={handleSaveProgress}
            disabled={saving}
            className="w-full bg-stone-900 text-yellow-400 font-black text-xs py-3 rounded-xl shadow-[3px_3px_0px_0px_#facc15] hover:translate-y-0.5 hover:shadow-none active:translate-y-1 transition-all flex justify-center items-center gap-2 border-2 border-stone-900 disabled:opacity-60"
          >
            <Save size={16} strokeWidth={3} />{' '}
            {saving ? 'SAVING...' : 'SAVE PROGRESS'}
          </button>
        </div>
      </aside>

      {/* --- RIGHT SIDE: MAIN EDITOR --- */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#FFFDF0]">
        {/* RIGHT HEADER (h-20) */}
        {/* Matches Left Header Height exactly */}
        <div className="h-20 px-8 border-b-4 border-stone-200 border-dashed flex items-center justify-between flex-shrink-0 bg-[#FFFDF0]">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wide text-stone-600 hover:text-stone-900 border-2 border-stone-300 rounded-lg hover:border-stone-900 transition-all hover:bg-stone-50"
            >
              <ChevronLeft size={16} /> BACK
            </button>
            <div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tighter italic">
                LEVEL EDITOR
              </h1>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">
                Node #{questions.length + 1}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <TypeButton
              active={activeType === 'MCQ'}
              onClick={() => setActiveType('MCQ')}
              icon={ListChecks}
              label="MCQ"
            />
            <TypeButton
              active={activeType === 'CODE'}
              onClick={() => setActiveType('CODE')}
              icon={Code}
              label="CODE"
            />
            <TypeButton
              active={activeType === 'TEXT'}
              onClick={() => setActiveType('TEXT')}
              icon={Type}
              label="TEXT"
            />
            <TypeButton
              active={activeType === 'BOOL'}
              onClick={() => setActiveType('BOOL')}
              icon={ToggleLeft}
              label="BOOL"
            />
          </div>
        </div>

        {/* RIGHT FORM AREA */}
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Prompt */}
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-stone-400 mb-3 group-focus-within:text-stone-900 transition-colors">
                <HelpCircle size={16} /> Mission Objective
              </label>
              <textarea
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Enter the challenge prompt here..."
                rows="2"
                className="w-full bg-white text-xl font-black text-stone-900 placeholder-stone-300 border-4 border-stone-200 rounded-xl p-4 focus:border-stone-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] resize-none transition-all leading-tight"
              />
            </div>

            {/* --- EDITOR INPUTS --- */}
            <div className="space-y-6">
              {/* MCQ */}
              {activeType === 'MCQ' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {draft.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <input
                          type="radio"
                          name="correctOpt"
                          checked={draft.correctOption === i}
                          onChange={() =>
                            setDraft({ ...draft, correctOption: i })
                          }
                          className="peer sr-only"
                        />
                        <div className="w-8 h-8 rounded-lg border-2 border-stone-900 bg-white flex items-center justify-center font-black text-xs cursor-pointer peer-checked:bg-stone-900 peer-checked:text-yellow-400 hover:bg-stone-100 transition-all shadow-[2px_2px_0px_0px_rgba(28,25,23,0.2)]">
                          {String.fromCharCode(65 + i)}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                        className={`w-full py-3 px-4 rounded-xl border-2 font-bold text-sm focus:outline-none transition-all shadow-sm
                                            ${
                                              draft.correctOption === i
                                                ? 'border-stone-900 bg-yellow-50 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] -translate-y-0.5'
                                                : 'border-stone-200 bg-white hover:border-stone-400'
                                            }`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* CODE */}
              {activeType === 'CODE' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                      <Terminal size={14} /> Starter Environment
                    </label>
                    <select
                      value={draft.codeLanguage}
                      onChange={(e) =>
                        setDraft({ ...draft, codeLanguage: e.target.value })
                      }
                      className="bg-white border-2 border-stone-900 text-[10px] font-black rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]"
                    >
                      <option value="javascript">JS (NODE)</option>
                      <option value="python">PYTHON</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border-4 border-stone-900 shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]">
                    <textarea
                      value={draft.starterCode}
                      onChange={(e) =>
                        setDraft({ ...draft, starterCode: e.target.value })
                      }
                      className="w-full h-48 bg-stone-900 text-yellow-400 font-mono text-sm p-4 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* BOOL (Fixed Size) */}
              {activeType === 'BOOL' && (
                <div className="flex gap-4 max-w-sm">
                  <button
                    onClick={() => setDraft({ ...draft, boolAnswer: true })}
                    className={`flex-1 py-3 rounded-xl border-2 font-black text-sm transition-all
                                ${draft.boolAnswer === true ? 'bg-stone-900 text-white border-stone-900 shadow-[3px_3px_0px_0px_#facc15] -translate-y-1' : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400'}`}
                  >
                    TRUE
                  </button>
                  <button
                    onClick={() => setDraft({ ...draft, boolAnswer: false })}
                    className={`flex-1 py-3 rounded-xl border-2 font-black text-sm transition-all
                                ${draft.boolAnswer === false ? 'bg-stone-900 text-white border-stone-900 shadow-[3px_3px_0px_0px_#facc15] -translate-y-1' : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400'}`}
                  >
                    FALSE
                  </button>
                </div>
              )}

              {activeType === 'TEXT' && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                    Correct Text Answer
                  </label>
                  <input
                    type="text"
                    value={draft.textAnswer}
                    onChange={(e) =>
                      setDraft({ ...draft, textAnswer: e.target.value })
                    }
                    placeholder="Expected answer"
                    className="w-full py-3 px-4 rounded-xl border-2 font-bold text-sm focus:outline-none transition-all shadow-sm border-stone-200 bg-white hover:border-stone-400"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT FOOTER (h-20) */}
        <div className="h-20 px-8 border-t-4 border-stone-200 border-dashed bg-[#FFFDF0] flex justify-between items-center flex-shrink-0 z-20">
          <button
            onClick={resetDraft}
            className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
          >
            {editingId ? 'Cancel Edit' : 'Reset Draft'}
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSaveProgress}
              disabled={saving}
              className="bg-stone-200 border-2 border-stone-900 text-stone-900 font-black text-sm px-6 py-3 rounded-xl shadow-[3px_3px_0px_0px_rgba(28,25,23,0.3)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(28,25,23,0.3)] active:translate-y-0 active:shadow-none transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} strokeWidth={3} />{' '}
              {saving ? 'Saving...' : 'Save Progress'}
            </button>
            <button
              onClick={handleAddQuestion}
              className="bg-yellow-400 border-2 border-stone-900 text-stone-900 font-black text-sm px-8 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] active:translate-y-0 active:shadow-none transition-all flex items-center gap-2"
            >
              <Plus size={18} strokeWidth={4} />{' '}
              {editingId ? 'UPDATE LOG' : 'ADD TO LOG'}
            </button>
            <button
              onClick={handleExitAndReady}
              className="bg-green-400 border-2 border-stone-900 text-stone-900 font-black text-sm px-6 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] active:translate-y-0 active:shadow-none transition-all flex items-center gap-2"
            >
              <Play size={18} strokeWidth={4} /> READY TO START
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB COMPONENTS ---

function TypeButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all
            ${
              active
                ? 'bg-stone-900 border-stone-900 text-yellow-400 shadow-[2px_2px_0px_0px_rgba(28,25,23,0.5)] -translate-y-0.5'
                : 'bg-white border-stone-200 text-stone-400 hover:border-stone-400 hover:text-stone-600'
            }`}
    >
      <Icon size={14} strokeWidth={active ? 3 : 2} />
      <span className="text-[10px] font-black tracking-widest">{label}</span>
    </button>
  );
}

function TypeBadge({ type }) {
  const styles = {
    MCQ: 'bg-blue-100 text-blue-800 border-blue-800',
    CODE: 'bg-purple-100 text-purple-800 border-purple-800',
    TEXT: 'bg-stone-200 text-stone-800 border-stone-800',
    BOOL: 'bg-orange-100 text-orange-800 border-orange-800',
  };
  return (
    <span
      className={`font-black border rounded px-1 text-[8px] ${styles[type] || 'bg-gray-100'}`}
    >
      {type}
    </span>
  );
}
