<script setup>
import Button from '../components/Button.vue';
import { ref } from 'vue';
import Music from '../assets/music.mp3'

const text = ref('');
const result = ref('');
const isEmpty = ref(false);
const isExist = ref(false);
const resultList  = ref('');
const shuffleMode  = ref('single');

const getInitialItems = () => []
const items = ref(getInitialItems())

const shuffleArray = (array) => {

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

const addItem = (item) => {
    if (items.value.includes(item) || item === "") {
        result.value = '';
        isExist.value = true;
        return;
    }

    isExist.value = false;
    isEmpty.value = false;
    item = item.replace(/^,\s*|,\s*$/g, '');

    if (item.includes(",")) {
        const splitted = item.split(',');
        items.value.unshift(...splitted);
    } else {
        items.value.unshift(item);
    }

    text.value = '';
}


const deleteItem = (item) => {

    const i = items.value.indexOf(item)
  if (i > -1) {
    items.value.splice(i, 1)
  }

}

const splitInput = () => {

    if (shuffleMode.value == 'single') {
        
        if (items.value.length === 0) {
            result.value = '';
            isEmpty.value = true;
            return;
        }
    
        isEmpty.value = false;
        const randomIndex = Math.floor(Math.random() * items.value.length);
        result.value = items.value[randomIndex];

    } else if (shuffleMode.value == 'list') {
        result.value = '';
        resultList.value = shuffleArray(items.value);
    }

};

</script>

<template>
        <audio
        autoplay
        loop
        :src="Music">
    </audio>
    <h1>Randomizer</h1>
    <main>
        <div class="input-group">
            <input type="radio" value="single" v-model="shuffleMode">
            <input type="radio" value="list" v-model="shuffleMode">
        </div>

        <div class="input-group">
            <div v-if="isEmpty" class="warning-message">The list is empty.</div>
            <div v-if="isExist" class="warning-message">The field is empty or this item already exist.</div>
            <div class="input">
                <input type="text" @keyup.,="addItem(text)"  @keyup.enter="addItem(text)"  placeholder="type items (Press ',' or 'enter' to insert)" v-model="text">
            </div>
            <Button text="Shuffle" @click="splitInput"></Button>
        </div>
        <div>
            <TransitionGroup name="fade" tag="ul" id="items">
                <button v-for="(item) in items" class="item btn-primary" :key="item" @click="deleteItem(item)">
                    <li>{{ item }}</li>
                </button>
            </TransitionGroup>
        </div>
        <div id="result">{{ result }}</div>
        <div id="resultList" v-for="(item, index) in items">{{index }} - {{ item }}</div>
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
        transform: translate3d(-5px, -5px,0);
        box-shadow: 5px 5px #FFC700;
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
  