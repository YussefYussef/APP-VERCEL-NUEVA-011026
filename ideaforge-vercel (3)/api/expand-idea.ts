import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { idea, skill, audience } = body;

    if (!idea || !idea.title) {
      return res.status(400).json({ error: 'Se requiere la idea a profundizar.' });
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

        const prompt = `Crea un plan de acción detallado de 7 días y un guión de venta irresistible para este producto:
Título: ${idea.title}
Tipo: ${idea.type}
Para quién: ${audience || idea.targetAudience}
Habilidad base: ${skill}
Precio: ${idea.suggestedPrice}

Provee:
1. Cronograma día a día (Día 1 al Día 7) con tareas específicas para lanzar el MVP.
2. Un guión de mensaje directo (DM) o publicación en redes de 3 párrafos para conseguir los primeros 3 clientes.
3. 3 objeciones frecuentes que pondrán los clientes y cómo responder a cada una.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'Eres un mentor de lanzamientos lean y copywriter persuasivo en español.'
          }
        });

        if (response.text) {
          return res.json({ success: true, details: response.text });
        }
      } catch (err) {
        console.warn('Gemini expand-idea fallback in Vercel function:', err);
      }
    }

    return res.json({
      success: true,
      details: `### Plan de Lanzamiento Rápido de 7 Días para "${idea.title}"

**Día 1: Definición del Core Value**
- Escribe en una sola página la promesa exacta y los 3 problemas que tu cliente solucionará.
- Define qué herramientas mínimas vas a usar (Notion, Google Drive, Canva o caja de envíos básica).

**Día 2: Esquema o Prototipo Crudo**
- Crea la primera versión funcional (el 20% del contenido que produce el 80% de los resultados).
- No busques perfección visual, prioriza que sea inmediatamente útil.

**Día 3: Página de Preventa o Formulario**
- Crea un enlace de pago en Gumroad, Stripe o WhatsApp con el título, descripción de beneficios y precio exclusivo para miembros fundadores.

**Día 4: Contacto Directo con 10 Personas Ideales**
- Habla personalmente con personas que encajen en tu perfil objetivo.
- Pídeles retroalimentación sincera y ofréceles probarlo antes que nadie con un descuento del 50%.

**Día 5: Ajustes con Feedback Real**
- Corrige las 2 dudas más recurrentes que te mencionaron.
- Graba un video de 60 segundos mostrando cómo se ve por dentro.

**Día 6: Publicación Abierta de Lanzamiento**
- Publica en tus redes sociales compartiendo la historia de por qué creaste esto y a quién quieres ayudar.
- Limita la oferta a los primeros 10 compradores para generar urgencia genuina.

**Día 7: Bienvenida y Entrega a los Primeros Clientes**
- Entrega personalmente el acceso o prepara los envíos con una nota personalizada de agradecimiento.
- Pídeles su testimonio una vez completen el primer paso.

---

### Guión de Mensaje Directo (DM) para Conseguir tus Primeros Clientes

"¡Hola [Nombre]! Sé que para ti es clave resolver [mencionar el dolor principal de la audiencia]. Estuve trabajando en una solución directa basada en mi experiencia en [tu habilidad], diseñada especialmente para [el perfil de cliente].

Creé **${idea.title}**, que incluye [1 o 2 entregables principales] para que puedas lograrlo en pocos días sin complicaciones.

Estoy lanzando una versión beta para solo 5 personas con un 50% de descuento a cambio de su feedback sincero. ¿Te interesaría ver de qué se trata?"`
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al expandir la idea.' });
  }
}
