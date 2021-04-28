<template>
  <div class="header">
    <h1>Siloah Payment</h1>    
  </div>
</template>

<script>
export default {
  head() {
    return {
      script: [
        {
          src: 'https://code.jquery.com/jquery-3.2.1.min.js',
        },
        {
          hid: 'tappay',
          src: 'https://js.tappaysdk.com/tpdirect/v5.1.0',
          defer: true,
        },
      ],
    }
  },
}
</script>

<style scoped>
.header {
  text-align: center;
  padding: 20px;
}
</style>