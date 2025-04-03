import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
// In production, you would use an environment variable for the API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY';
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Fetches information about a rock or mineral using Google's Gemini AI
 * @param query The rock or mineral to get information about
 * @returns A promise that resolves to the rock information text
 */
export async function getRockInfo(query: string): Promise<string> {
  try {
    // For development/demo purposes, return mock data if no API key is provided
    if (API_KEY === 'YOUR_API_KEY') {
      return getMockRockInfo(query);
    }

    // Initialize the model with configuration
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      }
    });

    // Check if this is the first query (rock name) or a follow-up question
    const isInitialQuery = !query.toLowerCase().includes('regarding');
    
    let prompt;
    
    if (isInitialQuery) {
      // For initial rock queries, request structured information
      prompt = `Provide detailed information about the rock or mineral "${query}" in the following format:

Type: [Igneous, Sedimentary, or Metamorphic]
Mineral Composition: [Key minerals present]
Texture: [Grain size, shape, and arrangement]
Color: [Overall appearance]
Hardness: [Measured on Mohs scale]
Density: [Mass per unit volume]
Porosity & Permeability: [Ability to hold and transmit fluids]
Fossil Content: [Presence of fossils (if any)]
Weathering & Erosion Resistance: [Durability]
Formation Process: [How it was formed]
Geological Age: [Estimated age of formation]
Location & Occurrence: [Where it is commonly found]
Uses: [Industrial, construction, or scientific applications]

After providing this structured information, add a brief paragraph summarizing the most interesting facts about this rock or mineral.

IMPORTANT: Do not use asterisks (*) or markdown formatting in your response. Use plain text only.
If this is not a recognized rock or mineral, please explain that and suggest similar rocks or minerals that might have been meant.`;
    } else {
      // For follow-up questions, use a more conversational approach
      prompt = `The user is asking a follow-up question: "${query}"
      
Please provide a clear, informative answer about this geological topic. Focus on being educational and accurate.

IMPORTANT: Do not use asterisks (*) or markdown formatting in your response. Use plain text only.
Keep your response conversational but scientifically accurate.`;
    }

    // Generate content using the model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Remove any remaining asterisks just to be safe
    text = text.replace(/\*/g, '');
    
    return text;
  } catch (error) {
    console.error('Error getting rock information:', error);
    return getMockRockInfo(query);
  }
}

/**
 * Fetches detailed information about a rock using Gemini AI
 * @param rockName The name of the rock to get detailed information about
 * @returns A promise that resolves to an object with detailed rock properties
 */
export async function getDetailedRockInfo(rockName: string): Promise<Record<string, string>> {
  try {
    // For development/demo purposes, return mock data if no API key is provided
    if (API_KEY === 'YOUR_API_KEY') {
      return getMockDetailedRockInfo(rockName);
    }

    // Initialize the model with configuration
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
      }
    });

    // Create a structured prompt to get specific rock properties
    const prompt = `
    Provide detailed information about the rock or mineral "${rockName}" in a structured format.
    Return ONLY a JSON object with the following properties (no other text):
    
    {
      "type": "Rock type (Igneous, Sedimentary, or Metamorphic) or mineral classification",
      "mineralComposition": "Key minerals present in the rock",
      "texture": "Description of grain size, shape, and arrangement",
      "color": "Overall appearance and color variations",
      "hardness": "Hardness on Mohs scale",
      "density": "Mass per unit volume",
      "porosityPermeability": "Ability to hold and transmit fluids",
      "fossilContent": "Presence of fossils (if any)",
      "weatheringResistance": "Durability and resistance to weathering",
      "formationProcess": "How the rock was formed",
      "geologicalAge": "Estimated age of formation or typical age range",
      "location": "Where it is commonly found",
      "uses": "Industrial, construction, or scientific applications"
    }
    
    If any information is not applicable or unknown, use "Not applicable" or "Information not available".
    `;

    // Generate content using the model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Parse the JSON response
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      // If parsing fails, extract JSON from the text (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      // If all else fails, return mock data
      return getMockDetailedRockInfo(rockName);
    }
  } catch (error) {
    console.error('Error getting detailed rock information:', error);
    return getMockDetailedRockInfo(rockName);
  }
}

// Mock data functions for development/demo purposes
function getMockRockInfo(query: string): string {
  const rockName = query.toLowerCase();
  const isInitialQuery = !query.toLowerCase().includes('regarding');
  
  if (isInitialQuery) {
    // Structured format for initial rock queries
    if (rockName.includes('granite')) {
      return `Type: Igneous (Intrusive)
Mineral Composition: Quartz (20-60%), Alkali Feldspar (35-90%), Plagioclase (10-65%), Micas (Biotite and Muscovite), Amphibole (Hornblende)
Texture: Phaneritic (coarse-grained), with visible interlocking crystals
Color: Light-colored, typically white, pink, or gray with black mineral specks
Hardness: 6-7 on Mohs scale
Density: 2.65-2.75 g/cm³
Porosity & Permeability: Low porosity (0.5-1.5%), low permeability
Fossil Content: None (igneous rocks do not contain fossils)
Weathering & Erosion Resistance: High resistance to weathering and erosion
Formation Process: Slow cooling and crystallization of silica-rich magma beneath Earth's surface
Geological Age: Varies widely, from Precambrian to Cenozoic (over 3 billion years to less than 65 million years)
Location & Occurrence: Found in continental crust worldwide, forms the cores of many mountain ranges
Uses: Building stone, countertops, floor tiles, paving stone, monuments, curbing

Granite is one of the most abundant rock types in the continental crust and has been used throughout human history for construction due to its strength and durability. Its distinctive speckled appearance comes from the various minerals that compose it, with the color variations determined by the specific mineral ratios.`;
    } else if (rockName.includes('limestone')) {
      return `Type: Sedimentary
Mineral Composition: Primarily calcite (CaCO₃), with some aragonite and dolomite
Texture: Variable - can be clastic, crystalline, or biologic; often fossiliferous
Color: Usually white to gray, can be yellow, tan, or brown
Hardness: 3-4 on Mohs scale
Density: 2.5-2.7 g/cm³
Porosity & Permeability: Variable porosity (1-30%), moderate permeability
Fossil Content: Often rich in fossils (shells, corals, algae)
Weathering & Erosion Resistance: Low resistance, susceptible to chemical weathering (dissolution)
Formation Process: Accumulation and lithification of calcium carbonate sediments in marine environments
Geological Age: Found in rocks of all ages, from Precambrian to Recent
Location & Occurrence: Widespread in shallow, warm marine environments, both ancient and modern
Uses: Building material, cement production, agricultural lime, flux in metallurgy

Limestone is fascinating because it often preserves detailed fossils, providing valuable insights into ancient life. It's also the primary rock type that forms karst landscapes with caves, sinkholes, and underground drainage systems when dissolved by slightly acidic water.`;
    } else if (rockName.includes('marble')) {
      return `Type: Metamorphic
Mineral Composition: Primarily calcite or dolomite
Texture: Non-foliated, crystalline, interlocking mosaic of recrystallized carbonate minerals
Color: White when pure, various colors due to impurities (gray, pink, green, etc.)
Hardness: 3-4 on Mohs scale
Density: 2.5-2.8 g/cm³
Porosity & Permeability: Low porosity (0.5-2%), low permeability
Fossil Content: Rarely preserved due to recrystallization during metamorphism
Weathering & Erosion Resistance: Moderate resistance, susceptible to acid rain
Formation Process: Metamorphism of limestone or dolomite under heat and pressure
Geological Age: Various, depends on the age of the parent limestone
Location & Occurrence: Found in metamorphic terrains worldwide
Uses: Sculpture, building material, decorative elements, countertops

Marble has been prized for thousands of years for its beauty and workability. Famous sculptures like Michelangelo's David were carved from marble, and iconic structures like the Taj Mahal and the Parthenon showcase its enduring appeal as a building material.`;
    } else if (rockName.includes('basalt')) {
      return `Type: Igneous (Extrusive)
Mineral Composition: Plagioclase feldspar, pyroxene, olivine, with minor iron-titanium oxides
Texture: Fine-grained (aphanitic), sometimes with vesicles (gas bubbles)
Color: Dark gray to black
Hardness: 5-6 on Mohs scale
Density: 2.8-3.0 g/cm³
Porosity & Permeability: Variable porosity (1-50% in vesicular basalt), low permeability in dense basalt
Fossil Content: None (igneous rocks do not contain fossils)
Weathering & Erosion Resistance: Moderate to high resistance
Formation Process: Rapid cooling of lava at or near Earth's surface
Geological Age: Found in rocks of all ages, from Precambrian to Recent
Location & Occurrence: Oceanic crust, volcanic islands, continental flood basalts
Uses: Construction aggregate, road base, railroad ballast, asphalt pavement

Basalt is the most common rock type on Earth's surface, forming the majority of the ocean floor. Massive basalt flows have created spectacular geological features like the Giant's Causeway in Ireland and the Columbia River Basalt Group, which covers parts of Washington, Oregon, and Idaho with over 174,000 cubic kilometers of basalt.`;
    } else if (rockName.includes('sandstone')) {
      return `Type: Sedimentary
Mineral Composition: Primarily quartz, with feldspar, mica, and rock fragments
Texture: Clastic, with visible sand grains cemented together
Color: Varies widely - tan, brown, yellow, red, gray, white
Hardness: 6-7 on Mohs scale (for quartz grains)
Density: 2.2-2.8 g/cm³
Porosity & Permeability: High porosity (5-25%), high permeability
Fossil Content: May contain fossils, but less common than in limestone
Weathering & Erosion Resistance: Variable, depending on cement and composition
Formation Process: Lithification of sand deposits through compaction and cementation
Geological Age: Found in rocks of all ages, from Precambrian to Recent
Location & Occurrence: Widespread in continental and shallow marine environments
Uses: Building stone, paving, filtration, glass production

Sandstone often preserves ancient environments in its sedimentary structures, allowing geologists to reconstruct past landscapes. Its high porosity makes it an important reservoir rock for groundwater, oil, and natural gas, while its varied colors have made it a popular building material throughout history.`;
    } else {
      return `Information about "${query}" is not available in our database. This rock or mineral may be less common or require specialized identification. 

Here are some common rocks you might be interested in:
- Igneous rocks: Granite, Basalt, Obsidian, Pumice
- Sedimentary rocks: Limestone, Sandstone, Shale, Conglomerate
- Metamorphic rocks: Marble, Slate, Schist, Gneiss

Please try searching for one of these, or provide more details about the rock you're interested in.`;
    }
  } else {
    // Conversational format for follow-up questions
    if (rockName.includes('granite') && rockName.includes('formation')) {
      return `Granite forms deep beneath the Earth's surface through a process called plutonism. It begins when magma (molten rock) with high silica content rises from the mantle into the crust but doesn't reach the surface. As this magma cools very slowly over thousands to millions of years, minerals crystallize and form the interlocking crystal structure characteristic of granite.

The slow cooling allows large crystals to form, which is why you can see the individual mineral grains in granite with the naked eye. This texture is called "phaneritic." The primary minerals that crystallize are quartz, feldspars, and smaller amounts of micas and amphiboles.

Granite typically forms in continental collision zones, where tectonic plates converge, generating the heat and pressure needed to create magma. After formation, granite can be exposed at the surface through uplift and erosion of overlying rocks over millions of years.`;
    } else if (rockName.includes('limestone') && rockName.includes('caves')) {
      return `Limestone caves form through a process called karstification, which is essentially the dissolution of limestone by slightly acidic water. Here's how it happens:

When rainwater absorbs carbon dioxide from the atmosphere and soil, it forms a weak carbonic acid (H2CO3). As this acidic water percolates through cracks in limestone, it dissolves the calcium carbonate (CaCO3) in a chemical reaction:

CaCO3 + H2CO3 → Ca(HCO3)2 (calcium bicarbonate, which is soluble in water)

Over thousands to millions of years, this dissolution enlarges cracks into passages and rooms, eventually forming extensive cave systems. The process is extremely slow, with dissolution rates typically less than 1mm per year.

Famous limestone cave systems include Mammoth Cave in Kentucky (the world's longest known cave system), Carlsbad Caverns in New Mexico, and the Postojna Cave in Slovenia. These caves often feature spectacular formations like stalactites, stalagmites, and flowstones, which form when dissolved calcium carbonate redeposits as water evaporates or loses carbon dioxide.`;
    } else if (rockName.includes('uses')) {
      return `Rocks and minerals have countless uses in our modern world, forming the foundation of many industries:

Building and Construction: Granite, limestone, marble, and sandstone are used for buildings, monuments, countertops, and decorative elements. Crushed stone (often limestone, granite, or basalt) is used for concrete aggregate, road base, and railroad ballast.

Manufacturing: Limestone is essential for cement production. Silica from sandstone is used in glass manufacturing. Various minerals provide raw materials for ceramics, abrasives, and refractories.

Agriculture: Crushed limestone (agricultural lime) is applied to soil to reduce acidity. Some mineral-rich rocks are used as soil amendments.

Energy: Certain sedimentary rocks like coal provide fuel. Porous sandstones and limestones serve as reservoir rocks for oil and natural gas.

Water Filtration: Sandstone and other porous rocks are used in water filtration systems.

Technology: Many rocks contain minerals essential for electronics and technology. For example, quartz (found in granite and sandstone) is used in watches and electronics for its piezoelectric properties.

Art and Decoration: Marble, alabaster, and soapstone are carved into sculptures. Many rocks are polished for decorative purposes or jewelry.

The specific uses of a rock depend on its properties - hardness, durability, appearance, chemical composition, and availability all determine how we utilize different rock types.`;
    } else {
      return `I don't have specific information about that aspect of ${query.split(':')[0].replace('Regarding ', '')}. However, I can tell you that geology is a fascinating field that studies the solid Earth, the rocks of which it is composed, and the processes by which they change over time.

If you have questions about specific rock types (igneous, sedimentary, or metamorphic), their formation processes, mineral composition, or other geological topics, I'd be happy to provide more information. Feel free to ask about granite, limestone, basalt, marble, sandstone, or other common rock types.`;
    }
  }
}

function getMockDetailedRockInfo(rockName: string): Record<string, string> {
  const normalizedName = rockName.toLowerCase().trim();
  
  const rockData: Record<string, Record<string, string>> = {
    "granite": {
      "type": "Igneous (Intrusive)",
      "mineralComposition": "Quartz (20-60%), Alkali Feldspar (35-90%), Plagioclase (10-65%), Micas (Biotite and Muscovite), Amphibole (Hornblende)",
      "texture": "Phaneritic (coarse-grained), with visible interlocking crystals",
      "color": "Light-colored, typically white, pink, or gray with black mineral specks",
      "hardness": "6-7 on Mohs scale",
      "density": "2.65-2.75 g/cm³",
      "porosityPermeability": "Low porosity (0.5-1.5%), low permeability",
      "fossilContent": "None (igneous rocks do not contain fossils)",
      "weatheringResistance": "High resistance to weathering and erosion",
      "formationProcess": "Slow cooling and crystallization of silica-rich magma beneath Earth's surface",
      "geologicalAge": "Varies widely, from Precambrian to Cenozoic (over 3 billion years to less than 65 million years)",
      "location": "Found in continental crust worldwide, forms the cores of many mountain ranges",
      "uses": "Building stone, countertops, floor tiles, paving stone, monuments, curbing"
    }
  }
}