import { generateResponse } from "../services/ai.service.js";
import User from "../models/User.model.js";
import Website from "../models/Website.model.js";
import { extractJson } from "../utils/json.utils.js";
import { nanoid } from "nanoid";

/**
 * Stage 1: Blueprint Structural Mapper
 * Outputs a structural JSON map of required sections, components, color theme, and interactivity.
 */
const runStage1Blueprint = async (userPrompt) => {
  const blueprintPrompt = `
YOU ARE AN EXPERT WEBSITE ARCHITECT.
Analyze the user prompt and generate a structured JSON blueprint map defining the page sections, component trees, color scheme, typography, and interactive features.

USER PROMPT:
${userPrompt}

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "siteTitle": "Name of the website",
  "theme": {
    "primaryColor": "Hex/HSL color string",
    "secondaryColor": "Hex/HSL color string",
    "backgroundColor": "Hex/HSL color string",
    "textColor": "Hex/HSL color string"
  },
  "sections": [
    { "name": "Navbar", "components": ["Logo", "Nav Links", "Action CTA"] },
    { "name": "Hero", "components": ["Headline", "Subheadline", "CTA Buttons", "Hero Image"] },
    { "name": "Features/Services", "components": ["Section Title", "Grid Cards (3-4 items)"] },
    { "name": "About/Stats", "components": ["Company Story", "Metrics Badges"] },
    { "name": "Pricing/Offerings", "components": ["Tier Cards", "Feature Checklist", "Action Buttons"] },
    { "name": "Contact", "components": ["Contact Form", "Details List"] },
    { "name": "Footer", "components": ["Copyright", "Navigation Links", "Social Icons"] }
  ],
  "interactivity": ["JS SPA page navigation", "Mobile menu toggle", "Form validation", "Hover micro-animations"]
}
`;

  try {
    const rawResult = await generateResponse(blueprintPrompt, { maxTokens: 1500, temperature: 0.2 });
    const blueprint = extractJson(rawResult);
    return blueprint || { siteTitle: userPrompt.slice(0, 40), sections: ["Navbar", "Hero", "Features", "Footer"] };
  } catch (err) {
    console.error("Stage 1 Blueprint failed, falling back to standard prompt:", err);
    return { siteTitle: userPrompt.slice(0, 40) };
  }
};

/**
 * Stage 2: Code Generation
 * Generates full HTML, CSS, and JS SPA code driven by Stage 1 Blueprint.
 */
const runStage2CodeGeneration = async (userPrompt, blueprint) => {
  const codePrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT AND UI/UX ENGINEER.
Generate a complete, production-grade, single-file HTML website (including CSS in <style> and JS in <script>) following the structural blueprint provided below.

USER PROMPT:
${userPrompt}

STRUCTURAL BLUEPRINT:
${JSON.stringify(blueprint, null, 2)}

DESIGN & TECHNICAL RULES (NON-NEGOTIABLE):
- Single self-contained valid HTML document.
- Modern CSS (Flexbox/Grid, mobile media queries, CSS variables, glassmorphism, responsive sizing).
- SPA navigation in JavaScript: At least Home page MUST be visible by default (e.g., .page { display: none } and .page.active { display: block }).
- Business-ready content (NO lorem ipsum placeholders).
- All images MUST be high quality Unsplash URLs with ?auto=format&fit=crop&w=1200&q=80.

OUTPUT FORMAT (STRICT RAW JSON ONLY):
{
  "message": "Short summary of the website created",
  "code": "<FULL VALID HTML DOCUMENT>"
}
`;

  let rawResult = "";
  let parsedData = null;

  for (let attempt = 0; attempt < 2 && !parsedData; attempt++) {
    rawResult = await generateResponse(codePrompt, { maxTokens: 4000, temperature: 0.3 });
    parsedData = extractJson(rawResult);

    if (!parsedData) {
      rawResult = await generateResponse(codePrompt + "\n\nCRITICAL: YOU MUST RETURN RAW JSON ONLY.", { maxTokens: 4000, temperature: 0.2 });
      parsedData = extractJson(rawResult);
    }
  }

  return parsedData;
};

/**
 * Stage 3: Linter & Reviewer
 * Evaluates generated code for unstyled elements, responsiveness, and SPA active page visibility.
 */
const runStage3LinterReviewer = async (userPrompt, initialParsedData) => {
  if (!initialParsedData || !initialParsedData.code) return initialParsedData;

  const reviewerPrompt = `
YOU ARE A SENIOR FRONTEND CODE LINTER & QUALITY REVIEWER.
Review the following generated HTML website code for bugs, unstyled elements, non-responsive layouts, or missing SPA active visibility.

USER PROMPT:
${userPrompt}

GENERATED HTML CODE TO REVIEW:
${initialParsedData.code}

QUALITY CHECKLIST TO ENFORCE & FIX:
1. Ensure media queries exist for mobile (<768px), tablet, and desktop viewports.
2. Ensure at least ONE page section has visible display status on initial load (.page.active { display: block }).
3. Ensure all buttons, forms, and cards have modern CSS styling (hover states, rounded corners, padding).
4. Ensure no unstyled default browser HTML elements or broken JS handlers exist.

OUTPUT FORMAT (STRICT RAW JSON ONLY):
{
  "message": "Summary of linting and quality improvements applied",
  "code": "<FULL POLISHED VALID HTML DOCUMENT>"
}
`;

  try {
    const rawResult = await generateResponse(reviewerPrompt, { maxTokens: 4000, temperature: 0.2 });
    const reviewedParsed = extractJson(rawResult);

    if (reviewedParsed && reviewedParsed.code && reviewedParsed.code.length > 100) {
      return reviewedParsed;
    }
  } catch (err) {
    console.error("Stage 3 Reviewer notice: Keeping Stage 2 output:", err);
  }

  return initialParsedData;
};

/**
 * Handles generating a new website using the 3-Stage Pipeline
 */
export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "A design prompt is required." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "User session not authenticated." });
    }

    if (user.credit < 50) {
      return res.status(400).json({ message: "Insufficient credits. Generating a website costs 50 credits." });
    }

    console.log(`[Pipeline Stage 1] Generating structural blueprint for prompt: "${prompt}"...`);
    const blueprint = await runStage1Blueprint(prompt);

    console.log(`[Pipeline Stage 2] Generating layout & CSS code from blueprint...`);
    const stage2Data = await runStage2CodeGeneration(prompt, blueprint);

    if (!stage2Data || !stage2Data.code) {
      return res.status(502).json({ message: "AI code generation processing error. Please try again." });
    }

    console.log(`[Pipeline Stage 3] Running Linter & Quality Reviewer...`);
    const finalData = await runStage3LinterReviewer(prompt, stage2Data);

    const newWebsite = await Website.create({
      user: user._id,
      title: blueprint.siteTitle || prompt.slice(0, 60),
      latestcode: finalData.code,
      slug: nanoid(10),
      conversations: [
        {
          role: "ai",
          content: finalData.message || "Generated website blueprint and code successfully.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { credit: -50 } },
      { returnDocument: "after" }
    );

    return res.status(201).json({
      websiteId: newWebsite._id,
      remainingCredit: updatedUser.credit,
    });
  } catch (error) {
    console.error("Website generation failed:", error);
    const errorMessage = error?.message?.includes("invalid_api_key") || error?.message?.includes("Invalid API Key")
      ? "Invalid Groq API Key. Please configure a valid GROQ_API_KEY in backend/.env"
      : error?.message || "An internal server error occurred during website generation.";
    return res.status(500).json({ message: errorMessage });
  }
};

/**
 * Retrieves a single website structure by its unique ID
 */
export const getWebsiteById = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found.", success: false });
    }

    return res.status(200).json(website);
  } catch (error) {
    console.error("Error retrieving website:", error);
    return res.status(500).json({ message: "An error occurred while loading the website." });
  }
};

/**
 * Updates an existing website code structure using an AI request
 */
export const updateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "A modification prompt is required." });
    }

    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found.", success: false });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "Session expired or user not authenticated." });
    }

    if (user.credit < 25) {
      return res.status(400).json({ message: "Insufficient credits. Modifying a website costs 25 credits." });
    }

    const updatePromptText = `
YOU ARE A SENIOR FRONTEND ENGINEER.

MODIFY THE EXISTING WEBSITE BASED ON USER REQUEST.

IMPORTANT:
- KEEP ALL EXISTING FEATURES
- ONLY APPLY THE REQUESTED CHANGE
- RETURN FULL UPDATED HTML FILE

CURRENT HTML:
${website.latestcode}

USER REQUEST:
${prompt}

RETURN RAW JSON ONLY:
{
 "message":"Short confirmation",
 "code":"<FULL UPDATED HTML>"
}
`;

    let rawResult = "";
    let parsedData = null;

    for (let attempt = 0; attempt < 2 && !parsedData; attempt++) {
      rawResult = await generateResponse(updatePromptText, { maxTokens: 4000, temperature: 0.3 });
      parsedData = extractJson(rawResult);

      if (!parsedData) {
        rawResult = await generateResponse(updatePromptText + "\n\nCRITICAL: YOU MUST RETURN RAW JSON ONLY.", { maxTokens: 4000, temperature: 0.2 });
        parsedData = extractJson(rawResult);
      }
    }

    if (!parsedData || !parsedData.code) {
      console.error("AI failed to output valid JSON for update request:", rawResult);
      return res.status(502).json({ message: "AI response processing error during update." });
    }

    website.conversations.push(
      { role: "user", content: prompt },
      { role: "ai", content: parsedData.message }
    );
    website.latestcode = parsedData.code;
    await website.save();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { credit: -25 } },
      { returnDocument: "after" }
    );

    return res.status(200).json({
      message: parsedData.message,
      code: parsedData.code,
      remainingCredit: updatedUser.credit,
    });
  } catch (error) {
    console.error("Error updating website:", error);
    return res.status(500).json({ message: "An error occurred while modifying the website." });
  }
};

/**
 * Fetches all websites owned by the active user
 */
export const getAllWebsites = async (req, res) => {
  try {
    const websites = await Website.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(websites);
  } catch (error) {
    console.error("Error retrieving user websites:", error);
    return res.status(500).json({ message: "Failed to load projects list." });
  }
};

/**
 * Deploys the website and assigns a public url slug
 */
export const deployWebsite = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found.", success: false });
    }

    if (!website.slug) {
      website.slug =
        website.title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .slice(0, 60) + website._id.toString().slice(-5);
    }

    website.deployed = true;
    website.deployUrl = `${process.env.FRONTEND_URL}/site/${website.slug}`;
    await website.save();

    return res.status(200).json({ url: website.deployUrl });
  } catch (error) {
    console.error("Deployment failed:", error);
    return res.status(500).json({ message: "An error occurred during site deployment." });
  }
};

/**
 * Retrieves website layout by its unique public slug
 */
export const getWebsiteBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let website = await Website.findOne({ slug });

    if (!website && slug.match(/^[0-9a-fA-F]{24}$/)) {
      website = await Website.findById(slug);
    }

    if (!website) {
      return res.status(404).json({ message: "Website not found.", success: false });
    }

    return res.status(200).json(website);
  } catch (error) {
    console.error("Error looking up website by slug:", error);
    return res.status(500).json({ message: "An error occurred retrieving the live site." });
  }
};
