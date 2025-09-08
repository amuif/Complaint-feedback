'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AmharicKeyboardProps {
  onCharacterClick: (char: string) => void;
}

export function AmharicKeyboard({ onCharacterClick }: AmharicKeyboardProps) {
  // Amharic characters organized by type
  const fidel = [
    ['ሀ', 'ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ'],
    ['ለ', 'ሉ', 'ሊ', 'ላ', 'ሌ', 'ል', 'ሎ'],
    ['ሐ', 'ሑ', 'ሒ', 'ሓ', 'ሔ', 'ሕ', 'ሖ'],
    ['መ', 'ሙ', 'ሚ', 'ማ', 'ሜ', 'ም', 'ሞ'],
    ['ሠ', 'ሡ', 'ሢ', 'ሣ', 'ሤ', 'ሥ', 'ሦ'],
    ['ረ', 'ሩ', 'ሪ', 'ራ', 'ሬ', 'ር', 'ሮ'],
    ['ሰ', 'ሱ', 'ሲ', 'ሳ', 'ሴ', 'ስ', 'ሶ'],
    ['ሸ', 'ሹ', 'ሺ', 'ሻ', 'ሼ', 'ሽ', 'ሾ'],
    ['ቀ', 'ቁ', 'ቂ', 'ቃ', 'ቄ', 'ቅ', 'ቆ'],
  ];

  const fidelTwo = [
    ['በ', 'ቡ', 'ቢ', 'ባ', 'ቤ', 'ብ', 'ቦ'],
    ['ተ', 'ቱ', 'ቲ', 'ታ', 'ቴ', 'ት', 'ቶ'],
    ['ቸ', 'ቹ', 'ቺ', 'ቻ', 'ቼ', 'ች', 'ቾ'],
    ['ነ', 'ኑ', 'ኒ', 'ና', 'ኔ', 'ን', 'ኖ'],
    ['ኘ', 'ኙ', 'ኚ', 'ኛ', 'ኜ', 'ኝ', 'ኞ'],
    ['አ', 'ኡ', 'ኢ', 'ኣ', 'ኤ', 'እ', 'ኦ'],
    ['ከ', 'ኩ', 'ኪ', 'ካ', 'ኬ', 'ክ', 'ኮ'],
    ['ኸ', 'ኹ', 'ኺ', 'ኻ', 'ኼ', 'ኽ', 'ኾ'],
    ['ወ', 'ዉ', 'ዊ', 'ዋ', 'ዌ', 'ው', 'ዎ'],
  ];

  const fidelThree = [
    ['ዐ', 'ዑ', 'ዒ', 'ዓ', 'ዔ', 'ዕ', 'ዖ'],
    ['ዘ', 'ዙ', 'ዚ', 'ዛ', 'ዜ', 'ዝ', 'ዞ'],
    ['ዠ', 'ዡ', 'ዢ', 'ዣ', 'ዤ', 'ዥ', 'ዦ'],
    ['የ', 'ዩ', 'ዪ', 'ያ', 'ዬ', 'ይ', 'ዮ'],
    ['ደ', 'ዱ', 'ዲ', 'ዳ', 'ዴ', 'ድ', 'ዶ'],
    ['ጀ', 'ጁ', 'ጂ', 'ጃ', 'ጄ', 'ጅ', 'ጆ'],
    ['ገ', 'ጉ', 'ጊ', 'ጋ', 'ጌ', 'ግ', 'ጎ'],
    ['ጠ', 'ጡ', 'ጢ', 'ጣ', 'ጤ', 'ጥ', 'ጦ'],
    ['ጨ', 'ጩ', 'ጪ', 'ጫ', 'ጬ', 'ጭ', 'ጮ'],
  ];

  const fidelFour = [
    ['ጰ', 'ጱ', 'ጲ', 'ጳ', 'ጴ', 'ጵ', 'ጶ'],
    ['ጸ', 'ጹ', 'ጺ', 'ጻ', 'ጼ', 'ጽ', 'ጾ'],
    ['ፀ', 'ፁ', 'ፂ', 'ፃ', 'ፄ', 'ፅ', 'ፆ'],
    ['ፈ', 'ፉ', 'ፊ', 'ፋ', 'ፌ', 'ፍ', 'ፎ'],
    ['ፐ', 'ፑ', 'ፒ', 'ፓ', 'ፔ', 'ፕ', 'ፖ'],
    ['፩', '፪', '፫', '፬', '፭', '፮', '፯'],
    ['፰', '፱', '፲', '፳', '፴', '፵', '፶'],
    ['፷', '፸', '፹', '፺', '፻', '፼', '፡'],
    ['።', '፣', '፤', '፥', '፦', '፧', '፨'],
  ];

  const punctuation = [
    '.',
    ',',
    '!',
    '?',
    ':',
    ';',
    "'",
    '"',
    '(',
    ')',
    '[',
    ']',
    '{',
    '}',
    '-',
    '_',
    '+',
    '=',
    '/',
    '\\',
    '@',
    '#',
    '$',
    '%',
    '&',
    '*',
    '^',
    '|',
    '~',
    '`',
    '<',
    '>',
    '፡',
    '።',
    '፣',
    '፤',
    '፥',
    '፦',
    '፧',
    '፨',
  ];

  const handleCharacterClick = (e: React.MouseEvent, char: string) => {
    e.preventDefault();
    e.stopPropagation();
    onCharacterClick(char);
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="set1">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="set1">Set 1</TabsTrigger>
          <TabsTrigger value="set2">Set 2</TabsTrigger>
          <TabsTrigger value="set3">Set 3</TabsTrigger>
          <TabsTrigger value="set4">Set 4</TabsTrigger>
          <TabsTrigger value="punct">Punctuation</TabsTrigger>
        </TabsList>

        <TabsContent value="set1" className="mt-0">
          <div className="grid grid-cols-7 gap-1">
            {fidel.map((row, rowIndex) =>
              row.map((char, charIndex) => (
                <Button
                  key={`${rowIndex}-${charIndex}`}
                  variant="outline"
                  className="h-10 w-10 p-0 text-lg"
                  onClick={(e) => handleCharacterClick(e, char)}
                  type="button"
                >
                  {char}
                </Button>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="set2" className="mt-0">
          <div className="grid grid-cols-7 gap-1">
            {fidelTwo.map((row, rowIndex) =>
              row.map((char, charIndex) => (
                <Button
                  key={`${rowIndex}-${charIndex}`}
                  variant="outline"
                  className="h-10 w-10 p-0 text-lg"
                  onClick={(e) => handleCharacterClick(e, char)}
                  type="button"
                >
                  {char}
                </Button>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="set3" className="mt-0">
          <div className="grid grid-cols-7 gap-1">
            {fidelThree.map((row, rowIndex) =>
              row.map((char, charIndex) => (
                <Button
                  key={`${rowIndex}-${charIndex}`}
                  variant="outline"
                  className="h-10 w-10 p-0 text-lg"
                  onClick={(e) => handleCharacterClick(e, char)}
                  type="button"
                >
                  {char}
                </Button>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="set4" className="mt-0">
          <div className="grid grid-cols-7 gap-1">
            {fidelFour.map((row, rowIndex) =>
              row.map((char, charIndex) => (
                <Button
                  key={`${rowIndex}-${charIndex}`}
                  variant="outline"
                  className="h-10 w-10 p-0 text-lg"
                  onClick={(e) => handleCharacterClick(e, char)}
                  type="button"
                >
                  {char}
                </Button>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="punct" className="mt-0">
          <div className="grid grid-cols-10 gap-1">
            {punctuation.map((char, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-10 w-10 p-0 text-lg"
                onClick={(e) => handleCharacterClick(e, char)}
                type="button"
              >
                {char}
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          className="w-1/4"
          onClick={(e) => handleCharacterClick(e, ' ')}
          type="button"
        >
          Space
        </Button>
        <Button
          variant="outline"
          className="w-1/4"
          onClick={(e) => handleCharacterClick(e, '\n')}
          type="button"
        >
          Enter
        </Button>
        <Button
          variant="outline"
          className="w-1/4"
          onClick={(e) => handleCharacterClick(e, '\t')}
          type="button"
        >
          Tab
        </Button>
        <Button
          variant="destructive"
          className="w-1/4"
          onClick={(e) => handleCharacterClick(e, '\b')}
          type="button"
        >
          Backspace
        </Button>
      </div>
    </div>
  );
}
