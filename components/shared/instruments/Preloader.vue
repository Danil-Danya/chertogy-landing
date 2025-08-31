<template>
    <div class="dark-fantasy-loader">
        <div class="portal">
            <div class="inner-circle"></div>
        </div>
        <div class="inner-text">Загрузка контента</div>
        <div class="sparkle"></div>
        <div class="smoke"></div>
    </div>
</template>


<style scoped>

/* строго не судить прелоадер спиздил с какого сайта и подумал что это лучший вариант для сайта */
.dark-fantasy-loader {
  position: fixed;
  inset: 0;
  left: 0;
  top: 0;
  background: #0a0a0a;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 99999999;
  width: 100%;
  height: 100vh;
}

.portal {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #8b00ff;
  box-shadow: 0 0 20px #8b00ff, 0 0 40px #d23c48, 0 0 60px #ff7b7b;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: pulse 1.5s infinite alternate;
}

.inner-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle, #d23c48 0%, transparent 70%);
  animation: flicker 0.8s infinite alternate;
}


.sparkle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #ff7b7b;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  animation: sparkleAnim 1.2s infinite ease-in-out;
}


.smoke {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139,0,255,0.15) 0%, transparent 70%);
  animation: drift 3s infinite ease-in-out;
}


.inner-text {
  position: absolute;
  bottom: 35%; 
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-family: "Alegreya SC"; 
  font-size: 32px;
  text-align: center;
  letter-spacing: 1px;
}

@media (max-width: 920px) {
  .inner-text {
    position: absolute;
    bottom: 35%; 
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-family: "Alegreya SC"; 
    font-size: 22px;
    text-align: center;
    letter-spacing: 1px;
}
}


@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 20px #8b00ff, 0 0 40px #d23c48; }
  50% { transform: scale(1.1); box-shadow: 0 0 30px #ff7b7b, 0 0 60px #d23c48; }
  100% { transform: scale(1); box-shadow: 0 0 20px #8b00ff, 0 0 40px #d23c48; }
}

@keyframes flicker {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}

@keyframes sparkleAnim {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-70%, -80%) scale(0.5); opacity: 0.4; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

@keyframes drift {
  0% { transform: translateY(0) scale(1); opacity: 0.6; }
  50% { transform: translateY(-20px) scale(1.1); opacity: 0.3; }
  100% { transform: translateY(-10px) scale(1); opacity: 0.6; }
}
</style>
