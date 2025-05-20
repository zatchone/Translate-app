<template>
  <div class="container">
    <h1 class="title">Translate app</h1>
    
    <input 
      v-model="inputText" 
      class="input-field" 
      type="text" 
      placeholder="Type your English text here..."
    />
    
    <select v-model="targetLanguage" class="language-dropdown">
      <option value="hi">Hindi</option>
      <option value="es">Spanish</option>
      <option value="fr">French</option>
      <option value="de">German</option>
    </select>
    
    <button class="translate-btn" @click="$emit('translate', inputText, targetLanguage)">
      Translate
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputText: '',
      targetLanguage: 'hi' // Default to Hindi
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.container {
  background: #000; /* Ensure black background */
  color: #fff;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center; /* vertical center */
  align-items: center;    /* horizontal center */
  padding: 20px;
  text-align: center;
}

.title {
  font-weight: 600;
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #ffcc00; /* bright yellow */
  text-shadow: 0 0 10px #ffcc00aa;
}

.input-field {
  width: 350px;
  padding: 15px 20px;
  font-size: 1.1rem;
  border: none;
  border-radius: 10px;
  outline: none;
  margin-bottom: 1.5rem;
  background-color: #222;
  color: #fff;
  box-shadow: 0 0 15px #ffcc0055;
  transition: box-shadow 0.3s ease;
}

.input-field::placeholder {
  color: #aaa;
}

.input-field:focus {
  box-shadow: 0 0 25px #ffcc00cc;
}

.language-dropdown {
  width: 350px;
  padding: 10px 20px;
  font-size: 1.1rem;
  border: none;
  border-radius: 10px;
  outline: none;
  margin-bottom: 1.5rem;
  background-color: #222;
  color: #fff;
  box-shadow: 0 0 15px #ffcc0055;
  transition: box-shadow 0.3s ease;
}

.language-dropdown option {
  background-color: #222;
  color: #fff;
}

.language-dropdown:focus {
  box-shadow: 0 0 25px #ffcc00cc;
}

.translate-btn {
  background: #ffcc00;
  color: #000;
  font-weight: 700;
  font-size: 1.2rem;
  padding: 15px 40px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 20px #ffcc00bb;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.translate-btn:hover {
  background: #e6b800;
  box-shadow: 0 0 30px #ffcc00ee;
}
</style>