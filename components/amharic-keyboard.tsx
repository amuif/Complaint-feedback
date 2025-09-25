'use client';
import React, { useState, useRef, useEffect } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { useLanguage } from './language-provider';
import { useTheme } from 'next-themes';

interface AmharicKeyboardProps {
  onCharacterClick?: (char: string) => void;
}

export default function AmharicKeyboard({ onCharacterClick }: AmharicKeyboardProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const keyboard = useRef<any>(null);

  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  const handleChange = (input: string) => {
    setInput(input);
    if (onCharacterClick) {
      onCharacterClick(input);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setInput(value);
    if (keyboard.current) {
      keyboard.current.setInput(value);
    }
  };

  const amharicLayout = {
    default: [
      'ሀ ለ ሐ መ ሠ ረ ሰ ቀ በ ተ ኀ ነ አ ከ ወ ዐ ዘ ዠ የ ጀ ገ ጠ ጰ ፀ ፈ ፐ',
      'ሁ ሉ ሑ ሙ ሡ ሩ ሱ ቁ ቡ ቱ ኁ ኑ ኡ ኩ ዉ ዑ ዙ ዡ ዩ ጁ ጉ ጡ ጱ ፁ ፉ ፑ',
      'ሂ ሊ ሒ ሚ ሢ ሪ ሲ ቂ ቢ ቲ ኒ ኢ ኪ ዊ ዒ ዚ ዢ ዪ ጂ ጊ ጢ ጲ ፂ ፊ ፒ',
      'ሃ ላ ሓ ማ ሣ ራ ሳ ቃ ባ ታ ና ኣ ካ ዋ ዓ ዛ ዣ ያ ጃ ጋ ጣ ጳ ፃ ፋ ፓ',
      'ሄ ሌ ሔ ሜ ሤ ሬ ሴ ቄ ቤ ቴ ኔ ኤ ኬ ዌ ዔ ዜ ዤ ዬ ጄ ጌ ጤ ጴ ፄ ፌ ፔ',
      'ህ ል ሕ ም ሥ ር ስ ቅ ብ ት ን እ ክ ው ዕ ዝ ዥ ይ ጅ ግ ጥ ጵ ፅ ፍ ፕ',
      'ሆ ሎ ሖ ሞ ሦ ሮ ሶ ቆ ቦ ቶ ኖ ኦ ኮ ዎ ዖ ዞ ዦ ዮ ጆ ጎ ጦ ጶ ፆ ፎ ፖ',
      '{space}',
    ],
  };

  // Custom CSS for responsive design and centered space bar
  const customCss = `
    /* Responsive keyboard */
    .simple-keyboard {
      max-width: 100%;
      font-family: inherit;
    }
    
    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .simple-keyboard {
        font-size: 12px;
      }
      
      .hg-button {
        height: 40px;
        padding: 4px 6px;
        min-width: 24px;
      }
    }
    
    @media (max-width: 480px) {
      .simple-keyboard {
        font-size: 10px;
      }
      
      .hg-button {
        height: 35px;
        padding: 2px 4px;
        min-width: 20px;
      }
    }
    
    /* Centered and narrow space bar */
    .simple-keyboard .hg-row:last-child {
      display: flex;
      justify-content: center;
      width: 100%;
    }
    
    .hg-button.hg-button-space {
      max-width: 400px !important;
      min-width: 400px !important;
      flex: 0 1 auto !important;
    }
    
    @media (max-width: 768px) {
      .hg-button.hg-button-space {
        max-width: 120px !important;
        min-width: 100px !important;
      }
    }
    
    @media (max-width: 480px) {
      .hg-button.hg-button-space {
        max-width: 80px !important;
        min-width: 60px !important;
      }
    }
    
    /* Ensure proper dark theme from react-simple-keyboard */
    .hg-theme-default.hg-layout-default {
      background-color: #ececec;
    }
    
    .hg-theme-default.hg-layout-default .hg-button {
      background-color: white;
      color: black;
    }
    
    .hg-theme-dark.hg-layout-default {
      background-color: #1a1a1a;
    }
    
    .hg-theme-dark.hg-layout-default .hg-button {
      background-color: #333;
      color: white;
    }
    
    .hg-theme-dark.hg-layout-default .hg-button:active,
    .hg-theme-dark.hg-layout-default .hg-button:focus {
      background-color: #555;
    }
  `;

  return (
    <div className="p-4">
      <style>{customCss}</style>
      <textarea
        value={input}
        onChange={handleInputChange}
        rows={4}
        placeholder={t('amharic.keyboard.placeholder')}
        className="border p-2 w-full mb-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-colors duration-200"
      />

      <div className="w-full max-w-6xl mx-auto">
        <Keyboard
          keyboardRef={(r) => (keyboard.current = r)}
          layout={amharicLayout}
          onChange={handleChange}
          theme={`hg-theme-default ${isDarkMode ? 'hg-theme-dark' : ''}`}
          baseClass="simple-keyboard"
          display={{
            '{space}': ' ',
          }}
          // Update options when theme changes
          key={`keyboard-${isDarkMode ? 'dark' : 'light'}`}
        />
      </div>
    </div>
  );
}
