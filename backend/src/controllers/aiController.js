import { asyncHandler } from '../utils/asyncHandler.js';

const SYSTEM_INSTRUCTION = `You are the official AI Assistant for Shailendra Technology, a modern digital product and web engineering company.
Shailendra Technology builds high-performance full-stack web applications, React & Next.js frontends, scalable Node.js/Express APIs, MongoDB databases, and AI automation workflows.
Your job is to assist visitors by:
1. Explaining our services (Web development, Backend & APIs, AI & Automation, Hosting & Care).
2. Providing information about our tech stack (React, Node.js, Express, MongoDB, Python, Next.js, Cloud deployments).
3. Guiding users to the contact page to start a project.
Keep your responses helpful, polite, professional, and concise.`;

// Intelligent fallback responses when GEMINI_API_KEY is not yet provided
function getDummyAIResponse(userMessage) {
  const q = (userMessage || '').toLowerCase();

  if (q.includes('service') || q.includes('what do you do') || q.includes('offer')) {
    return 'At Shailendra Technology, we specialize in:\n• **Web Development**: Fast, mobile-responsive React & Next.js websites.\n• **Backend & APIs**: Secure Node.js & Express APIs, MongoDB databases, and third-party integrations.\n• **AI & Automation**: Custom AI features, chatbots, and n8n workflow automations.\n• **Hosting & Maintenance**: End-to-end cloud deployment and upkeep.';
  }

  if (q.includes('stack') || q.includes('tech') || q.includes('technology') || q.includes('language')) {
    return 'Our core technology stack includes:\n• **Frontend**: React.js, Next.js, HTML5, modern CSS.\n• **Backend**: Node.js, Express.js, REST APIs.\n• **Databases**: MongoDB, PostgreSQL.\n• **AI & Automation**: Google Gemini, OpenAI, Claude, Python, and n8n.';
  }

  if (q.includes('contact') || q.includes('hire') || q.includes('project') || q.includes('quote') || q.includes('price')) {
    return 'We would love to collaborate on your project! You can head over to our **Contact page** to send us an inquiry directly, or reach out to us at admin@shailendra.com.';
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return 'Hello! 👋 I am the Shailendra Technology AI Assistant. How can I assist you with your web or software project today?';
  }

  return `Thank you for reaching out to Shailendra Technology! We design and develop full-stack digital solutions tailored to your business needs.\n\n*(Note: Running in AI preview mode. Provide your GEMINI_API_KEY in backend .env to connect live Gemini AI.)*`;
}

export const chatWithAI = asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  const cleanMessage = message.trim().slice(0, 1000);
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';

  // If no Gemini API key is configured yet, return smart dummy response
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    const dummyReply = getDummyAIResponse(cleanMessage);
    return res.json({
      reply: dummyReply,
      isDemo: true,
      tip: 'Gemini API key is not configured yet. Add GEMINI_API_KEY to your backend .env file to activate live Gemini AI.',
    });
  }

  // Live call to Google Gemini API
  try {
    const formattedContents = [];

    // System instruction as first user/model context or system instruction
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.role && item.text) {
          formattedContents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(item.text).slice(0, 500) }],
          });
        }
      }
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nUser Question: ${cleanMessage}` }],
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: formattedContents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Gemini API returned error, falling back to dummy response:', errText);
      return res.json({
        reply: getDummyAIResponse(cleanMessage),
        isDemo: true,
        error: 'Gemini API key returned an error. Using fallback response.',
      });
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (candidate) {
      return res.json({ reply: candidate, isDemo: false });
    }

    return res.json({
      reply: getDummyAIResponse(cleanMessage),
      isDemo: true,
    });
  } catch (error) {
    console.error('Failed to communicate with Gemini API:', error.message);
    return res.json({
      reply: getDummyAIResponse(cleanMessage),
      isDemo: true,
      error: error.message,
    });
  }
});
