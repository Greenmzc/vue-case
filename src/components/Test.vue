<template lang="pug">
.home test
  .home-test test
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="postcss">
.home
  font-size: 24px
  color: #f00
  &-test
    color: #f0f
</style>
