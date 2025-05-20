<template>
  <div id="app">
    <TranslateUI @translate="translateText" />
    
    <div class="results-container">
      <div v-if="translatedText" class="translated-result">
        <h2>Translated Text:</h2>
        <p>{{ translatedText }}</p>
        <button @click="speakTranslatedText(translatedText, currentTargetLanguage)" class="speak-btn">
          Speak
        </button>
      </div>

      <!-- History section -->
      <div class="history-section">
        <h2>Translation History</h2>
        <select v-if="history.length" class="history-dropdown">
          <option v-for="(item, index) in history" :key="index" :value="item.english">
            {{ item.english }} → {{ item.translated }}
            <button @click="speakTranslatedText(item.translated, item.targetLanguage)" class="history-speak-btn">
              Speak
            </button>
          </option>
        </select>
        <p v-else>No translations yet.</p>
        
        <!-- Clear history button -->
        <button 
          v-if="history.length" 
          @click="clearHistory" 
          class="clear-history-btn">
          Clear History
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TranslateUI from './components/TranslateUI.vue';
import axios from 'axios';

export default {
  components: {
    TranslateUI
  },
  data() {
    return {
      translatedText: '',
      currentTargetLanguage: '',
      history: []
    }
  },
  methods: {
    async translateText(englishText, targetLanguage) {
      if (!englishText.trim()) {
        this.translatedText = 'Please enter text to translate.';
        return;
      }

      this.currentTargetLanguage = targetLanguage;

      console.log('Input text:', englishText);
      console.log('Target language:', targetLanguage);
      
      const commonPhrases = {
        'hi': {
          'how are you': 'आप कैसे हैं',
          'hello': 'नमस्ते',
          'thank you': 'धन्यवाद',
          'good morning': 'सुप्रभात',
          'good night': 'शुभ रात्रि',
          'what is your name': 'आपका नाम क्या है',
          'my name is': 'मेरा नाम है',
          'i love you': 'मैं तुमसे प्यार करता हूँ',
          'how are you doing': 'आप कैसे हैं',
          'goodbye': 'अलविदा',
          'see you later': 'फिर मिलेंगे'
        },
        'es': {
          'how are you': '¿Cómo estás?',
          'hello': 'Hola',
          'thank you': 'Gracias',
          'good morning': 'Buenos días',
          'good night': 'Buenas noches',
          'what is your name': '¿Cuál es tu nombre?',
          'my name is': 'Mi nombre es',
          'i love you': 'Te amo',
          'how are you doing': '¿Cómo estás?',
          'goodbye': 'Adiós',
          'see you later': 'Hasta luego'
        },
        'fr': {
          'how are you': 'Comment vas-tu ?',
          'hello': 'Bonjour',
          'thank you': 'Merci',
          'good morning': 'Bon matin',
          'good night': 'Bonne nuit',
          'what is your name': 'Comment vous appelez-vous ?',
          'my name is': 'Je m’appelle',
          'i love you': 'Je t’aime',
          'how are you doing': 'Comment vas-tu ?',
          'goodbye': 'Au revoir',
          'see you later': 'À plus tard'
        },
        'de': {
          'how are you': 'Wie geht es dir?',
          'hello': 'Hallo',
          'thank you': 'Danke',
          'good morning': 'Guten Morgen',
          'good night': 'Gute Nacht',
          'what is your name': 'Wie heißt du?',
          'my name is': 'Mein Name ist',
          'i love you': 'Ich liebe dich',
          'how are you doing': 'Wie geht es dir?',
          'goodbye': 'Auf Wiedersehen',
          'see you later': 'Bis später'
        }
      };
      
      const lowerInput = englishText.toLowerCase().trim();
      if (commonPhrases[targetLanguage] && commonPhrases[targetLanguage][lowerInput]) {
        const translatedText = commonPhrases[targetLanguage][lowerInput];
        this.translatedText = translatedText;
        
        this.history.unshift({ english: englishText, translated: translatedText, targetLanguage });
        
        if (this.history.length > 10) {
          this.history.pop();
        }
        
        return;
      }

      try {
        let translatedText = await this.tryMyMemoryAPI(englishText, targetLanguage);
        
        if (targetLanguage === 'hi') {
          const invalidTranslations = ['उड़ीसा', 'ओडिशा'];
          if (invalidTranslations.includes(translatedText.trim())) {
            throw new Error('Potentially incorrect translation detected');
          }
        }
        
        this.translatedText = translatedText;

        this.history.unshift({ english: englishText, translated: translatedText, targetLanguage });
        
        if (this.history.length > 10) {
          this.history.pop();
        }

        console.log('Updated history:', this.history);
      } catch (error) {
        console.error('Primary API error:', error.message);
        
        try {
          console.log('Trying fallback API...');
          const translatedText = await this.tryGoogleTranslateAlternative(englishText, targetLanguage);
          
          this.translatedText = translatedText;
          
          this.history.unshift({ english: englishText, translated: translatedText, targetLanguage });
          
          if (this.history.length > 10) {
            this.history.pop();
          }
        } catch (fallbackError) {
          console.error('Fallback API error:', fallbackError.message);
          
          this.translatedText = 'Error: Translation services unavailable. Please try again later.';
          
          this.history.unshift({ english: englishText, translated: this.translatedText, targetLanguage });
          if (this.history.length > 10) {
            this.history.pop();
          }
        }
      }
    },
    
    async tryMyMemoryAPI(text, targetLanguage) {
      const response = await axios.get(
        'https://api.mymemory.translated.net/get',
        {
          params: {
            q: text,
            langpair: `en|${targetLanguage}`
          }
        }
      );
      
      console.log('MyMemory API Response:', response.data);
      
      const translatedText = response.data.responseData.translatedText;
      
      if (!translatedText || translatedText === text) {
        throw new Error('MyMemory translation failed');
      }
      
      return translatedText;
    },
    
    clearHistory() {
      this.history = [];
      console.log('History cleared');
    },
    
    async tryGoogleTranslateAlternative(text, targetLanguage) {
      const response = await axios.get(
        'https://translated-mymemory---translation-memory.p.rapidapi.com/get',
        {
          params: {
            langpair: `en|${targetLanguage}`,
            q: text,
            mt: '1'
          },
          headers: {
            'X-RapidAPI-Key': 'process.env.RAPIDAPI_KEY',
            'X-RapidAPI-Host': 'translated-mymemory---translation-memory.p.rapidapi.com'
          }
        }
      );
      
      console.log('RapidAPI Response:', response.data);
      
      const translatedText = response.data.responseData.translatedText;
      
      if (!translatedText || translatedText === text) {
        throw new Error('RapidAPI translation failed');
      }
      
      return translatedText;
    },

    speakTranslatedText(text, targetLanguage) {
      if (text.startsWith('Error:')) {
        console.warn('Skipping speech for error message:', text);
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));

      const languageVoiceMap = {
        'hi': ['hi-IN'],
        'es': ['es-ES', 'es-MX'],
        'fr': ['fr-FR', 'fr-CA'],
        'de': ['de-DE', 'de-AT']
      };

      const langCodes = languageVoiceMap[targetLanguage] || ['en-US'];
      let selectedVoice = null;

      for (const langCode of langCodes) {
        selectedVoice = voices.find(v => v.lang === langCode);
        if (selectedVoice) break;
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith(targetLanguage));
      }

      if (!selectedVoice) {
        selectedVoice = voices[0];
        console.warn(`No suitable voice found for language: ${targetLanguage}. Falling back to default voice:`, selectedVoice?.name);
        this.translatedText = `Warning: No voice available for ${targetLanguage}. Using default voice.`;
      } else {
        console.log('Selected voice:', selectedVoice.name, 'Language:', selectedVoice.lang);
      }

      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;

      utterance.volume = 1;
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        this.translatedText = 'Error: Could not speak the translated text.';
      };

      window.speechSynthesis.speak(utterance);
    }
  },
  mounted() {
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('Voices loaded:', voices.map(v => ({ name: v.name, lang: v.lang })));
    };
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  background: #000;
  min-height: 100vh;
  margin: 0;
  padding: 20px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.results-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 750px; /* Adjusted to fit both sections side by side */
  justify-content: center;
}

.translated-result {
  background-color: #111;
  padding: 15px 25px;
  border-radius: 10px;
  width: 350px;
  box-shadow: 0 0 15px #ffcc0044;
}

.translated-result h2 {
  color: #ffcc00;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 1.5rem;
}

.translated-result p {
  font-size: 1.2rem;
  font-weight: 500;
  color: #fff;
}

.speak-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #ffcc00;
  color: #000;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 0 10px #ffcc0055;
  width: 100%;
}

.speak-btn:hover {
  background-color: #e6b800;
  box-shadow: 0 0 15px #ffcc00cc;
}

.speak-btn:active {
  transform: scale(0.98);
}

.history-section {
  background-color: #111;
  padding: 15px 25px;
  border-radius: 10px;
  width: 350px;
  box-shadow: 0 0 15px #ffcc0044;
}

.history-section h2 {
  color: #ffcc00;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 1.5rem;
}

.history-section p {
  font-size: 1.2rem;
  font-weight: 500;
  color: #fff;
}

.history-dropdown {
  width: 100%;
  padding: 10px;
  font-size: 1.1rem;
  border: none;
  border-radius: 5px;
  background-color: #222;
  color: #fff;
  box-shadow: 0 0 10px #ffcc0055;
}

.history-dropdown option {
  background-color: #222;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-speak-btn {
  margin-left: 10px;
  padding: 4px 8px;
  background-color: #ffcc00;
  color: #000;
  border: none;
  border-radius: 3px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.history-speak-btn:hover {
  background-color: #e6b800;
}

.history-speak-btn:active {
  transform: scale(0.98);
}

.clear-history-btn {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #db0000;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
  width: 100%;
}

.clear-history-btn:hover {
  background-color: #ff0000;
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
}

.clear-history-btn:active {
  transform: scale(0.98);
}

/* Responsive design for smaller screens */
@media (max-width: 768px) {
  .results-container {
    flex-direction: column;
    align-items: center;
  }

  .translated-result,
  .history-section {
    width: 350px;
  }
}
</style>