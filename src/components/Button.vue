<script setup>
defineProps({
    text: {
        type: String,
        required: true
    }
})
</script>
<template>
    <button class="btn-primary">{{ text }}</button>
</template>
  
<style lang="scss">
.btn-primary {
    display: inline-flex;
    padding: 10px 60px;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    border: 5px solid #2C2C2C;
    background: #FFC700;
    color: #000;
    font-family: Goia Display;
    font-size: 32px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    transition: all 150ms ease-in-out;

    &:hover {
        transform: translate3d(-5px, -5px, 0);
        box-shadow: 5px 5px black;
    }
}
</style>
  