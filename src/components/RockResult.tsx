import React from 'react';
import { Info, Share2, Loader2 } from 'lucide-react';

interface RockProperties {
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
}

interface RockResultProps {
  image: string;
  properties?: RockProperties | null;
  loading?: boolean;
  isDark?: boolean;
}

export const RockResult: React.FC<RockResultProps> = ({ image, properties, loading, isDark = false }) => {
  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white/90 dark:bg-[#080a09]/90 backdrop-blur-sm rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center">
          <img
            src={image}
            alt="Analyzing rock"
            className="w-full h-48 object-cover rounded-lg mb-6"
          />
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-[#4a4a4a] dark:text-[#e3ddd7] animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-[#4a4a4a] dark:text-[#e3ddd7] mb-2">Analyzing Rock Sample</h3>
            <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#4a4a4a] to-[#4a4a4a]/80 dark:from-[#e3ddd7] dark:to-[#e3ddd7]/80 animate-pulse" style={{ width: '70%' }}></div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-4 text-center">
              Our AI is analyzing mineral composition, structure, and properties...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!properties) {
    return (
      <div className="w-full max-w-md mx-auto">
        <img
          src={image}
          alt="Captured rock"
          className="w-full h-48 object-cover rounded-lg shadow-lg"
        />
        <p className="text-center mt-4 text-gray-600 dark:text-[#e3ddd7]">Analyzing image...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 dark:bg-[#080a09]/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
      <img
        src={image}
        alt={properties.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-[#4a4a4a] dark:text-[#e3ddd7]">{properties.name}</h2>
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `RockScan Pro - ${properties.name}`,
                  text: `Check out this ${properties.name} I found using RockScan Pro!`,
                  url: window.location.href,
                });
              }
            }}
          >
            <Share2 className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7]" />
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {/* Type */}
          {properties.type && (
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#4a4a4a] dark:text-[#e3ddd7]">Type</h3>
                <p className="text-gray-600 dark:text-gray-400">{properties.type}</p>
              </div>
            </div>
          )}

          {/* Composition */}
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7] mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-[#4a4a4a] dark:text-[#e3ddd7]">Mineral Composition</h3>
              <p className="text-gray-600 dark:text-gray-400">{properties.composition}</p>
            </div>
          </div>

          {/* Texture */}
          {properties.texture && (
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#4a4a4a] dark:text-[#e3ddd7]">Texture</h3>
                <p className="text-gray-600 dark:text-gray-400">{properties.texture}</p>
              </div>
            </div>
          )}

          {/* Color */}
          {properties.color && (
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#4a4a4a] dark:text-[#e3ddd7]">Color</h3>
                <p className="text-gray-600 dark:text-gray-400">{properties.color}</p>
              </div>
            </div>
          )}

          {/* Hardness */}
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7] mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-[#4a4a4a] dark:text-[#e3ddd7]">Hardness</h3>
              <p className="text-gray-600 dark:text-gray-400">{properties.hardness}</p>
            </div>
          </div>

          {/* Density */}
          {properties.density && (
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#4a4a4a] dark:text-[#e3ddd7]">Density</h3>
                <p className="text-gray-600 dark:text-gray-400">{properties.density}</p>
              </div>
            </div>
          )}

          {/* Porosity & Permeability */}
          {properties.porosity && (
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#4a4a4a] dark:text-[#e3ddd7]">Porosity & Permeability</h3>
                <p className="text-gray-600 dark:text-gray-400">{properties.porosity}</p>
              </div>
            </div>
          )}

          {/* Fossil Content */}
          {properties.fossilContent && (
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#4a4a4a] dark:text-[#e3ddd7]">Fossil Content</h3>
                <p className="text-gray-600 dark:text-gray-400">{properties.fossilContent}</p>
              </div>
            </div>
          )}

          {/* Weathering & Erosion Resistance */}
          {properties.weatheringResistance && (
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#4a4a4a] dark:text-[#e3ddd7]">Weathering & Erosion Resistance</h3>
                <p className="text-gray-600 dark:text-gray-400">{properties.weatheringResistance}</p>
              </div>
            </div>
          )}

          {/* Formation Process */}
          {properties.formationProcess && (
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#4a4a4a] dark:text-[#e3ddd7]">Formation Process</h3>
                <p className="text-gray-600 dark:text-gray-400">{properties.formationProcess}</p>
              </div>
            </div>
          )}

          {/* Geological Age */}
          {properties.geologicalAge && (
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#4a4a4a] dark:text-[#e3ddd7]">Geological Age</h3>
                <p className="text-gray-600 dark:text-gray-400">{properties.geologicalAge}</p>
              </div>
            </div>
          )}

          {/* Common Locations */}
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7] mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-[#4a4a4a] dark:text-[#e3ddd7]">Common Locations</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                {properties.locations.map((location, index) => (
                  <li key={index}>{location}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Uses */}
          {properties.uses && (
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-[#4a4a4a] dark:text-[#e3ddd7] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#4a4a4a] dark:text-[#e3ddd7]">Uses</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                  {properties.uses.map((use, index) => (
                    <li key={index}>{use}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mt-4">{properties.description}</p>
        </div>
      </div>
    </div>
  );
};