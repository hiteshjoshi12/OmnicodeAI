// controllers/aiController.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const History = require('../models/History');



// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate code using Gemini & deduct a credit
// @route   POST /api/ai/generate-code
// @access  Private
const generateCode = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Please provide a prompt.' });
    }

    // 1. Fetch the user to check their credit balance
    const user = await User.findById(req.user.id);

    // 2. Enforce the Paywall
    if (user.plan !== 'Enterprise' && user.credits <= 0) {
      return res.status(403).json({ 
        message: 'You have run out of credits. Please upgrade your plan to continue building.' 
      });
    }

    // 3. Configure Gemini Model with System Instructions
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash', // <--- UPDATED TO THE NEWEST MODEL
      systemInstruction: "You are an expert full-stack developer. Write clean, modern, and highly optimized code. Provide only the code, with minimal conversational filler."
    });

    // 4. Call the AI
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();
    // ---> NEW: Save to History Database <---
    // Create a short title from the prompt (first 30 characters)
    const title = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt;
    
    await History.create({
      user: req.user.id,
      appType: 'code',
      title: title,
      prompt: prompt,
      content: generatedText
    });

    // 5. Deduct a credit (Unless they are Enterprise)
    if (user.plan !== 'Enterprise') {
      user.credits -= 1;
      await user.save();
    }

    // 6. Send the code and the new credit balance back to React
    res.status(200).json({
      success: true,
      code: generatedText,
      newCreditBalance: user.credits
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      message: 'Failed to generate code. The AI might be overloaded.',
      error: error.message 
    });
  }
};




// @desc    Generate an Image
// @route   POST /api/ai/generate-image
const generateImage = async (req, res) => {
  try {
    const { prompt, aspectRatio, style } = req.body;
    const user = req.user; 

    // 1. Check credits
    if (user.credits < 2) {
      return res.status(403).json({ message: "Insufficient credits." });
    }

    // 2. Initialize Gemini Image Model
    const imageAi = new GoogleGenerativeAI(process.env.GEMINI_IMAGE_API_KEY);
    const model = imageAi.getGenerativeModel({ model: 'gemini-2.5-flash-image' });

    // 3. Strict prompt optimization
    const finalPrompt = `${prompt.trim()}, ${style} style, ${aspectRatio} ratio.`;

    // 4. Generate the image
    const result = await model.generateContent(finalPrompt);
    
    // --- 5. THE FIX: EXTRACT THE IMAGE CORRECTLY (No .text()!) ---
    const parts = result.response.candidates[0].content.parts;
    let base64Image = "";
    
    // Loop through the response parts to find the image data
    for (const part of parts) {
      if (part.inlineData) {
        // Combine the mimeType and base64 data so React can use it directly!
        base64Image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    // Failsafe in case the AI blocked the prompt for safety reasons
    if (!base64Image) {
      return res.status(400).json({ message: "Image generation failed or was blocked by safety filters." });
    }

    // 6. Generate a quick title
    const shortTitle = prompt.split(' ').slice(0, 5).join(' ') + '...';

    // 7. Save to MongoDB
    const newTask = await History.create({
      user: user._id,
      appType: 'image',
      title: shortTitle,     
      provider: 'gemini',    
      prompt: finalPrompt,
      content: base64Image, // <--- Now this is a real base64 string, not empty!
      creditsUsed: 2,
      metadata: { aspectRatio, style } 
    });

    // 8. Deduct Credits
    user.credits -= 2;
    await user.save();

    // 9. Send it all back to the frontend
    res.status(200).json({
      taskId: newTask._id,     
      imageUrl: base64Image, 
      newCreditBalance: user.credits,
      usage: result.response.usageMetadata || { promptTokenCount: 'N/A', candidatesTokenCount: 'N/A' }
    });

  } catch (error) {
    console.error("Image Generation Error:", error);
    res.status(500).json({ message: "Failed to generate image." });
  }
};




// @desc    Generate an email using Gemini
// @route   POST /api/ai/generate-email
// @access  Private
const generateEmail = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ message: 'Please provide a prompt.' });

    const user = await User.findById(req.user.id);
    if (user.credits <= 0) return res.status(403).json({ message: 'Out of credits.' });

    // Using Gemini 2.5 Flash for fast text generation
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: "You are an expert copywriter. Write highly converting, professional emails."
    });

    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    // Force the database to save this as an 'email' appType!
    await History.create({
      user: req.user.id,
      appType: 'email', 
      title: "Email Draft", 
      prompt: prompt,
      content: generatedText
    });

    user.credits -= 1;
    await user.save();

    res.status(200).json({ success: true, code: generatedText, newCreditBalance: user.credits });

  } catch (error) {
    console.error("Email Generation Error:", error);
    res.status(500).json({ message: 'Failed to generate email.', error: error.message });
  }
};

// Update your exports at the bottom!
module.exports = {
  generateCode,
  generateImage,
  generateEmail // <-- Add it here
};




