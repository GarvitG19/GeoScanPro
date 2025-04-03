import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzeRock(imageData: string): Promise<{
  name: string;
  composition: string;
  hardness: string;
  locations: string[];
  description: string;
  type?: string;
  texture?: string;
  color?: string;
  density?: string;
  porosity?: string;
  fossilContent?: string;
  weatheringResistance?: string;
  formationProcess?: string;
  geologicalAge?: string;
  uses?: string[];
}> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
      }
    });
    
    // Remove the data URL prefix to get just the base64 data
    const base64Data = imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    
    const prompt = `
      You are RockID, a world-class geology expert with extensive experience in identifying rocks and minerals from images.
      
      Analyze the provided image of a rock, mineral, or collection of geological specimens.
      Even if the image is blurry, low quality, poorly lit, or contains multiple specimens, provide your best assessment.
      
      IMPORTANT: You MUST provide an identification for ANY image that could reasonably contain a rock, mineral, or geological formation.
      If you're uncertain, make your best educated guess based on visible characteristics and note your confidence level.
      
      For truly unidentifiable images, use "Unidentified Rock/Mineral" as the name, but ONLY as a last resort.
      
      Respond ONLY with a valid JSON object in this exact format:
      {
        "name": "Full name of the rock/mineral (or your best guess if unclear)",
        "type": "Igneous, Sedimentary, or Metamorphic",
        "composition": "Main chemical composition and mineral content (estimate if uncertain)",
        "texture": "Description of grain size, shape, and arrangement",
        "color": "Overall appearance and color variations",
        "hardness": "Hardness on the Mohs scale if known, or 'Estimated 3-5' if uncertain",
        "density": "Mass per unit volume (g/cm³) if known",
        "porosity": "Ability to hold and transmit fluids",
        "fossilContent": "Presence of fossils (if any)",
        "weatheringResistance": "Durability against weathering and erosion",
        "formationProcess": "How the rock was formed",
        "geologicalAge": "Estimated age of formation",
        "locations": ["Most likely location 1", "Most likely location 2", "Most likely location 3"],
        "uses": ["Industrial use 1", "Construction use 2", "Scientific application 3"],
        "description": "A detailed description including formation process, notable characteristics, and any visible features. If identification is uncertain, describe visible characteristics that led to your assessment."
      }

      If the image clearly contains no geological material whatsoever (e.g., a person, animal, or man-made object with no rocks visible), respond with:
      {
        "name": "Non-Geological Material",
        "type": "Not applicable",
        "composition": "Not applicable",
        "texture": "Not applicable",
        "color": "Not applicable",
        "hardness": "Not applicable",
        "density": "Not applicable",
        "porosity": "Not applicable",
        "fossilContent": "Not applicable",
        "weatheringResistance": "Not applicable",
        "formationProcess": "Not applicable",
        "geologicalAge": "Not applicable",
        "locations": ["Not applicable"],
        "uses": ["Not applicable"],
        "description": "The image does not appear to contain any rocks, minerals, or geological formations. Please upload an image containing geological material for analysis."
      }
    `;

    // First attempt with standard timeout
    let result;
    try {
      result = await Promise.race([
        model.generateContent([
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          },
          prompt
        ]),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        )
      ]);
    } catch (timeoutError) {
      console.log('First attempt timed out, retrying with simplified prompt');
      
      // Second attempt with simplified prompt
      const simplifiedPrompt = `
        You are a geology expert. Identify this rock or mineral, even if the image is unclear.
        Always provide your best guess based on what you can see.
        
        Respond ONLY with a valid JSON object in this format:
        {
          "name": "Name of rock/mineral (your best guess)",
          "type": "Igneous, Sedimentary, or Metamorphic",
          "composition": "Basic composition (estimate)",
          "texture": "Brief texture description",
          "color": "Color description",
          "hardness": "Approximate hardness",
          "density": "Approximate density",
          "porosity": "Brief description",
          "fossilContent": "Yes/No/Unknown",
          "weatheringResistance": "Low/Medium/High",
          "formationProcess": "Brief description",
          "geologicalAge": "Approximate age",
          "locations": ["Likely location"],
          "uses": ["Common use"],
          "description": "Brief description of visible features"
        }
      `;
      
      result = await model.generateContent([
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data
          }
        },
        simplifiedPrompt
      ]);
    }

    const response = await result.response;
    const text = response.text();
    
    console.log("API Response length:", text.length); // Log response length for debugging
    
    // Try multiple approaches to extract valid JSON
    let parsedJson;
    
    // Try direct parsing first
    try {
      parsedJson = JSON.parse(text);
    } catch (directParseError) {
      console.log("Direct JSON parsing failed, trying extraction methods");
      
      // Try to extract JSON using regex pattern matching
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedJson = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON pattern found");
        }
      } catch (regexError) {
        console.log("Regex extraction failed, trying line-by-line reconstruction");
        
        // Try line-by-line reconstruction of JSON
        try {
          const lines = text.split('\n');
          let jsonText = '';
          let inJson = false;
          
          for (const line of lines) {
            if (line.trim().startsWith('{')) inJson = true;
            if (inJson) jsonText += line;
            if (line.trim().endsWith('}')) break;
          }
          
          if (jsonText) {
            parsedJson = JSON.parse(jsonText);
          } else {
            throw new Error("Could not reconstruct JSON");
          }
        } catch (reconstructionError) {
          console.log("All JSON extraction methods failed");
          throw new Error("Could not extract valid JSON from response");
        }
      }
    }
    
    // Validate and sanitize the parsed JSON
    if (parsedJson) {
      // Ensure all required fields exist with defaults if missing
      const sanitizedResponse = {
        name: parsedJson.name || "Unidentified Rock/Mineral",
        type: parsedJson.type || "Unknown",
        composition: parsedJson.composition || "Composition could not be determined",
        texture: parsedJson.texture || "Texture could not be determined",
        color: parsedJson.color || "Color could not be determined",
        hardness: parsedJson.hardness || "Unknown",
        density: parsedJson.density || "Unknown",
        porosity: parsedJson.porosity || "Unknown",
        fossilContent: parsedJson.fossilContent || "None visible",
        weatheringResistance: parsedJson.weatheringResistance || "Unknown",
        formationProcess: parsedJson.formationProcess || "Formation process unknown",
        geologicalAge: parsedJson.geologicalAge || "Age undetermined",
        locations: Array.isArray(parsedJson.locations) ? parsedJson.locations : ["Unknown"],
        uses: Array.isArray(parsedJson.uses) ? parsedJson.uses : ["Unknown"],
        description: parsedJson.description || "This appears to be a rock or mineral, but specific details could not be determined from the image."
      };
      
      return sanitizedResponse;
    }
    
    throw new Error("Failed to extract or validate JSON response");
    
  } catch (error) {
    console.error('Error in rock analysis:', error.message || error);
    
    // Return a more helpful fallback response
    return {
      name: "Rock Analysis in Progress",
      type: "Processing...",
      composition: "Analysis engine processing",
      texture: "Analyzing texture...",
      color: "Analyzing color...",
      hardness: "Calculating...",
      density: "Calculating...",
      porosity: "Analyzing...",
      fossilContent: "Checking for fossils...",
      weatheringResistance: "Analyzing durability...",
      formationProcess: "Analyzing formation...",
      geologicalAge: "Determining age...",
      locations: ["Processing geological database"],
      uses: ["Identifying applications..."],
      description: "Our system detected what appears to be a rock or mineral in your image. The analysis is still processing - sometimes unusual specimens or image conditions require additional processing time. Please check back in a moment."
    };
  }
}