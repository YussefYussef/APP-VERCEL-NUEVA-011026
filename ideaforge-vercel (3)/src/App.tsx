import React, { useState, useEffect } from 'react';
import TechText from './components/TechText';
import {
  Sparkles,
  Zap,
  Package,
  Laptop,
  Layers,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  FileText,
  HelpCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  ChevronRight,
  RotateCcw,
  X,
  Target,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  SlidersHorizontal,
  FolderHeart,
  Download
} from 'lucide-react';

interface ProductIdea {
  id: string;
  title: string;
  tagline: string;
  type: 'Digital' | 'Físico' | 'Híbrido';
  targetAudience: string;
  problemSolved: string;
  formatDescription: string;
  deliverables: string[];
  whyItFits: string;
  suggestedPrice: string;
  revenueModel: string;
  quickLaunchSteps: string[];
  validationTest: string;
}

const PRESET_EXAMPLES = [
  {
    skill: 'Organización digital, bases de datos en Notion y automatizaciones sencillas con Make',
    audience: 'Agencias y freelancers creativos que pierden horas coordinando proyectos con clientes y cobros',
    label: '📊 Notion & Freelancers'
  },
  {
    skill: 'Preparación de café de especialidad, calibrado de molinos y cata de orígenes en casa',
    audience: 'Aficionados al café con presupuesto medio que compran buen café pero no les sabe como en cafetería',
    label: '☕ Café de Especialidad'
  },
  {
    skill: 'Carpintería básica con herramientas manuales y diseño de muebles para espacios reducidos',
    audience: 'Inquilinos jóvenes en departamentos pequeños que quieren optimizar esquinas y repisas sin obras grandes',
    label: '🔨 Muebles para Deptos'
  },
  {
    skill: 'Educación y adiestramiento canino con refuerzo positivo y juegos de olfato',
    audience: 'Dueños de cachorros primerizos agotados por la hiperactividad, mordeduras y ladridos cuando se quedan solos',
    label: '🐾 Adiestramiento Canino'
  },
  {
    skill: 'Cocina saludable con recetas sin gluten, panadería cetogénica y planificación semanal de comidas (meal prep)',
    audience: 'Personas con celiaquía o resistencia a la insulina que quieren comer rico sin pasar 3 horas diarias cocinando',
    label: '🥗 Cocina & Meal Prep'
  }
];

export default function App() {
  const [skill, setSkill] = useState('');
  const [audience, setAudience] = useState('');
  const [preference, setPreference] = useState<'all' | 'digital' | 'physical'>('all');
  
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<ProductIdea[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<ProductIdea[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showVercelModal, setShowVercelModal] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Deep dive modal state
  const [selectedIdeaForExpansion, setSelectedIdeaForExpansion] = useState<ProductIdea | null>(null);
  const [expansionLoading, setExpansionLoading] = useState(false);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);

  // TechText Header controls
  const [headerText, setHeaderText] = useState('PRODUCT LAB');
  const [headerAccent, setHeaderAccent] = useState('#06b6d4'); // Cyan
  const [headerSpeed, setHeaderSpeed] = useState(1);
  const [showTechSettings, setShowTechSettings] = useState(false);

  // Load saved ideas from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ideaforge_saved_ideas');
      if (stored) {
        setSavedIdeas(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Could not load saved ideas:', e);
    }
  }, []);

  const saveToLocalStorage = (newSaved: ProductIdea[]) => {
    setSavedIdeas(newSaved);
    try {
      localStorage.setItem('ideaforge_saved_ideas', JSON.stringify(newSaved));
    } catch (e) {
      console.error('Could not save ideas:', e);
    }
  };

  const toggleSaveIdea = (idea: ProductIdea) => {
    const exists = savedIdeas.some((item) => item.id === idea.id || item.title === idea.title);
    let updated: ProductIdea[];
    if (exists) {
      updated = savedIdeas.filter((item) => item.id !== idea.id && item.title !== idea.title);
    } else {
      updated = [idea, ...savedIdeas];
    }
    saveToLocalStorage(updated);
  };

  const isIdeaSaved = (idea: ProductIdea) => {
    return savedIdeas.some((item) => item.id === idea.id || item.title === idea.title);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!skill.trim() || !audience.trim()) {
      setError('Por favor completa ambas preguntas para generar ideas precisas y viables.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: skill.trim(),
          audience: audience.trim(),
          preference
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al comunicarse con el generador');
      }

      setIdeas(data.ideas);
      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error al generar las ideas. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_EXAMPLES[0]) => {
    setSkill(preset.skill);
    setAudience(preset.audience);
    setError(null);
  };

  const handleCopyIdea = (idea: ProductIdea) => {
    const textToCopy = `📌 ${idea.title} [${idea.type}]
"${idea.tagline}"

🎯 Cliente ideal: ${idea.targetAudience}
⚡ Problema resuelto: ${idea.problemSolved}
📦 Formato: ${idea.formatDescription}

Entregables:
${idea.deliverables.map((d) => `• ${d}`).join('\n')}

💰 Precio sugerido: ${idea.suggestedPrice}
📈 Modelo: ${idea.revenueModel}

🚀 Plan MVP de 7 días:
${idea.quickLaunchSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

🧪 Validación rápida: ${idea.validationTest}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(idea.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExpandIdea = async (idea: ProductIdea) => {
    setSelectedIdeaForExpansion(idea);
    setExpansionLoading(true);
    setExpandedContent(null);

    try {
      const res = await fetch('/api/expand-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          skill,
          audience
        })
      });
      const data = await res.json();
      setExpandedContent(data.details);
    } catch (err) {
      console.error(err);
      setExpandedContent('No se pudo cargar el desglose detallado en este momento.');
    } finally {
      setExpansionLoading(false);
    }
  };

  const handleDownloadZipFile = async () => {
    setDownloadStatus('loading');
    try {
      // Direct base64 fetch bypasses any iframe 302 redirects or cookie check traps
      const res = await fetch('/api/get-zip-base64');
      if (!res.ok) throw new Error('Error al obtener el archivo');
      const data = await res.json();
      if (!data.base64) throw new Error('Contenido no válido');

      // Convert base64 to binary byte array
      const byteCharacters = atob(data.base64);
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteNumbers], { type: 'application/zip' });

      // Trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'ideaforge-vercel.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 4000);
    } catch (err) {
      console.error('Download error:', err);
      // Fallback
      window.location.href = '/api/download-zip';
      setDownloadStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-neutral-100 flex flex-col font-sans selection:bg-cyan-500/25 selection:text-cyan-200">
      {/* Top Navbar */}
      <header className="border-b border-neutral-800/80 bg-[#090d16]/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black text-sm tracking-wider">
              IF
            </div>
            <div>
              <span className="font-bold tracking-tight text-white flex items-center gap-1.5 text-base">
                IdeaForge <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">AI & Canvas</span>
              </span>
              <p className="text-[11px] text-neutral-400 hidden sm:block">Generador de productos a partir de tus habilidades</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowVercelModal(true)}
              className="px-2.5 py-1.5 rounded-lg border border-cyan-800/80 hover:border-cyan-600 bg-cyan-950/60 hover:bg-cyan-900/60 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-all shadow-sm"
              title="Descargar paquete ZIP listo para Vercel"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">ZIP Vercel</span>
              <span className="sm:hidden">ZIP</span>
            </button>

            <button
              onClick={() => setShowTechSettings(!showTechSettings)}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800/60 text-xs font-mono text-neutral-300 flex items-center gap-1.5 transition-colors"
              title="Personalizar encabezado TechText"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Ajustar Header</span>
            </button>

            <button
              onClick={() => setShowSavedModal(true)}
              className="relative px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800/60 text-xs font-medium text-neutral-300 flex items-center gap-1.5 transition-colors"
            >
              <FolderHeart className="w-3.5 h-3.5 text-pink-400" />
              <span>Guardados</span>
              {savedIdeas.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-mono">
                  {savedIdeas.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* TECHTEXT CUSTOMIZER DRAWER (Optional Collapsible) */}
      {showTechSettings && (
        <div className="bg-neutral-900/95 border-b border-neutral-800 px-4 py-3 z-30 transition-all">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-300">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Texto Header:</span>
              <input
                type="text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value.toUpperCase() || 'PRODUCT LAB')}
                maxLength={14}
                className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-cyan-300 focus:outline-none focus:border-cyan-400 w-32"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Acento Tech:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { name: 'Cyan', color: '#06b6d4' },
                  { name: 'Esmeralda', color: '#10b981' },
                  { name: 'Violeta', color: '#a855f7' },
                  { name: 'Ámbar', color: '#f59e0b' },
                  { name: 'Rosa', color: '#f43f5e' }
                ].map((item) => (
                  <button
                    key={item.color}
                    onClick={() => setHeaderAccent(item.color)}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${headerAccent === item.color ? 'scale-125 border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: item.color }}
                    title={item.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Velocidad:</span>
              <input
                type="range"
                min="0.4"
                max="2.2"
                step="0.2"
                value={headerSpeed}
                onChange={(e) => setHeaderSpeed(parseFloat(e.target.value))}
                className="w-20 accent-cyan-400 cursor-pointer"
              />
              <span className="text-[11px] text-neutral-400">{headerSpeed}x</span>
            </div>

            <button
              onClick={() => setShowTechSettings(false)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* HERO SECTION WITH TECHTEXT ANIMATED HEADER */}
      <section className="relative pt-6 pb-10 border-b border-neutral-800/80 bg-gradient-to-b from-[#0b101c] via-[#080d17] to-[#07090e] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d0f_1px,transparent_1px),linear-gradient(to_bottom,#1f293d0f_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
        
        {/* Glow ambient spots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Tag pill */}
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 shadow-sm shadow-cyan-950">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Canvas Interactivo • Arrastra las letras con el ratón</span>
            </span>
          </div>

          {/* Interactive TechText Component Area */}
          <div className="relative w-full h-44 sm:h-52 md:h-64 my-1 rounded-2xl bg-neutral-950/80 border border-neutral-800/90 shadow-2xl shadow-cyan-950/40 overflow-hidden group">
            {/* Tech HUD Corner Accents */}
            <div className="absolute top-2 left-3 font-mono text-[9px] text-cyan-400/70 tracking-widest pointer-events-none select-none">
              SYS//CANVAS.RENDER_ENGINE [2D.SPRITES]
            </div>
            <div className="absolute top-2 right-3 font-mono text-[9px] text-neutral-500 tracking-widest pointer-events-none select-none">
              DAMPING:22 | SPRING:320
            </div>
            <div className="absolute bottom-2 left-3 font-mono text-[9px] text-neutral-500 tracking-widest pointer-events-none select-none">
              INTERACTION: DRAG & REVEAL
            </div>
            <div className="absolute bottom-2 right-3 font-mono text-[9px] text-cyan-400/70 tracking-widest pointer-events-none select-none">
              SPEED: {headerSpeed}x
            </div>

            {/* The exact requested TechText component */}
            <TechText
              text={headerText}
              color="#e2e8f0"
              accentColor={headerAccent}
              fontSize={110}
              fontWeight={700}
              letterSpacing={-0.03}
              reach={180}
              softness={0.7}
              dashLength={5}
              dashGap={3}
              strokeWidth={1.8}
              specks={20}
              speed={headerSpeed}
              draggable={true}
              selection={true}
              labels={true}
              className="w-full h-full"
            />
          </div>

          {/* Subtitle / Description */}
          <div className="text-center max-w-2xl mx-auto mt-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              De tu talento a un <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">producto rentable</span>
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-neutral-400 leading-relaxed">
              Solo necesitas responder <strong className="text-neutral-200">2 preguntas esenciales</strong>. La IA sintetizará tu conocimiento y formulará <strong className="text-cyan-300 font-semibold">3 propuestas listas para validar y vender</strong> (digitales, físicas o híbridas).
            </p>
          </div>
        </div>
      </section>

      {/* MAIN GENERATOR WORKFLOW */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* Preset Inspirations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              ¿Buscas inspiración? Prueba con un ejemplo predefinido:
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_EXAMPLES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-xs px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-cyan-500/50 text-neutral-300 hover:text-white transition-all duration-200 text-left cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleGenerate} className="bg-[#0b101c] border border-neutral-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="relative">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                  1
                </span>
                <label htmlFor="skill-input" className="text-base sm:text-lg font-bold text-white tracking-tight">
                  ¿Qué sabes hacer?
                </label>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mb-2.5 ml-8.5">
                Una habilidad técnica, una experiencia personal, un oficio o algo que disfrutas enseñar a otros.
              </p>
              <textarea
                id="skill-input"
                rows={3}
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="Ejemplo: Sé crear sistemas de finanzas personales en Notion, hacer carpintería japonesa con ensambles simples, cocinar postres sin gluten que queden esponjosos..."
                className="w-full bg-[#07090e] border border-neutral-800 focus:border-cyan-500 rounded-xl p-3.5 text-sm sm:text-base text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all resize-y"
              />
            </div>

            {/* Question 2 */}
            <div className="relative">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-mono font-bold">
                  2
                </span>
                <label htmlFor="audience-input" className="text-base sm:text-lg font-bold text-white tracking-tight">
                  ¿A quién quieres ayudar?
                </label>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mb-2.5 ml-8.5">
                Piensa en una persona real o perfil concreto y en el problema o dolor específico que necesita resolver.
              </p>
              <textarea
                id="audience-input"
                rows={3}
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Ejemplo: Freelancers desordenados que no saben cuánto ganan al mes y les da pánico pagar impuestos, inquilinos jóvenes que quieren decorar sin taladrar..."
                className="w-full bg-[#07090e] border border-neutral-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm sm:text-base text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-y"
              />
            </div>

            {/* Preferences (Digital, Physical, or Mixed) */}
            <div className="pt-2 border-t border-neutral-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                    Preferencia de Formato:
                  </span>
                  <div className="inline-flex p-1 rounded-xl bg-neutral-950 border border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setPreference('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${preference === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
                    >
                      Mix (Digitales + Físicos)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreference('digital')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${preference === 'digital' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
                    >
                      Solo Digitales
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreference('physical')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${preference === 'physical' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
                    >
                      Solo Físicos
                    </button>
                  </div>
                </div>

                {/* Reset button */}
                {(skill || audience) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSkill('');
                      setAudience('');
                      setError(null);
                    }}
                    className="text-xs font-mono text-neutral-500 hover:text-neutral-300 flex items-center gap-1 self-start sm:self-center transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Limpiar campos
                  </button>
                )}
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs sm:text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl font-bold text-base tracking-wide bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:via-sky-400 hover:to-indigo-500 text-neutral-950 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-neutral-950" />
                    <span>Analizando habilidades y modelando productos...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-neutral-950 group-hover:scale-110 transition-transform" />
                    <span>Generar mis 3 Ideas de Producto</span>
                    <ArrowRight className="w-4 h-4 ml-1 text-neutral-950 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* RESULTS SECTION */}
        {ideas && ideas.length > 0 && (
          <section id="results-section" className="mt-14 scroll-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Generación Exitosa
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                  3 Ideas Diseñadas para tu Perfil
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Cada una con su modelo de negocio, formato tangible y validación previa de 7 días.
                </p>
              </div>

              <button
                onClick={() => handleGenerate()}
                disabled={loading}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-2 transition-colors self-start sm:self-center"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Regenerar otras 3 ideas</span>
              </button>
            </div>

            {/* 3 Product Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {ideas.map((idea, index) => {
                const isSaved = isIdeaSaved(idea);
                const isCopied = copiedId === idea.id;

                const typeColor =
                  idea.type === 'Digital'
                    ? {
                        badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80',
                        accent: 'text-cyan-400',
                        border: 'hover:border-cyan-500/50',
                        icon: Laptop
                      }
                    : idea.type === 'Físico'
                    ? {
                        badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
                        accent: 'text-emerald-400',
                        border: 'hover:border-emerald-500/50',
                        icon: Package
                      }
                    : {
                        badge: 'bg-purple-950/80 text-purple-300 border-purple-800/80',
                        accent: 'text-purple-400',
                        border: 'hover:border-purple-500/50',
                        icon: Layers
                      };

                const TypeIcon = typeColor.icon;

                return (
                  <article
                    key={idea.id || index}
                    className={`bg-[#0c1220] border border-neutral-800/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-xl shadow-black/40 ${typeColor.border} relative group`}
                  >
                    <div>
                      {/* Top Badges & Actions */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${typeColor.badge}`}>
                          <TypeIcon className="w-3.5 h-3.5" />
                          <span>Producto {idea.type}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleSaveIdea(idea)}
                            className={`p-1.5 rounded-lg border transition-colors ${isSaved ? 'bg-pink-950/60 border-pink-700/70 text-pink-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}`}
                            title={isSaved ? 'Guardado en favoritos' : 'Guardar en favoritos'}
                          >
                            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleCopyIdea(idea)}
                            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                            title="Copiar resumen"
                          >
                            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug group-hover:text-cyan-200 transition-colors">
                        {idea.title}
                      </h3>
                      <p className="text-xs text-neutral-300 italic mt-1.5 mb-4 leading-relaxed font-serif">
                        "{idea.tagline}"
                      </p>

                      {/* Problem and Target */}
                      <div className="space-y-3 py-3 border-y border-neutral-800/70 text-xs">
                        <div>
                          <span className="font-mono text-[10px] uppercase text-neutral-500 block mb-0.5">
                            Para Quién:
                          </span>
                          <span className="text-neutral-200 font-medium">{idea.targetAudience}</span>
                        </div>

                        <div>
                          <span className="font-mono text-[10px] uppercase text-neutral-500 block mb-0.5">
                            Dolor que Elimina:
                          </span>
                          <span className="text-neutral-300">{idea.problemSolved}</span>
                        </div>
                      </div>

                      {/* Format Description & Deliverables */}
                      <div className="my-4">
                        <span className="font-mono text-[10px] uppercase text-neutral-500 block mb-1">
                          Formato Tangible:
                        </span>
                        <p className="text-xs text-neutral-200 font-medium mb-2.5">
                          {idea.formatDescription}
                        </p>

                        <div className="space-y-1.5">
                          {idea.deliverables.map((item, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-2 text-xs text-neutral-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Why it fits your skill */}
                      <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/70 text-xs mb-4">
                        <span className="font-mono text-[10px] uppercase text-cyan-400 block mb-1 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Conexión con tu Habilidad:
                        </span>
                        <p className="text-neutral-300 text-[11px] leading-relaxed">
                          {idea.whyItFits}
                        </p>
                      </div>

                      {/* Price & Revenue */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 mb-4 text-xs">
                        <div>
                          <span className="font-mono text-[10px] uppercase text-neutral-500 block">Precio Sugerido:</span>
                          <span className="text-sm font-bold text-white tracking-wide">{idea.suggestedPrice}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-[10px] uppercase text-neutral-500 block">Monetización:</span>
                          <span className="text-neutral-300 text-[11px]">{idea.revenueModel}</span>
                        </div>
                      </div>

                      {/* Fast MVP & Validation */}
                      <div className="space-y-2.5 mb-5 text-xs">
                        <div>
                          <span className="font-mono text-[10px] uppercase text-amber-400 flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3" />
                            Plan MVP de 7 Días:
                          </span>
                          <ul className="space-y-1 text-neutral-300 pl-1">
                            {idea.quickLaunchSteps.map((step, sIdx) => (
                              <li key={sIdx} className="text-[11px] flex items-start gap-1.5">
                                <span className="font-mono text-neutral-500">•</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-neutral-800/60">
                          <span className="font-mono text-[10px] uppercase text-emerald-400 flex items-center gap-1 mb-1">
                            <ShieldCheck className="w-3 h-3" />
                            Prueba de Validación:
                          </span>
                          <p className="text-[11px] text-neutral-300 bg-neutral-950/40 p-2 rounded-lg border border-neutral-800/50">
                            {idea.validationTest}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA to expand plan */}
                    <div className="pt-2 border-t border-neutral-800/80">
                      <button
                        onClick={() => handleExpandIdea(idea)}
                        className="w-full py-2.5 px-3 rounded-xl bg-neutral-800/70 hover:bg-neutral-800 text-xs font-medium text-neutral-200 hover:text-white border border-neutral-700/60 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                      >
                        <span>Ver Guión de Venta & Plan Diario</span>
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Informative Value Prop Banner */}
        <section className="mt-16 p-6 sm:p-8 rounded-2xl bg-[#0b101c] border border-neutral-800/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto md:mx-0">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">1. Especificidad Radical</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                No inventamos cursos genéricos de 40 horas. Diseñamos soluciones directas que resuelven una dolencia concreta para un avatar claro.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto md:mx-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">2. Validación Cero Riesgo</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Cada propuesta incluye una prueba previa para confirmar que hay personas dispuestas a pagar antes de fabricar o programar nada.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto md:mx-0">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">3. Lanzamiento en 7 Días</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Planes paso a paso diseñados para que tu primer MVP esté disponible en una semana usando herramientas que ya dominas.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL: EXPANDED PLAN & SALES SCRIPT */}
      {selectedIdeaForExpansion && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1220] border border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                  Estrategia de Lanzamiento
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {selectedIdeaForExpansion.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIdeaForExpansion(null)}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {expansionLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
                  <p className="font-mono text-xs text-neutral-400">
                    Generando desglose día a día y guión de venta personalizado...
                  </p>
                </div>
              ) : expandedContent ? (
                <div className="prose prose-invert prose-sm max-w-none space-y-4 whitespace-pre-wrap font-sans">
                  {expandedContent}
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 bg-[#090d16] flex items-center justify-between">
              <button
                onClick={() => {
                  if (expandedContent) {
                    navigator.clipboard.writeText(expandedContent);
                    setCopiedId('modal');
                    setTimeout(() => setCopiedId(null), 2000);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-200 border border-neutral-800 flex items-center gap-1.5 transition-colors"
              >
                {copiedId === 'modal' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'modal' ? 'Copiado al portapapeles' : 'Copiar todo el plan'}</span>
              </button>

              <button
                onClick={() => setSelectedIdeaForExpansion(null)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition-colors"
              >
                Listo, cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SAVED IDEAS FAVORITES */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1220] border border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderHeart className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Tus Ideas Favoritas Guardadas ({savedIdeas.length})
                </h3>
              </div>
              <button
                onClick={() => setShowSavedModal(false)}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {savedIdeas.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 text-xs">
                  <Bookmark className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
                  <p>Aún no has guardado ninguna idea en favoritos.</p>
                  <p className="mt-1 text-neutral-600">Haz clic en el icono de marcador en cualquiera de las 3 ideas generadas.</p>
                </div>
              ) : (
                savedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-cyan-300">
                          {idea.type}
                        </span>
                        <h4 className="font-bold text-white">{idea.title}</h4>
                      </div>
                      <p className="text-neutral-400 text-[11px]">{idea.tagline}</p>
                      <p className="text-neutral-500 text-[10px] mt-1 font-mono">
                        Precio: {idea.suggestedPrice} • Audiencia: {idea.targetAudience}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleCopyIdea(idea)}
                        className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
                        title="Copiar idea"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleSaveIdea(idea)}
                        className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 text-red-300"
                        title="Eliminar de guardados"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-neutral-800 bg-[#090d16] flex justify-end">
              <button
                onClick={() => setShowSavedModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VERCEL DEPLOYMENT & ZIP DOWNLOAD */}
      {showVercelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1220] border border-neutral-800 rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Alojamiento en Vercel
                </h3>
              </div>
              <button
                onClick={() => setShowVercelModal(false)}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-neutral-300">
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-cyan-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Archivo .ZIP generado y preconfigurado para Vercel
                </span>
                <p className="text-neutral-300">
                  Incluye la configuración <code className="text-cyan-300 font-mono">vercel.json</code>, los endpoints serverless en <code className="text-cyan-300 font-mono">/api</code> y el build de Vite.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Pasos para desplegar en Vercel:</h4>
                <ol className="space-y-2.5 list-decimal pl-4 text-xs text-neutral-300">
                  <li>
                    <strong>Descarga el paquete:</strong> Pulsa el botón inferior para guardar <code className="text-cyan-300 font-mono">ideaforge-vercel.zip</code> en tu equipo.
                  </li>
                  <li>
                    <strong>Súbelo a GitHub:</strong> Descomprime el archivo y súbelo a un repositorio de GitHub (o despliega con <code className="text-cyan-300 font-mono">vercel cli</code> en tu terminal).
                  </li>
                  <li>
                    <strong>Importa en Vercel:</strong> En tu panel de <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">vercel.com</a>, pulsa "Add New Project" e importa tu repositorio.
                  </li>
                  <li>
                    <strong>Variable opcional:</strong> Añade en <em>Environment Variables</em> tu <code className="text-cyan-300 font-mono">GEMINI_API_KEY</code> para activar las sugerencias personalizadas de Gemini con tu propia clave.
                  </li>
                </ol>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleDownloadZipFile}
                  disabled={downloadStatus === 'loading'}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-neutral-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all text-center disabled:opacity-50 cursor-pointer"
                >
                  {downloadStatus === 'loading' ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin text-neutral-950" />
                      <span>Empaquetando y descargando...</span>
                    </>
                  ) : downloadStatus === 'success' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                      <span>¡Descargado exitosamente! (18 archivos, 38 KB)</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-neutral-950" />
                      <span>Descargar ideaforge-vercel.zip (Completo)</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-neutral-400">
                  Archivo binario ZIP verificado con carpetas completas (compatible con Windows Explorer y macOS).
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-800 bg-[#090d16] flex justify-end">
              <button
                onClick={() => setShowVercelModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-neutral-800/80 bg-[#070a11] py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
          <div className="flex items-center gap-2">
            <span>IdeaForge</span>
            <span>•</span>
            <span>TechText Header Engine</span>
            <span>•</span>
            <span>Diseñado para Creadores & Emprendedores</span>
          </div>
          <div>
            <span>Dos preguntas, tres productos reales.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
