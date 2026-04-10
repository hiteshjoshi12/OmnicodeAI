const Settings = require('../models/Settings');

// Helper to get or create the default settings document
const getSettingsDoc = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      maintenanceMode: false,
      signupEnabled: true,
      defaultCredits: 15,
      prompts: [
        { id: 1, name: 'Code Generator Base', content: 'You are an expert full-stack developer...' },
        { id: 2, name: 'Email Writer Base', content: 'You are a professional copywriter...' }
      ],
      pricingPlans: [
        { id: 'free', name: 'Free', price: '0', description: 'Perfect for trying out Omnicode AI.', features: '15 Credits/mo\nBasic Code Generation\nCommunity Support', buttonText: 'Get Started', premium: false },
        { id: 'pro', name: 'Pro', price: '499', description: 'For professional developers.', features: '1,000 Credits/mo\nFull App Scaffolding\nPriority Support', buttonText: 'Try Pro Now', premium: true },
        { id: 'enterprise', name: 'Enterprise', price: 'Custom', description: 'Advanced tools for scaling teams.', features: 'Unlimited Credits\nTeam Management\nSLA Guarantee', buttonText: 'Contact Sales', premium: false }
      ]
    });
  }
  return settings;
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await getSettingsDoc();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await getSettingsDoc();
    
    // Update CMS Tab Data
    if (req.body.prompts) settings.prompts = req.body.prompts;
    if (req.body.pricingPlans) settings.pricingPlans = req.body.pricingPlans;

    // Update Settings Tab Data (Check for undefined since booleans can be false)
    if (req.body.maintenanceMode !== undefined) settings.maintenanceMode = req.body.maintenanceMode;
    if (req.body.signupEnabled !== undefined) settings.signupEnabled = req.body.signupEnabled;
    if (req.body.defaultCredits !== undefined) settings.defaultCredits = req.body.defaultCredits;

    await settings.save();
    res.status(200).json({ message: "Settings updated successfully", settings });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};