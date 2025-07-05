import { DiscordSDK } from "@discord/embedded-app-sdk";

import rocketLogo from '/rocket.png';
import "./style.css";

// Will eventually store the authenticated user's access_token
let auth;
let userInfo = null;

// 게임 상태
let gameState = {
  score: 0,
  level: 1,
  gamesPlayed: 0,
  highScore: 0,
  isPlaying: false,
  gameTime: 30,
  timeLeft: 30,
  clickPower: 1,
  upgrades: {
    clickPower: 1,
    autoClicker: 0,
    timeBonus: 0
  }
};

// 사용자 데이터 (실제로는 서버에서 관리)
let users = [
  { id: 'admin', password: 'admin123', username: 'Admin', avatar: '👑' },
  { id: 'user1', password: 'user123', username: 'Player1', avatar: '🎮' },
  { id: 'user2', password: 'user123', username: 'Player2', avatar: '⚡' }
];

let currentUser = null;

console.log("Discord Game starting...");

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

// 오류 처리 추가
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  showErrorUI('An error occurred while loading the game');
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  showErrorUI('Failed to connect to Discord');
});

// 초기 로그인 화면 표시
showLoginUI();

function showLoginUI() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="login-container">
      <div class="login-content">
        <div class="login-header">
          <img src="${rocketLogo}" class="login-logo" alt="Discord" />
          <h1 class="login-title">🚀 Discord Clicker</h1>
          <p class="login-subtitle">Login to start your gaming adventure!</p>
        </div>
        
        <form class="login-form" onsubmit="handleLogin(event)">
          <div class="form-group">
            <label for="userId">User ID</label>
            <input type="text" id="userId" name="userId" placeholder="Enter your ID" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required>
          </div>
          
          <button type="submit" class="login-btn">
            <span class="btn-icon">🔐</span>
            Login
          </button>
        </form>
        
        <div class="login-footer">
          <p>Demo Accounts:</p>
          <div class="demo-accounts">
            <div class="demo-account" onclick="fillDemoAccount('admin', 'admin123')">
              <span class="demo-avatar">👑</span>
              <span>Admin (admin/admin123)</span>
            </div>
            <div class="demo-account" onclick="fillDemoAccount('user1', 'user123')">
              <span class="demo-avatar">🎮</span>
              <span>Player1 (user1/user123)</span>
            </div>
            <div class="demo-account" onclick="fillDemoAccount('user2', 'user123')">
              <span class="demo-avatar">⚡</span>
              <span>Player2 (user2/user123)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 로그인 처리
window.handleLogin = function(event) {
  event.preventDefault();
  
  const userId = document.getElementById('userId').value;
  const password = document.getElementById('password').value;
  
  // 로딩 상태 표시
  const loginBtn = document.querySelector('.login-btn');
  loginBtn.innerHTML = '<span class="btn-icon">⏳</span> Logging in...';
  loginBtn.disabled = true;
  
  // 로그인 검증 (시뮬레이션)
  setTimeout(() => {
    const user = users.find(u => u.id === userId && u.password === password);
    
    if (user) {
      currentUser = user;
      userInfo = {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      };
      console.log("Login successful:", user.username);
      showGameUI();
    } else {
      showLoginError('Invalid ID or Password');
      loginBtn.innerHTML = '<span class="btn-icon">🔐</span> Login';
      loginBtn.disabled = false;
    }
  }, 1000);
};

// 데모 계정 자동 입력
window.fillDemoAccount = function(id, password) {
  document.getElementById('userId').value = id;
  document.getElementById('password').value = password;
};

// 로그인 오류 표시
function showLoginError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'login-error';
  errorDiv.textContent = message;
  
  const form = document.querySelector('.login-form');
  form.insertBefore(errorDiv, form.firstChild);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

function showErrorUI(message) {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h2>Connection Error</h2>
      <p>${message}</p>
      <button onclick="showLoginUI()" class="retry-btn">Back to Login</button>
    </div>
  `;
}

function showGameUI() {
  console.log("Showing game UI...");
  const app = document.querySelector('#app');
  
  app.innerHTML = `
    <div class="game-container">
      <div class="header">
        <div class="user-info">
          ${userInfo ? `
            <div class="user-avatar">${userInfo.avatar}</div>
            <div class="user-details">
              <h2 class="username">${userInfo.username}</h2>
              <span class="user-id">ID: ${userInfo.id}</span>
            </div>
          ` : `
            <div class="user-details">
              <h2 class="username">Guest User</h2>
            </div>
          `}
        </div>
        <div class="header-actions">
          <button class="logout-btn" onclick="logout()">🚪 Logout</button>
          <div class="logo-container">
            <img src="${rocketLogo}" class="logo" alt="Discord" />
          </div>
        </div>
      </div>
      
      <div class="game-content">
        <h1 class="game-title">🚀 Discord Clicker</h1>
        <p class="game-description">Click the rocket to earn points and upgrade your power!</p>
        
        <div class="game-stats">
          <div class="stat-card">
            <div class="stat-icon">🎮</div>
            <div class="stat-info">
              <h3>Games Played</h3>
              <span class="stat-value" id="gamesPlayed">${gameState.gamesPlayed}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-info">
              <h3>High Score</h3>
              <span class="stat-value" id="highScore">${gameState.highScore}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-info">
              <h3>Level</h3>
              <span class="stat-value" id="level">${gameState.level}</span>
            </div>
          </div>
        </div>
        
        <div class="game-actions">
          <button class="game-btn primary" onclick="startGame()" id="startBtn">
            <span class="btn-icon">▶️</span>
            Start Game
          </button>
          <button class="game-btn secondary" onclick="showShop()">
            <span class="btn-icon">🛒</span>
            Shop
          </button>
          <button class="game-btn secondary" onclick="showLeaderboard()">
            <span class="btn-icon">📊</span>
            Leaderboard
          </button>
        </div>
        
        <div class="game-features">
          <div class="feature-item">
            <span class="feature-icon">🎯</span>
            <span>Challenge your friends</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🏅</span>
            <span>Earn achievements</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🌟</span>
            <span>Unlock new levels</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 로그아웃
window.logout = function() {
  if (confirm('Are you sure you want to logout?')) {
    currentUser = null;
    userInfo = null;
    gameState = {
      score: 0,
      level: 1,
      gamesPlayed: 0,
      highScore: 0,
      isPlaying: false,
      gameTime: 30,
      timeLeft: 30,
      clickPower: 1,
      upgrades: {
        clickPower: 1,
        autoClicker: 0,
        timeBonus: 0
      }
    };
    showLoginUI();
  }
};

// 게임 함수들
window.startGame = function() {
  if (gameState.isPlaying) return;
  
  gameState.isPlaying = true;
  gameState.score = 0;
  gameState.timeLeft = gameState.gameTime + gameState.upgrades.timeBonus;
  
  showGameplayUI();
  startGameTimer();
};

window.showShop = function() {
  showShopUI();
};

window.showLeaderboard = function() {
  alert('📊 Leaderboard feature coming soon!');
};

// 게임플레이 UI
function showGameplayUI() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="gameplay-container">
      <div class="game-header">
        <div class="game-info">
          <div class="score-display">
            <span class="score-label">Score:</span>
            <span class="score-value" id="currentScore">${gameState.score}</span>
          </div>
          <div class="time-display">
            <span class="time-label">Time:</span>
            <span class="time-value" id="timeLeft">${gameState.timeLeft}</span>
          </div>
        </div>
        <button class="exit-btn" onclick="exitGame()">❌</button>
      </div>
      
      <div class="game-area">
        <div class="click-target" onclick="clickRocket()" id="clickTarget">
          <div class="rocket-container">
            <div class="rocket">🚀</div>
            <div class="click-text">Click me!</div>
          </div>
        </div>
        
        <div class="power-info">
          <div class="power-display">
            <span>Click Power: ${gameState.clickPower}</span>
          </div>
          <div class="auto-clicker-display">
            <span>Auto Clicker: ${gameState.upgrades.autoClicker}/s</span>
          </div>
        </div>
      </div>
      
      <div class="game-controls">
        <button class="control-btn" onclick="pauseGame()">⏸️ Pause</button>
        <button class="control-btn" onclick="showShop()">🛒 Shop</button>
      </div>
    </div>
  `;
  
  // 자동 클리커 시작
  if (gameState.upgrades.autoClicker > 0) {
    startAutoClicker();
  }
}

// 클릭 이벤트
window.clickRocket = function() {
  if (!gameState.isPlaying) return;
  
  gameState.score += gameState.clickPower;
  updateScore();
  
  // 클릭 효과
  const target = document.getElementById('clickTarget');
  target.style.transform = 'scale(0.95)';
  setTimeout(() => {
    target.style.transform = 'scale(1)';
  }, 100);
  
  // 점수 효과
  showScoreEffect();
};

// 점수 효과 표시
function showScoreEffect() {
  const effect = document.createElement('div');
  effect.className = 'score-effect';
  effect.textContent = `+${gameState.clickPower}`;
  effect.style.left = Math.random() * 200 + 50 + 'px';
  effect.style.top = Math.random() * 200 + 50 + 'px';
  
  document.querySelector('.game-area').appendChild(effect);
  
  setTimeout(() => {
    effect.remove();
  }, 1000);
}

// 자동 클리커
function startAutoClicker() {
  const interval = setInterval(() => {
    if (!gameState.isPlaying) {
      clearInterval(interval);
      return;
    }
    gameState.score += gameState.upgrades.autoClicker;
    updateScore();
  }, 1000);
}

// 게임 타이머
function startGameTimer() {
  const timer = setInterval(() => {
    if (!gameState.isPlaying) {
      clearInterval(timer);
      return;
    }
    
    gameState.timeLeft--;
    updateTime();
    
    if (gameState.timeLeft <= 0) {
      endGame();
      clearInterval(timer);
    }
  }, 1000);
}

// 점수 업데이트
function updateScore() {
  const scoreElement = document.getElementById('currentScore');
  if (scoreElement) {
    scoreElement.textContent = gameState.score;
  }
}

// 시간 업데이트
function updateTime() {
  const timeElement = document.getElementById('timeLeft');
  if (timeElement) {
    timeElement.textContent = gameState.timeLeft;
  }
}

// 게임 종료
function endGame() {
  gameState.isPlaying = false;
  gameState.gamesPlayed++;
  
  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
  }
  
  // 레벨 업
  const newLevel = Math.floor(gameState.score / 100) + 1;
  if (newLevel > gameState.level) {
    gameState.level = newLevel;
  }
  
  showGameOverUI();
}

// 게임 오버 UI
function showGameOverUI() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="game-over-container">
      <div class="game-over-content">
        <h1 class="game-over-title">🎮 Game Over!</h1>
        <div class="final-score">
          <h2>Final Score: ${gameState.score}</h2>
          ${gameState.score > gameState.highScore ? '<p class="new-record">🏆 New High Score!</p>' : ''}
        </div>
        
        <div class="game-stats-summary">
          <div class="stat-item">
            <span class="stat-label">Games Played:</span>
            <span class="stat-value">${gameState.gamesPlayed}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">High Score:</span>
            <span class="stat-value">${gameState.highScore}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Level:</span>
            <span class="stat-value">${gameState.level}</span>
          </div>
        </div>
        
        <div class="game-over-actions">
          <button class="game-btn primary" onclick="startGame()">
            <span class="btn-icon">🔄</span>
            Play Again
          </button>
          <button class="game-btn secondary" onclick="showGameUI()">
            <span class="btn-icon">🏠</span>
            Main Menu
          </button>
        </div>
      </div>
    </div>
  `;
}

// 게임 종료
window.exitGame = function() {
  if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
    gameState.isPlaying = false;
    showGameUI();
  }
};

// 일시정지
window.pauseGame = function() {
  gameState.isPlaying = !gameState.isPlaying;
  const btn = document.querySelector('.control-btn');
  if (btn) {
    btn.textContent = gameState.isPlaying ? '⏸️ Pause' : '▶️ Resume';
  }
};

// 상점 UI
function showShopUI() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="shop-container">
      <div class="shop-header">
        <h1 class="shop-title">🛒 Upgrade Shop</h1>
        <button class="exit-btn" onclick="showGameUI()">❌</button>
      </div>
      
      <div class="shop-content">
        <div class="shop-item">
          <div class="item-info">
            <h3>🚀 Click Power</h3>
            <p>Increase points per click</p>
            <span class="item-price">Cost: ${gameState.upgrades.clickPower * 10} points</span>
          </div>
          <button class="buy-btn" onclick="buyUpgrade('clickPower')" 
                  ${gameState.score < gameState.upgrades.clickPower * 10 ? 'disabled' : ''}>
            Buy
          </button>
        </div>
        
        <div class="shop-item">
          <div class="item-info">
            <h3>⚡ Auto Clicker</h3>
            <p>Automatically click every second</p>
            <span class="item-price">Cost: ${(gameState.upgrades.autoClicker + 1) * 50} points</span>
          </div>
          <button class="buy-btn" onclick="buyUpgrade('autoClicker')"
                  ${gameState.score < (gameState.upgrades.autoClicker + 1) * 50 ? 'disabled' : ''}>
            Buy
          </button>
        </div>
        
        <div class="shop-item">
          <div class="item-info">
            <h3>⏰ Time Bonus</h3>
            <p>Add 5 seconds to game time</p>
            <span class="item-price">Cost: ${(gameState.upgrades.timeBonus / 5 + 1) * 30} points</span>
          </div>
          <button class="buy-btn" onclick="buyUpgrade('timeBonus')"
                  ${gameState.score < (gameState.upgrades.timeBonus / 5 + 1) * 30 ? 'disabled' : ''}>
            Buy
          </button>
        </div>
      </div>
      
      <div class="shop-footer">
        <div class="current-score">
          <span>Current Score: ${gameState.score}</span>
        </div>
        <button class="back-btn" onclick="showGameUI()">Back to Menu</button>
      </div>
    </div>
  `;
}

// 업그레이드 구매
window.buyUpgrade = function(type) {
  let cost = 0;
  
  switch(type) {
    case 'clickPower':
      cost = gameState.upgrades.clickPower * 10;
      if (gameState.score >= cost) {
        gameState.score -= cost;
        gameState.upgrades.clickPower++;
        gameState.clickPower = gameState.upgrades.clickPower;
      }
      break;
    case 'autoClicker':
      cost = (gameState.upgrades.autoClicker + 1) * 50;
      if (gameState.score >= cost) {
        gameState.score -= cost;
        gameState.upgrades.autoClicker++;
      }
      break;
    case 'timeBonus':
      cost = (gameState.upgrades.timeBonus / 5 + 1) * 30;
      if (gameState.score >= cost) {
        gameState.score -= cost;
        gameState.upgrades.timeBonus += 5;
      }
      break;
  }
  
  showShopUI(); // 상점 UI 새로고침
};

console.log("Main.js loaded successfully");
