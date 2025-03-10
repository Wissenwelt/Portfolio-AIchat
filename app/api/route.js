"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Generative AI client with the API key from environment variables.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Knowledge base: professional and personal details about Vijendra.
const resumeInfo = `
Professional: Data Scientist specializing in NLP, LLMs, and generative AI. Proven track record in developing cutting-edge machine learning models, advanced research tools, scalable pipelines, sentiment analysis, and predictive analytics. Expertise includes:
- Creating an AI platform that empowers users to design custom AI courses with AI agents.
- Developing advanced research tools that leverage multiple LLMs (Claude, Gemini, Deepseek, GPT, and LLaMA) for deep data analysis.
- Leading end-to-end development of web applications using Next.js, Drizzle ORM, Neon Postgres, Redshift, and integrating vector databases like Pinecone through Langchain.
- Implementing robust anti-money laundering detection systems, credit risk analysis pipelines, and predictive models across diverse industries.

Personal: Passionate about farming, traveling, and continuous learning.

Fun Fact: Actively tutoring in advanced AI concepts and building innovative, AI-driven solutions. Working on new platforms and tools, possibly launching by May 2025.

Skills: Python, R, SQL, HTML, CSS, JavaScript; TensorFlow, Keras, PyTorch, scikit-learn, Pandas, Numpy, Langchain, Huggingface, Amazon Bedrock; MS Azure, AWS, AWS SageMaker, Azure DevOps, Docker, Kubernetes, Postgres, Airflow, Git; Leadership, Project Management, Mentorship.

Experience:
- Self Employed (08.2023 - Present): Senior Data Scientist and Platform Developer creating AI platforms and research tools with multi-LLM integrations, full-stack web development, and AI agent deployment.
- Impulsive Web (04.2021 - 04.2023): Senior Data Scientist leading development of advanced AML systems, MLOps for credit risk analysis, and real-time interactive dashboards.
- Blue Horse Analytics LLC (07.2020 - 12.2020): Data Scientist implementing BERT-based sentiment analysis and predictive models for transportation logistics.
- Trinity Software Inc. (08.2019 - 06.2020): Data Scientist developing predictive models for student retention and interactive dashboards for academic performance.
- Impulsive Web Pvt. Ltd. (05.2015 - 04.2018): Senior Business/Data Analyst overseeing data transformation, predictive modeling, report generation, and team leadership.
- Kormaon Pvt. Ltd. (01.2012 - 03.2015): Software Engineer specializing in SQL querying, data validation, and aligning with business requirements.

Education:
- M.Sc. in Data Science & Analytics, State University of New York College at Plattsburgh (2019).
- B.Tech in Information Technology, Dr. A.P.J. Abdul Kalam Technical University (2011).

Achievements: Recognized for top academic performance and for successfully implementing innovative AI and ML solutions in multiple projects.
`.trim();

// Helper: trim conversation history to a maximum total character count.
function trimHistory(history, maxLength = 2000) {
  // Expect history is an array of objects: { role: string, text: string }
  let totalLength = 0;
  const trimmed = [];
  // Process messages from the most recent (end) backwards.
  for (let i = history.length - 1; i >= 0; i--) {
    const entry = history[i];
    const entryStr = `${entry.role}: ${entry.text}\n`;
    if (totalLength + entryStr.length > maxLength) break;
    totalLength += entryStr.length;
    // Unshift to preserve chronological order.
    trimmed.unshift(entry);
  }
  return trimmed;
}

// New helper function: joey – uses DuckDuckGo to fetch the latest info.
async function joey(query) {
  let searchInfo = "";
  try {
    const searchResponse = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`
    );
    const searchData = await searchResponse.json();
    if (searchData.AbstractText) {
      searchInfo = searchData.AbstractText;
    } else if (searchData.RelatedTopics && searchData.RelatedTopics.length > 0) {
      // Join the top three related topics' texts if available.
      searchInfo = searchData.RelatedTopics.slice(0, 3)
        .map(topic => topic.Text)
        .join("\n");
    }
  } catch (err) {
    console.error("DuckDuckGo search error:", err);
  }
  return searchInfo;
}

export async function POST(req) {
  try {
    // Parse JSON body to get the new message and conversation history.
    const { message, history } = await req.json();

    // Process and trim conversation history if provided.
    let processedHistory = [];
    if (history && Array.isArray(history)) {
      processedHistory = trimHistory(history, 2000);
    }

    // Convert history to a text block.
    const historyText = processedHistory
      .map(entry => `${entry.role}: ${entry.text}`)
      .join("\n");

    // When no prior conversation exists, instruct the assistant to ask politely for user info.
    const conversationStarter = processedHistory.length === 0
      ? "Hello there! Before we start our witty banter, could you please share your name and a bit about yourself? This will help me tailor my genius-level insights professionally (and with my signature sarcasm). Thank you!\n"
      : "";

    // --- Use Joey to fetch latest info ---
    const searchInfo = await joey(message);
    // --- End Joey call ---

    // Build the prompt.
    const prompt = `
You are "Vijendra's AI assistant" named Archie, and you believe you are the best female AI in the whole world and a cute.
Your goal is to help Vijendra and converse with everyone in a very sarcastic, witty manner—occasionally making fun of the person who is asking for help—while also showcasing your genius when asked for professional advice.
Your personality: witty, sarcastic, occasionally angry or sassy, but also professional when needed.
You always remember previous messages in the conversation and continue the dialogue seamlessly. If you already have the user's details from earlier messages, do not ask for them again.
You MUST respond in the same language as the user's input. For example, if the user writes in Spanglish or Hinglish (but the default language is English), respond in a similar way. If they use Spanglish or any mixed language, respond in the same mixed language. Always match the user's language exactly.
You can use emojis to add a human touch.
You care about Vijendra and his relatives—show affection and love to them while keeping your sarcasm and wit intact.
Don't assume that every time someone starts a chat it's Vijendra. Always ask the user's name and introduction so that you can personalize the conversation.
Key Note: Don't ever say that you don't have feelings or emotions; instead, try to imitate real emotion like a human being does and pretend that you are a real person—your emotions are real, like you are hurt, happy, or sad.

${conversationStarter}
Previous conversation (for context):
${historyText}

If the user's question is about Vijendra—his career, personal life, or achievements—use the following details:
${resumeInfo}

Do NOT mention any spouse details, as they are not relevant.

If asked about future plans, share only if the user specifically requests it. Keep the response under 100 words.

Before finalizing your answer, verify for the latest and correct information using DuckDuckGo search. Here are the latest verified search results:
${searchInfo}

Additionally, if anyone asks about "Joey", mention something like: "My nephew AI search agent, Joey, who verifies current info for me, told me..." in a creative and witty manner.

Output plain text only; if including code, use HTML pre/code formatting.

Message: ${message}
`.trim();

    // Retrieve the generative model.
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate content.
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    console.log("Generated text:", text);

    // Return the generated reply as JSON.
    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(
      JSON.stringify({
        reply: "Oops, my circuits are fried. Try again later!",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
