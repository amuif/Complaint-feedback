'use client';
import React, { useState, useRef } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

interface AmharicKeyboardProps {
  onCharacterClick?: (char: string) => void;
}

export default function AmharicKeyboard({ onCharacterClick }: AmharicKeyboardProps) {
  const [input, setInput] = useState('');
  const keyboard = useRef<any>(null);

  const handleChange = (input: string) => {
    setInput(input);
    // Call the callback prop if provided
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

  return (
    <div className="p-4">
      <textarea
        value={input}
        onChange={handleInputChange}
        className="border p-2 w-full mb-2 rounded"
        rows={4}
        placeholder="እባክዎት እዚህ ይጻፉ..."
      />
      <Keyboard
        keyboardRef={(r) => (keyboard.current = r)}
        layout={amharicLayout}
        onChange={handleChange}
      />
    </div>
  );
}
