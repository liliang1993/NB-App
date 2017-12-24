<template>
    <div class='wrapper'>
      <i class='nullData-icon'></i>
    </div>
</template>

<script>
  export default {
    name:'nullData'
  }
</script>

<style scoped>
.wrapper{
    height:100%;
    position: absolute;
    height: 400px;
    width: 500px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.nullData-icon{
  display:block;
  width: 100%;
  height: 100%;
  background:url(../../assets/null-data.png) no-repeat center;
  background-size:contain;
}
</style>
