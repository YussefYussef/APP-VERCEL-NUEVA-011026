import { GoogleGenAI, Type } from '@google/genai';

export interface ProductIdea {
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

function generateFallbackIdeas(skill: string, audience: string, preference: string = 'all'): ProductIdea[] {
  const cleanSkill = skill.trim();
  const cleanAudience = audience.trim();

  const isDigitalPreferred = preference === 'digital';
  const isPhysicalPreferred = preference === 'physical';

  const type1: 'Digital' | 'Físico' | 'Híbrido' = isPhysicalPreferred ? 'Físico' : 'Digital';
  const type2: 'Digital' | 'Físico' | 'Híbrido' = isDigitalPreferred ? 'Digital' : 'Físico';
  const type3: 'Digital' | 'Físico' | 'Híbrido' = 'Híbrido';

  return [
    {
      id: 'idea-1',
      title: `${type1 === 'Digital' ? 'Kit Digital de Aceleración' : 'Caja Esencial de Inicio'}: ${cleanSkill.slice(0, 32)}`,
      tagline: `La solución directa para que ${cleanAudience.slice(0, 40)} logre resultados tangibles en menos de 14 días.`,
      type: type1,
      targetAudience: cleanAudience,
      problemSolved: `Elimina la frustración de no saber por dónde empezar y ahorra decenas de horas de ensayo y error.`,
      formatDescription: type1 === 'Digital'
        ? 'Plantillas listas para usar en Notion/Google Docs + videoguías paso a paso de 5 a 10 minutos.'
        : 'Caja física curada con herramientas esenciales seleccionadas a mano, checklist impresa y manual de bolsillo.',
      deliverables: type1 === 'Digital'
        ? [
            'Plantilla editable prediseñada con flujos de trabajo probados',
            '3 video-tutoriales prácticos sin relleno técnico',
            'Checklist imprimible de control y auditoría rápida',
            'Acceso a grupo privado de soporte y preguntas frecuentes'
          ]
        : [
            'Set de 3 herramientas prácticas para empezar el día uno',
            'Cuaderno de trabajo impreso de 40 páginas encuadernado',
            'Código QR para desbloquear masterclass de bienvenida en video',
            'Tarjetas de referencia rápida plastificadas'
          ],
      whyItFits: `Convierte tu experiencia en "${cleanSkill}" en un formato empaquetado que tu cliente ideal puede consumir y aplicar a su propio ritmo sin depender de tu tiempo 1 a 1.`,
      suggestedPrice: type1 === 'Digital' ? '$27 - $49 USD (Pago único)' : '$59 - $89 USD (Envío incluido)',
      revenueModel: 'Venta directa en landing page sencilla o Gumroad / Shopify.',
      quickLaunchSteps: [
        'Día 1-2: Grabar o recopilar los 3 recursos que tú mismo usas a diario.',
        'Día 3-4: Crear una página sencilla de preventa mostrando el resultado prometido.',
        'Día 5-7: Ofrecerlo a tus primeros 5 conocidos o en redes con un 50% de descuento beta.'
      ],
      validationTest: 'Publica una historia o mensaje: "Creé una guía práctica para resolver X en 3 pasos. Si te interesa probar la versión beta por $15, comenta o envíame DM". Consigue 3 personas interesadas antes de terminar el producto.'
    },
    {
      id: 'idea-2',
      title: `${type2 === 'Digital' ? 'Sistema Modular Paso a Paso' : 'Taller Práctico con Materiales'}: Maestría en ${cleanSkill.slice(0, 28)}`,
      tagline: `Una experiencia guiada para transformar la mayor dificultad de ${cleanAudience.slice(0, 35)} en su mayor fortaleza.`,
      type: type2,
      targetAudience: cleanAudience,
      problemSolved: `Cubre la falta de acompañamiento y claridad técnica cuando se enfrentan a problemas imprevistos.`,
      formatDescription: type2 === 'Digital'
        ? 'Mini-curso intensivo de 4 módulos con hojas de ejercicios interactivos y sesiones de preguntas.'
        : 'Kit de prototipado o práctica con materiales medidos y empaque personalizado para realizar su primera creación.',
      deliverables: type2 === 'Digital'
        ? [
            '4 módulos en video de alto impacto (15 minutos c/u)',
            'Guía de resolución de los 10 errores más comunes',
            'Hoja de cálculo interactiva para medir avances y métricas',
            'Certificado de finalización y plantilla para compartir'
          ]
        : [
            'Kit con insumos de alta calidad listos para ensamblar o usar',
            'Guía gráfica paso a paso ilustrada a todo color',
            'Acceso a sesión mensual en vivo para dudas y correcciones',
            'Stickers y packaging con identidad propia'
          ],
      whyItFits: `Aprovecha tu pasión por enseñar "${cleanSkill}", permitiendo a ${cleanAudience} ver un avance tangible desde la primera sesión.`,
      suggestedPrice: type2 === 'Digital' ? '$67 - $129 USD' : '$85 - $149 USD',
      revenueModel: 'Lanzamiento por cohortes mensuales o venta evergreen con upsell.',
      quickLaunchSteps: [
        'Día 1: Diseñar el temario o lista de materiales indispensables.',
        'Día 2-3: Validar el precio con 3 personas que encajen en tu perfil objetivo.',
        'Día 4-7: Lanzar la preventa limitada a 10 cupos para financiar la producción inicial.'
      ],
      validationTest: 'Invita a una sesión demo gratuita de 20 minutos por Zoom o presencial. Al final presenta el producto completo con oferta especial de fundadores.'
    },
    {
      id: 'idea-3',
      title: `Club / Membresía de Acompañamiento: ${cleanSkill.slice(0, 26)} para ${cleanAudience.slice(0, 24)}`,
      tagline: `La comunidad y recurso continuo donde nunca se sentirán solos resolviendo sus retos.`,
      type: type3,
      targetAudience: cleanAudience,
      problemSolved: `Evita el abandono y la soledad en el proceso de aprendizaje mediante comunidad activa y feedback constante.`,
      formatDescription: 'Modelo híbrido: Envío mensual de un recurso físico coleccionable o guía impresa + acceso a comunidad digital exclusiva y llamadas quincenales.',
      deliverables: [
        'Llamada quincenal de mentoría y feedback en vivo',
        'Biblioteca privada de recursos, retos y casos de éxito',
        'Desafío mensual práctico de 5 días con acompañamiento',
        'Canal privado de networking para consultas en tiempo real'
      ],
      whyItFits: `Genera ingresos recurrentes predecibles basados en tu conocimiento continuo de "${cleanSkill}", construyendo relaciones duraderas con ${cleanAudience}.`,
      suggestedPrice: '$19 - $39 USD / mes (o suscripción anual con 2 meses gratis)',
      revenueModel: 'Suscripción mensual recurrente vía Stripe, Lemon Squeezy o PayPal.',
      quickLaunchSteps: [
        'Día 1-2: Crear un grupo cerrado (Discord, Telegram o Skool/Circle).',
        'Día 3-4: Publicar el calendario de los primeros 3 eventos o temas del mes.',
        'Día 5-7: Invitar a los miembros fundadores con tarifa promocional de por vida.'
      ],
      validationTest: 'Propón a 5 personas afines una suscripción piloto de $15/mes garantizando feedback personalizado y acceso exclusivo. Si 3 dicen sí, ábrelo formalmente.'
    }
  ];
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { skill, audience, preference = 'all' } = body;

    if (!skill || !audience || typeof skill !== 'string' || typeof audience !== 'string') {
      return res.status(400).json({ error: 'Se requieren las respuestas a ambas preguntas (habilidad y audiencia).' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `Eres un estratega experto en creación de productos digitales y físicos rentables.
Un emprendedor te proporciona sus respuestas a dos preguntas clave:
1. ¿Qué sabe hacer, su habilidad o lo que disfruta enseñar?: "${skill.trim()}"
2. ¿A quién quiere ayudar y qué problema necesita resolver?: "${audience.trim()}"
Preferencia de formato: "${preference === 'digital' ? 'Priorizar productos digitales (e-books, plantillas, cursos, micro-SaaS)' : preference === 'physical' ? 'Priorizar productos físicos (kits, herramientas, diarios impresos, productos artesanales)' : 'Equilibrado entre productos digitales, físicos y modelos híbridos'}".

Genera exactamente 3 ideas de productos altamente comerciales, viables y realistas que conecten directamente esa habilidad con esa necesidad.
Asegúrate de que cada idea sea concreta (no genérica), atractiva, fácil de validar y que resuelva el dolor del cliente.
Responde estrictamente en español.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'Eres un consultor de negocios y creador de productos de clase mundial. Devuelve ideas hiper-específicas, accionables, creativas y comercialmente viables.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                ideas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING, description: 'Título comercial atractivo del producto' },
                      tagline: { type: Type.STRING, description: 'Frase gancho o promesa principal' },
                      type: { type: Type.STRING, enum: ['Digital', 'Físico', 'Híbrido'] },
                      targetAudience: { type: Type.STRING, description: 'Cliente ideal definido' },
                      problemSolved: { type: Type.STRING, description: 'El problema doloroso que resuelve' },
                      formatDescription: { type: Type.STRING, description: 'Qué es exactamente el producto en formato tangible' },
                      deliverables: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'Lista de 3 a 5 entregables o componentes clave'
                      },
                      whyItFits: { type: Type.STRING, description: 'Por qué conecta la habilidad del creador con la necesidad' },
                      suggestedPrice: { type: Type.STRING, description: 'Rango de precio sugerido y moneda' },
                      revenueModel: { type: Type.STRING, description: 'Modelo de monetización (pago único, suscripción, etc.)' },
                      quickLaunchSteps: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'Plan de 3 pasos para un MVP en 7 días'
                      },
                      validationTest: { type: Type.STRING, description: 'Prueba rápida de validación sin gastar dinero' }
                    },
                    required: [
                      'id', 'title', 'tagline', 'type', 'targetAudience',
                      'problemSolved', 'formatDescription', 'deliverables',
                      'whyItFits', 'suggestedPrice', 'revenueModel',
                      'quickLaunchSteps', 'validationTest'
                    ]
                  }
                }
              },
              required: ['ideas']
            }
          }
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (parsed && Array.isArray(parsed.ideas) && parsed.ideas.length >= 3) {
            return res.json({
              success: true,
              source: 'gemini',
              ideas: parsed.ideas.slice(0, 3)
            });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed in Vercel function, falling back:', geminiError);
      }
    }

    const fallbackIdeas = generateFallbackIdeas(skill, audience, preference);
    return res.json({
      success: true,
      source: 'fallback',
      ideas: fallbackIdeas
    });
  } catch (error: any) {
    console.error('Error in /api/generate-ideas handler:', error);
    return res.status(500).json({ error: 'Ocurrió un error inesperado al generar las ideas.' });
  }
}
