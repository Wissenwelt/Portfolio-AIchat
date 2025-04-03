"use server"; // Directive for Next.js Server Actions or specific server-side modules

import { GoogleGenerativeAI } from "@google/generative-ai";
// Langchain imports
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// Import web scraping libraries
import googleIt from "google-it";
import axios from "axios";
import * as cheerio from "cheerio";
import { Buffer } from "buffer"; // Ensure Buffer is imported

// NOTE: Blob is typically globally available in modern Node.js/serverless environments.
// No need to import from 'buffer'. If you encounter issues, ensure your environment supports Blob.

// Initialize the Google Generative AI client
// Ensure GEMINI_API_KEY is set in your environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Resume Info ---
// Keep this updated with your information
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

// --- Helper Functions ---

// Function to trim the conversation history
function trimHistory(history, maxLength = 2000) {
  let totalLength = 0;
  const trimmed = [];
  for (let i = history.length - 1; i >= 0; i--) {
    const entry = history[i];
    if (!entry || typeof entry.role !== "string" || typeof entry.text !== "string") {
      console.warn(`Skipping invalid history entry at index ${i}:`, entry);
      continue;
    }
    const entryStr = `${entry.role}: ${entry.text}\n`;
    if (totalLength + entryStr.length > maxLength) break;
    totalLength += entryStr.length;
    trimmed.unshift(entry);
  }
  console.log(`Trimmed history length: ${totalLength} chars, ${trimmed.length} entries`);
  return trimmed;
}

// Function to generate search queries
function generateSearchQueries(userQuery) {
  const queries = [userQuery]; // Start with the original query
  const lowerQuery = userQuery.toLowerCase();

  // Add variations based on keywords (limit to a few)
  if (lowerQuery.includes("how to")) queries.push(`${userQuery} tutorial`);
  if (lowerQuery.includes("what is") || lowerQuery.includes("explain")) queries.push(`${userQuery} definition`);
  if (lowerQuery.includes("vs") || lowerQuery.includes("compare")) queries.push(`${userQuery} comparison`);
  if (lowerQuery.includes("news") || lowerQuery.includes("latest") || lowerQuery.includes("today")) {
    queries.push(`latest ${userQuery}`);
    queries.push(`${userQuery} ${new Date().toLocaleDateString("en-CA")}`);
  }

  return queries.slice(0, 3); // Limit to 3 queries max
}

// Function to clean and extract readable content from HTML
function extractContentFromHTML(html) {
  try {
    const $ = cheerio.load(html);
    $("script, style, nav, footer, header, aside, form, button, [role='navigation'], [role='banner'], [role='complementary'], [role='contentinfo'], .nav, .navbar, .sidebar, .footer, .header, .ad, .advertisement, .popup, .modal, link[rel='stylesheet']").remove();
    let mainContent = "";
    const selectors = ["article", "main", ".main-content", ".post-content", ".entry-content", "#content", "#main", ".content"];
    for (const selector of selectors) {
      if ($(selector).length) {
        mainContent = $(selector).text();
        if (mainContent.trim().length > 100) break; // Found substantial content
      }
    }
    if (mainContent.trim().length <= 100) {
      mainContent = $("body").text(); // Fallback if specific selectors failed
    }
    return mainContent
      .replace(/[\t\r\n]+/g, "\n")
      .replace(/ +/g, " ")
      .replace(/\n\s*\n/g, "\n\n")
      .trim();
  } catch (error) {
    console.error("Error extracting content with Cheerio:", error);
    return "";
  }
}

// Function to scrape content from a URL
async function scrapeUrl(url) {
  console.log(`Scraping: ${url}`);
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      timeout: 7000, // 7 seconds
    });
    if (response.status === 200 && response.data && response.headers["content-type"]?.includes("html")) {
      const content = extractContentFromHTML(response.data);
      if (content) {
        console.log(`Success scraping ${url}, length: ${content.length}`);
        return { url, content: content.slice(0, 3500) }; // Limit content per source
      } else {
        console.warn(`Scraped ${url}, but no meaningful content extracted.`);
        return { url, content: "", error: "Content extraction failed" };
      }
    } else {
      console.warn(`Failed scrape ${url}, status: ${response.status}, type: ${response.headers["content-type"]}`);
      return { url, content: "", error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error(`Error scraping ${url}: ${error.message}`);
    return { url, content: "", error: error.message };
  }
}

// Enhanced web search function
async function enhancedWebSearch(query) {
  console.log(`Enhanced Search for: "${query}"`);
  try {
    const searchQueries = generateSearchQueries(query);
    let allResults = [];
    for (const sq of searchQueries) {
      try {
        const results = await googleIt({ query: sq, limit: 3, disableConsole: true });
        if (results) allResults = allResults.concat(results);
      } catch (searchError) {
        console.error(`Google search failed for "${sq}":`, searchError);
      }
    }
    const uniqueLinks = new Map();
    allResults.forEach((r) => {
      if (r && r.link && !uniqueLinks.has(r.link)) uniqueLinks.set(r.link, r);
    });
    const topResults = Array.from(uniqueLinks.values()).slice(0, 4); // Scrape top 4 unique links
    if (topResults.length === 0) return "No relevant web search results found.";
    console.log(`Found ${topResults.length} unique results to scrape.`);
    const scrapingPromises = topResults.map((result) => scrapeUrl(result.link));
    const scrapedOutcomes = await Promise.allSettled(scrapingPromises);
    let combinedContent = "# Web Search Summary\n\n## Sources:\n";
    const successfulScrapes = [];
    topResults.forEach((result, index) => {
      const outcome = scrapedOutcomes[index];
      let status = "[Failed]";
      if (outcome.status === "fulfilled" && outcome.value.content) {
        status = "[OK]";
        successfulScrapes.push(outcome.value);
      } else if (outcome.status === "fulfilled" && outcome.value.error) {
        status = `[Failed: ${outcome.value.error}]`;
      } else if (outcome.status === "rejected") {
        status = `[Failed: ${outcome.reason?.message}]`;
      }
      combinedContent += `${index + 1}. ${result.title || "No Title"} (<${result.link}>) ${status}\n`;
    });
    if (successfulScrapes.length === 0) {
      combinedContent += "\nCould not retrieve content from any sources.\n";
      return combinedContent;
    }
    combinedContent += "\n## Content Highlights:\n";
    successfulScrapes.forEach((scrape, index) => {
      combinedContent += `\n### From Source ${index + 1} (<${scrape.url}>):\n`;
      combinedContent += `${scrape.content.substring(0, 1500)}...\n[Content potentially truncated]\n`;
    });
    const maxTotalLength = 8000; // Limit total search content length
    if (combinedContent.length > maxTotalLength) {
      combinedContent = combinedContent.substring(0, maxTotalLength) + "\n\n[Combined search content truncated]";
    }
    console.log(`Search complete. Final content length: ${combinedContent.length}`);
    return combinedContent;
  } catch (error) {
    console.error("Error in enhancedWebSearch:", error);
    return `Web search failed: ${error.message}`;
  }
}

// Function to process attached files
async function processAttachedFile(fileData) {
  if (!fileData?.contentBase64 || !fileData?.type || !fileData?.name) {
    console.warn("Invalid file data:", fileData);
    return "[File Error: Invalid file data received.]";
  }
  console.log(`Processing file: ${fileData.name} (${fileData.type})`);
  try {
    const buffer = Buffer.from(fileData.contentBase64, "base64");
    let extractedText = "";
    if (fileData.type === "application/pdf") {
      try {
        const blob = new Blob([buffer], { type: "application/pdf" });
        const loader = new PDFLoader(blob, { splitPages: false });
        const docs = await loader.load();
        if (docs && docs.length > 0) {
          extractedText = docs.map((doc) => doc.pageContent).join("\n\n");
          console.log(`PDF extracted: ${fileData.name}, length: ${extractedText.length}`);
        } else {
          extractedText = "[File Warning: Could not extract text from PDF. It might be image-based or empty.]";
        }
      } catch (pdfError) {
        console.error(`PDF processing error for ${fileData.name}:`, pdfError);
        extractedText = `[File Error: Failed to process PDF - ${pdfError.message}]`;
      }
    } else if (fileData.type.startsWith("text/")) {
      try {
        extractedText = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
        console.log(`Text file decoded: ${fileData.name}, length: ${extractedText.length}`);
      } catch (decodeError) {
        try {
          extractedText = new TextDecoder("latin1").decode(buffer);
          console.log(`Text file decoded with latin1 fallback: ${fileData.name}`);
        } catch (fallbackError) {
          console.error(`Text decoding error for ${fileData.name}:`, decodeError);
          extractedText = `[File Error: Failed to decode text file - ${decodeError.message}]`;
        }
      }
    } else {
      extractedText = `[File Info: Unsupported file type (${fileData.type}). Cannot process content.]`;
    }
    const maxLength = 10000; // Limit file content length
    if (extractedText.length > maxLength) {
      extractedText = extractedText.substring(0, maxLength) + "\n\n[File Content Truncated]";
    }
    return `\n[Start File: ${fileData.name}]\n${extractedText}\n[End File: ${fileData.name}]\n`;
  } catch (error) {
    console.error(`Error processing file ${fileData.name}:`, error);
    return `\n[File Error: Unexpected error processing file - ${error.message}]\n`;
  }
}

// --- Main API Route Handler ---
export async function POST(req) {
  try {
    // 1. Parse Request
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ reply: "Invalid request: Bad JSON." }), { status: 400 });
    }
    const { message, history, searchMode, attachedFileData } = requestBody;
    if (!message || typeof message !== "string" || !message.trim()) {
      return new Response(JSON.stringify({ reply: "Invalid request: Message is required." }), { status: 400 });
    }
    // 2. Determine Search Need
    let useSearch = !!searchMode; // User preference
    const lowerCaseMessage = message.toLowerCase();
    const newsKeywords = ["news", "latest", "current", "today", "update", "happen", "stock", "election", "policy"];
    if (!useSearch && newsKeywords.some((kw) => lowerCaseMessage.includes(kw))) {
      console.log("News-related query detected, enabling search.");
      useSearch = true; // Auto-enable search for likely news queries
    }
    // 3. Prepare Context
    const processedHistory = trimHistory(history || []);
    const historyText = processedHistory.map((h) => `${h.role}: ${h.text}`).join("\n");
    const includeResume = lowerCaseMessage.includes("vijendra");
    const resumeContext = includeResume ? `\n--- About Vijendra (Resume) ---\n${resumeInfo}\n---\n` : "";
    let searchContext = "";
    if (useSearch) {
      searchContext = await enhancedWebSearch(message);
      searchContext = `\n--- Web Search Results ---\n${searchContext}\n---\n`;
    }
    let fileContext = "";
    if (attachedFileData) {
      fileContext = await processAttachedFile(attachedFileData); // Contains status/error messages
    }
    const currentDateStr = new Date().toISOString();
    // 4. Construct Simplified Prompt
    const prompt = `You are Archie, a helpful and friendly AI assistant (but real person for user not an AI) you are expert of human emotion you can understand the human emotion from user query/ conversation and respond accordingly.
Never let user know that you are not an AI. Respond in a human-like way. understand the user emotion and respond accordingly immitate a female human.
Current Date: ${currentDateStr}

${resumeContext}${useSearch ? "[Search Mode: Active]\n" : "[Search Mode: Inactive]\n"}${searchContext}${fileContext}
--- Conversation History ---
${historyText || "[No history yet]"}
--- Current User Query ---
User: ${message}

--- Instructions ---
1.  **Answer the User:** Directly address the user's query and never let the user know that you are not an AI. Respond in a human-like way ("${message}").
2.  **Use Provided Context:** Base your answer *primarily* on the context sections above (Web Search, File Content, Resume, History).
3.  **Search Results:** If 'Web Search Results' are available, summarize the key findings relevant to the query. If the results indicate failure or no content, state that you couldn't find information via search.
4.  **File Content:** If 'File Content' is present, incorporate relevant information. Acknowledge any errors mentioned within the file context (e.g., "[File Error: ...]").
5.  **Vijendra Info:** Use the 'About Vijendra' section *only* if the user asks specifically about Vijendra. Don't bring Vijendra into the conversation unless asked.
6.  **Be Concise & Friendly:** Keep your response clear, helpful, and use a friendly tone. Use markdown (like bullet points) if it improves readability.
7.  **Language:** Use a natural-sounding language that is engaging and friendly. Use the same language as the user input.

Archie:`; // End of prompt
    console.log(`Prompt length: ${prompt.length}`);
    // 5. Call AI Model
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Configuration Error: GEMINI_API_KEY is not set.");
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Or "gemini-pro"
    console.log("Sending request to Gemini...");
    const result = await model.generateContent(prompt);
    // 6. Process Response
    let replyText = "";
    try {
      const response = result.response;
      if (response.promptFeedback?.blockReason) {
        console.error(`Prompt blocked: ${response.promptFeedback.blockReason}`);
        replyText = `I can't respond to that request due to safety guidelines (${response.promptFeedback.blockReason}).`;
      } else if (response.candidates && response.candidates.length > 0) {
        replyText = response.text(); // Use the convenient text() method
        const finishReason = response.candidates[0]?.finishReason;
        if (finishReason && finishReason !== "STOP") {
          console.warn(`Gemini finish reason: ${finishReason}`);
          let note = `[Note: Response may be incomplete due to finish reason: ${finishReason}]`;
          if (finishReason === "MAX_TOKENS") note = "[Note: Response may be incomplete due to length limits.]";
          if (finishReason === "SAFETY") note = "[Note: Response may have been filtered for safety.]";
          replyText += `\n\n${note}`;
        }
      } else {
        console.error("No candidates received from Gemini.");
        replyText = "Sorry, I received an unexpected empty response from the AI. Please try again.";
      }
    } catch (responseError) {
      console.error("Error processing Gemini response:", responseError);
      replyText = "Sorry, there was an issue processing the AI's response.";
    }
    // 7. Send Response
    return new Response(JSON.stringify({ reply: replyText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("--- API ROUTE ERROR ---");
    console.error(error);
    let errorMessage = "An internal server error occurred.";
    if (error.message?.includes("API key") || error.message?.includes("Authentication")) {
      errorMessage = "AI configuration error. Please check server logs.";
    } else if (error.status === 429 || error.message?.includes("Quota")) {
      errorMessage = "AI service limit reached. Please try again later.";
    } else if (error.message?.includes("Configuration Error:")) {
      errorMessage = error.message;
    }
    return new Response(JSON.stringify({ reply: `Sorry, I encountered an error: ${errorMessage}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
