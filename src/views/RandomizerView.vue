<script setup>
import Button from '../components/Button.vue';
import { ref, onMounted, watch } from 'vue';
import Music from '../assets/music.mp3'

const text = ref('');
const result = ref('');
const isEmpty = ref(false);
const isExist = ref(false);
const shuffleMode = ref('single');
const music = ref(null);
const isMusic = ref(false);
const getInitialItems = () => [];
const items = ref(getInitialItems());
const itemsList = ref(null);
const isShuffling = ref(false);
const selectedIndex = ref(-1); // Track the currently selected index

const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

const addItem = (item) => {
    if (!item) {
        isExist.value = true;
        return;
    }

    item = item.replace(/^,\s*|,{2,}|,\s*$/g, '');

    if (item === "") {
        isExist.value = true;
        return;
    }

    isExist.value = false;
    isEmpty.value = false;

    if (item.includes(",")) {
        const splitted = item.split(',')
            .map(part => part.trim())
            .filter(part => part !== "");
        
        const uniqueParts = splitted.filter(part => !items.value.includes(part));
        if (uniqueParts.length > 0) {
            items.value.unshift(...uniqueParts);
        } else {
            isExist.value = true;
        }
    } else if (!items.value.includes(item)) {
        items.value.unshift(item);
    } else {
        isExist.value = true;
        return;
    }

    text.value = '';
    result.value = '';
}

const deleteItem = (item) => {
    const i = items.value.indexOf(item);
    if (i > -1) {
        items.value.splice(i, 1);
        if (items.value.length === 0) {
            result.value = '';
        }
    }
}

const newShuffle = async () => {
    if (!itemsList.value || !itemsList.value.$el || shuffleMode.value !== 'single') return;
    
    const children = Array.from(itemsList.value.$el.children);
    const lastIndex = children.length - 1;
    let currentIndex = 0;
    
    children.forEach(child => child.classList.remove("active"));
    result.value = '';
    
    const finalIndex = Math.floor(Math.random() * items.value.length);
    selectedIndex.value = finalIndex;
    
    // Slower initial shuffling
    const fastShuffles = 15;  // More initial shuffles
    for (let i = 0; i < fastShuffles; i++) {
        await new Promise(resolve => setTimeout(resolve, 80));  // Increased from 50ms to 80ms
        children[currentIndex]?.classList.remove("active");
        currentIndex = (currentIndex + 1) % children.length;
        children[currentIndex]?.classList.add("active");
    }
    
    // Slower gradual slowdown
    let delay = 150;  // Increased starting delay from 100ms to 150ms
    const maxDelay = 600;  // Increased max delay from 400ms to 600ms
    const shuffleSteps = 8;  // More steps in the slowdown phase
    
    let stepsToFinal = (finalIndex - currentIndex + children.length) % children.length;
    const stepsPerIteration = Math.ceil(stepsToFinal / shuffleSteps);
    
    for (let i = 0; i < shuffleSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, delay));
        children[currentIndex]?.classList.remove("active");
        
        if (i === shuffleSteps - 1) {
            currentIndex = finalIndex;
        } else {
            currentIndex = (currentIndex + stepsPerIteration) % children.length;
        }
        
        children[currentIndex]?.classList.add("active");
        delay = Math.min(delay * 1.3, maxDelay);  // Reduced multiplier from 1.5 to 1.3 for smoother slowdown
    }
    
    result.value = items.value[finalIndex];
    isShuffling.value = false;
}
const splitInput = () => {
    if (items.value.length === 0) {
        result.value = '';
        isEmpty.value = true;
        return;
    }

    isEmpty.value = false;
    isShuffling.value = true;
    result.value = '';
    selectedIndex.value = -1;

    if (shuffleMode.value === 'list') {
        items.value = shuffleArray(items.value);
        isShuffling.value = false;
    } else if (shuffleMode.value === 'single') {
        newShuffle();
    }
};

const playMusic = () => {
    if (!music.value) return;
    
    if (isMusic.value) {
        music.value.play().catch(() => {
            // Handle autoplay restrictions
            isMusic.value = false;
        });
    } else {
        music.value.pause();
    }
}

onMounted(() => {
    music.value = document.getElementById('music');
});

watch(shuffleMode, () => {
    result.value = '';
    selectedIndex.value = -1;
    if (itemsList.value?.$el) {
        Array.from(itemsList.value.$el.children).forEach(child => {
            child.classList.remove("active");
        });
    }
});
</script>

<template>
    <audio loop preload="none" id="music" ref="music" :src="Music">
    </audio>
    <div class="input-group music-checkbox">
        <input type="checkbox" id="isMusic" v-model="isMusic" @change="playMusic">
        <label for="isMusic">Music</label>
    </div>
    <h1>Randomizer</h1>
    <main>
        <div class="input-group radio">
            <div class="radio-group">
                <input type="radio" value="single" id="single" v-model="shuffleMode">
                <label for="single">Single</label>
            </div>
            <div class="radio-group">
                <input type="radio" value="list" id="list" v-model="shuffleMode">
                <label for="list">List</label>
            </div>
        </div>

        <div class="input-group">
            <div v-if="isEmpty" class="warning-message">The list is empty.</div>
            <div v-if="isExist" class="warning-message">The field is empty or this item already exists.</div>
            <div class="input">
                <input type="text" 
                       @keyup.comma="addItem(text)" 
                       @keyup.enter="addItem(text)"
                       placeholder="type items (Press ',' or 'enter' to insert)" 
                       v-model="text"
                       :disabled="isShuffling">
            </div>
            <Button text="Shuffle" @click="splitInput" :disabled="isShuffling"></Button>
        </div>
        <div>
            <TransitionGroup name="fade" tag="ul" id="items" ref="itemsList">
                <button v-for="(item, index) in items" 
                        class="item btn-primary" 
                        :class="{ active: shuffleMode === 'single' && index === selectedIndex }"
                        :key="item" 
                        :data-value="item"
                        @click="deleteItem(item)"
                        :disabled="isShuffling">
                    <li>{{ item }}</li>
                </button>
            </TransitionGroup>
        </div>
        <div id="result" v-if="!isShuffling && result">{{ result }}</div>
    </main>
</template>

<style scoped lang="scss">
.active {
    background: #FFC700 !important;
    transform: translate3d(-5px, -5px, 0);
    box-shadow: 5px 5px #2C2C2C;
}

.music-checkbox {
    display: inline-flex;
    background: #dbdbdb;
    gap: 6px;
    padding: 5px 10px;
    opacity: .7;
    border-radius: 6px;
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;

    label {
        font-weight: 600;
        cursor: pointer;
    }
}

h1 {
    font-family: "Goia Display", sans-serif;
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
    margin-top: 100px;
    flex-direction: column;
    padding: 0 20px;

    .input-group {
        width: 90%;
        max-width: 500px;
        display: flex;
        gap: 10px;
        flex-direction: column;

        &.radio {
            flex-direction: row;
            margin-bottom: 10px;
            justify-content: center;
        }

        input:not(input[type="radio"]) {
            width: 100%;
            border-radius: 15px;
            border: 5px solid #2C2C2C;
            background: #FFF;
            padding: 15px 20px;
            font-size: 22px;
            font-weight: 500;
            transition: all 0.3s ease;

            &:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }

            &::placeholder {
                color: #B0B0B0;
                font-size: 15px;
            }
        }

        .warning-message {
            color: rgb(231, 45, 45);
            font-weight: bold;
            text-align: center;
        }
    }

    #result {
        color: #2C2C2C;
        margin-top: 30px;
        font-weight: 800;
        font-size: 55px;
        text-align: center;
        min-height: 70px;
    }

    #items {
        padding: 0;
        display: flex;
        gap: 10px;
        margin-top: 20px;
        justify-content: center;
        flex-wrap: wrap;
        max-width: 800px;
    }

    button.item {
        font-size: 18px;
        background: white;
        padding: 10px 15px;
        border: 3px solid #2C2C2C;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        
        &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            pointer-events: none;
        }

        &:not(:disabled):hover {
            transform: translate3d(-5px, -5px, 0);
            box-shadow: 5px 5px #FFC700;
        }

        li {
            list-style: none;
            margin: 0;
            padding: 0;
        }
    }

    .radio-group {
        input {
            display: none;
        }

        label {
            border-radius: 15px;
            border: 5px solid #2C2C2C;
            background: #FFF;
            padding: 7px 15px;
            font-size: 16px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.3s ease;

            &::before {
                content: "";
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: white;
                display: block;
                border: 7px solid #2c2c2c;
                padding: 3px;
                transition: all 0.3s ease;
            }
        }

        input:checked + label {
            background: #2C2C2C;
            color: white;

            &::before {
                background-color: white;
                border-color: white;
            }
        }
    }

    .fade-move,
    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
        transform: scaleY(0.01) translateY(30px);
    }

    .fade-leave-active {
        position: absolute;
    }
}
</style>