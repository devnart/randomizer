<script setup>
import Button from '../components/Button.vue';
import { ref } from 'vue';

const text = ref('');
const result = ref('');
const isEmpty = ref(false);

const splitInput = () => {
    const inputText = text.value.replace(/^,\s*|,\s*$/g, "");
    const items = inputText.split(',');

    if (inputText == "" || items.length === 0) {
        result.value = '';
        isEmpty.value = true;
        return;
    }

    isEmpty.value = false;
    const randomIndex = Math.floor(Math.random() * items.length);
    result.value = items[randomIndex].trim();
};

</script>

<template>
            <h1>Randomizer</h1>
    <main>

        <div class="input-group">
            <div v-if="isEmpty" class="warning-message">The list is empty.</div>
            <div class="input">
                <input type="text" placeholder="type items" v-model="text">
            </div>
            <Button text="Next" @click="splitInput"></Button>
        </div>
        <div id="result">{{ result }}</div>
    </main>
</template>
  
<style scoped lang="scss">

h1 {
    font-family: "Goia Display";
    font-weight: 800;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    font-size: 32px;
}
main {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 150px;
    flex-direction: column;

    .input-group {
        width: 500px;
        display: flex;
        gap: 10px;
        flex-direction: column;

        input {
            width: 100%;
            border-radius: 15px;
            border: 5px solid #2C2C2C;
            background: #FFF;
            padding: 15px 20px;
            font-family: Goia Display;
            font-size: 22px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;

            &::placeholder {
                color: #B0B0B0;
            }
        }

        .warning-message {
            color: rgb(231, 45, 45);
            font-weight: bold;
        }
    }

    #result {
        color: #2C2C2C;
        margin-top: 30px;
    font-weight: 800;
    font-size: 55px;
    }
}
</style>
  