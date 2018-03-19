<template>
    <div class="container is-fluid">
        Route : {{$nuxt.$route.name}}
    </div>
</template>

<script>
export default {
  middleware: "auth"
};
</script>


<style scoped>

</style>
