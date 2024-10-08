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

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const addItem = (item) => {
    item = item.replace(/^,\s*|,{2,}|,\s*$/g, '');

    if (items.value.includes(item) || item === "") {
        result.value = '';
        isExist.value = true;
        return;
    }

    isExist.value = false;
    isEmpty.value = false;

    if (item.includes(",")) {
        const splitted = item.split(',').map(part => part.trim());
        const uniqueParts = splitted.filter(part => !items.value.includes(part));
        items.value.unshift(...uniqueParts);
    } else {
        items.value.unshift(item);
    }

    text.value = '';
}

const deleteItem = (item) => {
    const i = items.value.indexOf(item);
    if (i > -1) {
        items.value.splice(i, 1);
    }
}

const newShuffle = () => {
    if (!itemsList.value || !itemsList.value.$el || shuffleMode.value !== 'single') return;
    
    const children = itemsList.value.$el.children;
    const lastIndex = children.length - 1;
    const maxIterations = 3;
    let index = 0;
    let completedIterations = 0;
    let delay = 70;

    // Reset all elements to their original state
    for (let i = 0; i <= lastIndex; i++) {
        children[i].classList.remove("active");
    }

    function changeColor() {
        if ((index <= lastIndex || completedIterations < maxIterations) && delay < 700) {
            const element = children[index % children.length];
            const previousElement = children[(index - 1 + children.length) % children.length];
            toggleClass(element, previousElement);
            index++;

            if (completedIterations >= 5 && delay < 700) {
                delay += 100;
            }

            setTimeout(changeColor, delay);
        } else {
            isShuffling.value = false;
            const randomIndex = Math.floor(Math.random() * items.value.length);
            result.value = items.value[randomIndex];
        }

        if (index > lastIndex) {
            index = 0;
            completedIterations++;
        }
    }

    setTimeout(() => {
        const randomRotations = Math.floor(Math.random() * 3) + 2;
        completedIterations = randomRotations;
    }, 3000);

    changeColor();

    function toggleClass(e, pe) {
        if (e && pe) {
            e.classList.add("active");
            pe.classList.remove("active");
        }
    }
};

const splitInput = () => {
    if (items.value.length === 0) {
        result.value = '';
        isEmpty.value = true;
        return;
    }

    isEmpty.value = false;
    isShuffling.value = true;
    result.value = '';

    if (shuffleMode.value === 'list') {
        shuffleArray(items.value);
        isShuffling.value = false;
    } else if (shuffleMode.value === 'single') {
        newShuffle();
    }
};

const playMusic = () => {
    if (!music.value) return;
    
    if (isMusic.value) {
        music.value.play();
    } else {
        music.value.pause();
    }
}

onMounted(() => {
    music.value = document.getElementById('music');
});

watch(shuffleMode, () => {
    result.value = '';
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
                <label for="single" class="">Single</label>
            </div>
            <div class="radio-group">
                <input type="radio" value="list" id="list" v-model="shuffleMode">
                <label for="list" class="">List</label>
            </div>
        </div>

        <div class="input-group">
            <div v-if="isEmpty" class="warning-message">The list is empty.</div>
            <div v-if="isExist" class="warning-message">The field is empty or this item already exists.</div>
            <div class="input">
                <input type="text" @keyup.comma="addItem(text)" @keyup.enter="addItem(text)"
                    placeholder="type items (Press ',' or 'enter' to insert)" v-model="text">
            </div>
            <Button text="Shuffle" @click="splitInput" :disabled="isShuffling"></Button>
        </div>
        <div>
            <TransitionGroup name="fade" tag="ul" id="items" ref="itemsList">
                <button v-for="item in items" class="item btn-primary" :key="item" :data-value="item"
                    @click="deleteItem(item)">
                    <li>{{ item }}</li>
                </button>
            </TransitionGroup>
        </div>
        <div id="result" v-if="!isShuffling">{{ result }}</div>
    </main>
</template>
  
<style scoped lang="scss">
.active {
    background: #FFC700 !important;
}

.music-checkbox {
    display: inline-flex;
    background: #dbdbdb;
    gap: 6px;
    padding: 5px 10px;
    opacity: .7;
    border-radius: 6px;
    position: absolute;
    bottom: 20px;
    right: 20px;

    label {
        font-weight: 600;
        cursor: pointer;
    }
}

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
        width: 90%;
        max-width: 500px;
        display: flex;
        gap: 10px;
        flex-direction: column;

        &.radio {
            flex-direction: row;
            margin-bottom: 10px;
        }

        input:not(input[type="radio"]) {
            width: 100%;
            border-radius: 15px;
            border: 5px solid #2C2C2C;
            background: #FFF;
            padding: 15px 20px;
            font-size: 22px;
            font-weight: 500;

            &::placeholder {
                color: #B0B0B0;
                font-size: 15px;
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

    #items {
        padding: 0;
        display: flex;
        gap: 5px;
        margin-top: 10px;
        justify-content: center;
        flex-wrap: wrap;
    }

    button.item {
        @extend button !optional;
        font-size: 18px;
        background: white;
        padding: 10px;

        &:hover {
            transform: translate3d(-5px, -5px, 0);
            box-shadow: 5px 5px #FFC700;
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
            padding: 7px 10px;
            font-size: 16px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 10px;

            &::before {
                content: "";
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: white;
                display: block;
                border: 7px solid #2c2c2c;
                padding: 3px;
            }
        }

        input:checked+label {
            background: #2C2C2C;
            color: white;

            &::before {
                background-color: white;
                border-color: white;
            }
        }
    }

    /* 1. declare transition */
    .fade-move,
    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
    }

    /* 2. declare enter from and leave to state */
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
        transform: scaleY(0.01) translateY(30px);
    }

    /* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
    .fade-leave-active {
        position: absolute;
    }
}
</style>