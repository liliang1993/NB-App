<template>
    <div class='loading'>
      <div class='loading-wrapper'>
        <img class='loading-layout' src="../assets/global/loading-layout.png" alt="">
        <img class='loading-logo' src="../assets/global/loading-logo.png" alt="">
      </div> 
      <span class='loading-text'>加载中...</span>
    </div>
</template>
  
</template>

<script>
export default {
  name: 'loading'
}
</script>

<style lang='less' scoped>
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index:999;
    width: 100% ;
    height:100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items :center;
    justify-content: center;
  }
  .loading-wrapper {
    position:relative;
    width:45PX;
    height:45PX;
  }
  .loading-layout {
    position: absolute;
    top:0;
    height: 100%;
    width: 100%;
    animation: rotate 1s infinite linear; 
  }
  .loading-logo {
    position: absolute;
    width: 30PX;
    height: 30PX;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .loading-text{
    padding-top: 6PX;
  }
  @keyframes rotate {
    0%   { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }
</style>
