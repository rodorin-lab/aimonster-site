/* =====================================================================
 *  SPACE HUNTER — 宇宙型3Dアクション (Three.js r149 UMD)
 *  ブラウザだけで動く。ローカル three.min.js を読み込む。
 * ===================================================================== */
(function () {
  "use strict";

  if (!window.THREE) {
    document.getElementById("boot").textContent =
      "Three.js の読み込みに失敗しました 😢 lib/three.min.js を確認してください";
    return;
  }
  var THREE = window.THREE;

  // ---------------------------------------------------------------- 定数
  var BOUND_X = 26, BOUND_Y = 15;
  var PLAYER_SPEED = 46, PLAYER_BOOST = 1.9, PLAYER_DAMP = 6.0;
  var FIRE_INTERVAL = 0.13, BULLET_SPEED = 150, BULLET_LIFE = 1.6;
  var COLORS = {
    player: 0x38f0ff,
    playerGlow: 0x7affc4,
    bullet: 0x9dffff,
    enemyBullet: 0xff6a6a,
    enemy: 0xff5470,
    enemy2: 0xffa640,
    star: 0xffffff
  };

  // ---------------------------------------------------------------- 状態
  var state = {
    running: false,
    paused: false,
    over: false,
    score: 0,
    wave: 1,
    hp: 100,
    time: 0,
    spawnTimer: 0,
    spawnInterval: 1.6,
    fireCooldown: 0,
    shake: 0
  };

  var keys = {};
  var pointerFire = false;

  // ---------------------------------------------------------------- シーン
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060f, 0.0045);

  var camera = new THREE.PerspectiveCamera(
    62, window.innerWidth / window.innerHeight, 0.1, 4000
  );
  camera.position.set(0, 6, 26);

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  } catch (e) {
    document.getElementById("boot").textContent =
      "WebGL を初期化できませんでした。ブラウザのハードウェアアクセラレーションを有効にしてください 🙏";
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x05060f, 1);
  document.body.appendChild(renderer.domElement);

  // ---------------------------------------------------------------- ライト
  scene.add(new THREE.AmbientLight(0x446688, 1.1));
  var key = new THREE.DirectionalLight(0xbfe8ff, 1.25);
  key.position.set(6, 12, 10);
  scene.add(key);
  var rim = new THREE.PointLight(0x2a6cff, 2.2, 220);
  rim.position.set(0, -8, 24);
  scene.add(rim);

  // ---------------------------------------------------------------- 星の背景
  function makeStars(count, spread, size, opacity, color) {
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.7;
      pos[i * 3 + 2] = -Math.random() * spread * 1.4;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var mat = new THREE.PointsMaterial({
      color: color, size: size, transparent: true, opacity: opacity,
      sizeAttenuation: true, depthWrite: false
    });
    return new THREE.Points(geo, mat);
  }

  var starLayers = [];
  var LAYERS = [
    { count: 900, spread: 900, size: 1.6, opacity: 0.95, speed: 55  },
    { count: 700, spread: 700, size: 2.6, opacity: 0.75, speed: 95  },
    { count: 420, spread: 520, size: 4.2, opacity: 0.55, speed: 150 }
  ];
  for (var li = 0; li < LAYERS.length; li++) {
    var L = LAYERS[li];
    var s = makeStars(L.count, L.spread, L.size, L.opacity, COLORS.star);
    s.userData = L;
    scene.add(s);
    starLayers.push(s);
  }

  // 遠くの惑星（雰囲気づくり）
  var planet = new THREE.Mesh(
    new THREE.SphereGeometry(120, 40, 40),
    new THREE.MeshStandardMaterial({ color: 0x1b2b55, emissive: 0x0a1630, roughness: 1.0, metalness: 0.0 })
  );
  planet.position.set(-160, -60, -900);
  scene.add(planet);

  // ---------------------------------------------------------------- プレイヤー
  var player = new THREE.Group();
  var body = new THREE.Mesh(
    new THREE.ConeGeometry(1.5, 5.0, 4),
    new THREE.MeshStandardMaterial({
      color: 0x14203a, emissive: COLORS.player, emissiveIntensity: 0.35,
      metalness: 0.85, roughness: 0.28, flatShading: true
    })
  );
  body.rotation.x = Math.PI / 2; // 先端を -Z 向きに
  player.add(body);

  var wingMat = new THREE.MeshStandardMaterial({
    color: 0x0d1730, emissive: COLORS.playerGlow, emissiveIntensity: 0.5,
    metalness: 0.8, roughness: 0.35
  });
  var wingL = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.35, 1.6), wingMat);
  wingL.position.set(-2.6, 0, 0.6);
  wingL.rotation.z = 0.45;
  player.add(wingL);
  var wingR = wingL.clone();
  wingR.position.set(2.6, 0, 0.6);
  wingR.rotation.z = -0.45;
  player.add(wingR);

  // エンジン排気（擬似）
  var glow = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 12, 12),
    new THREE.MeshBasicMaterial({ color: COLORS.playerGlow, transparent: true, opacity: 0.85 })
  );
  glow.position.z = 2.6;
  player.add(glow);
  var glowLight = new THREE.PointLight(COLORS.playerGlow, 2.4, 40);
  glowLight.position.z = 3.2;
  player.add(glowLight);

  player.position.set(0, 0, 0);
  scene.add(player);

  var vel = new THREE.Vector3();

  // ---------------------------------------------------------------- 弾
  var bullets = [];       // 自機弾
  var enemyBullets = [];  // 敵弾
  var enemies = [];
  var particles = [];

  var bulletGeo = new THREE.CylinderGeometry(0.22, 0.22, 3.2, 6);
  bulletGeo.rotateX(Math.PI / 2);
  var bulletMat = new THREE.MeshBasicMaterial({ color: COLORS.bullet });

  function spawnBullet() {
    var b = new THREE.Mesh(bulletGeo, bulletMat);
    b.position.copy(player.position);
    b.position.y -= 0.2;
    b.position.z -= 3.2;
    b.userData.vz = -BULLET_SPEED;
    b.userData.life = BULLET_LIFE;
    scene.add(b);
    bullets.push(b);
  }

  var eBulletGeo = new THREE.SphereGeometry(0.4, 8, 8);
  var eBulletMat = new THREE.MeshBasicMaterial({ color: COLORS.enemyBullet });

  function spawnEnemyBullet(from) {
    var b = new THREE.Mesh(eBulletGeo, eBulletMat);
    b.position.copy(from);
    var dir = new THREE.Vector3().subVectors(player.position, from).normalize();
    b.userData.v = dir.multiplyScalar(60);
    b.userData.life = 4.0;
    scene.add(b);
    enemyBullets.push(b);
  }

  // ---------------------------------------------------------------- 敵
  function enemyMaterial(c) {
    return new THREE.MeshStandardMaterial({
      color: 0x2a0e18, emissive: c, emissiveIntensity: 0.55,
      metalness: 0.7, roughness: 0.4, flatShading: true
    });
  }

  function spawnEnemy() {
    var isShooter = Math.random() < 0.4;
    var col = isShooter ? COLORS.enemy : COLORS.enemy2;

    var g = new THREE.Group();
    var core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7, 0), enemyMaterial(col));
    g.add(core);
    var spike = new THREE.Mesh(
      new THREE.ConeGeometry(0.7, 2.6, 4),
      new THREE.MeshStandardMaterial({ color: 0x1a0d16, emissive: col, emissiveIntensity: 0.7, flatShading: true })
    );
    spike.rotation.x = Math.PI / 2;
    spike.position.z = 1.4;
    g.add(spike);
    var halo = new THREE.PointLight(col, 1.8, 26);
    g.add(halo);

    var r = 0.6 + Math.random() * 0.6;
    core.scale.setScalar(r);

    g.position.set(
      (Math.random() - 0.5) * BOUND_X * 1.8,
      (Math.random() - 0.5) * BOUND_Y * 1.4,
      -260 - Math.random() * 120
    );

    g.userData = {
      hp: isShooter ? 2 : 1,
      radius: 2.0 * r,
      col: col,
      shooter: isShooter,
      fireTimer: 1.0 + Math.random() * 2.0,
      spin: new THREE.Vector3(
        (Math.random() - 0.5) * 2.2,
        (Math.random() - 0.5) * 2.2,
        (Math.random() - 0.5) * 2.2
      ),
      speed: 42 + state.wave * 4 + Math.random() * 22
    };
    scene.add(g);
    enemies.push(g);
  }

  // ---------------------------------------------------------------- 爆発
  var partGeo = new THREE.SphereGeometry(0.28, 6, 6);
  function boom(pos, color, n, power) {
    for (var i = 0; i < n; i++) {
      var p = new THREE.Mesh(
        partGeo,
        new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 1 })
      );
      p.position.copy(pos);
      var v = new THREE.Vector3(
        (Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)
      ).normalize().multiplyScalar(power * (0.4 + Math.random() * 0.9));
      p.userData = { v: v, life: 0.5 + Math.random() * 0.5, max: 1.0 };
      scene.add(p);
      particles.push(p);
    }
    state.shake = Math.min(state.shake + power * 0.03, 1.6);
  }

  // ---------------------------------------------------------------- HUD
  var elHp = document.getElementById("hp");
  var elScore = document.getElementById("score");
  var elWave = document.getElementById("wave");
  var elBanner = document.getElementById("banner");
  var elOverlay = document.getElementById("overlay");
  var elOvTitle = document.getElementById("ovTitle");
  var elOvText = document.getElementById("ovText");
  var elOvBtn = document.getElementById("ovBtn");

  var bannerTimer = 0;
  function banner(text) {
    elBanner.textContent = text;
    elBanner.classList.add("show");
    bannerTimer = 1.4;
  }

  function refreshHUD() {
    var hpPct = Math.max(0, state.hp);
    elHp.style.width = hpPct + "%";
    elHp.style.background = hpPct > 45
      ? "linear-gradient(90deg,#38f0ff,#7affc4)"
      : (hpPct > 20
        ? "linear-gradient(90deg,#ffd23a,#ffa640)"
        : "linear-gradient(90deg,#ff4d4d,#ff7a5c)");
    elScore.textContent = state.score;
    elWave.textContent = state.wave;
  }

  // ---------------------------------------------------------------- 入力
  window.addEventListener("keydown", function (e) {
    keys[e.code] = true;
    if (e.code === "Space") e.preventDefault();
    if (e.code === "KeyP") togglePause();
  }, { passive: false });
  window.addEventListener("keyup", function (e) { keys[e.code] = false; });

  renderer.domElement.addEventListener("mousedown", function (e) {
    if (e.button === 0) pointerFire = true;
  });
  window.addEventListener("mouseup", function () { pointerFire = false; });
  // タッチ簡易対応：触れてる間は射撃＋前進
  renderer.domElement.addEventListener("touchstart", function () { pointerFire = true; }, { passive: true });
  renderer.domElement.addEventListener("touchend", function () { pointerFire = false; }, { passive: true });

  function axis() {
    var x = 0, y = 0;
    if (keys["KeyA"] || keys["ArrowLeft"])  x -= 1;
    if (keys["KeyD"] || keys["ArrowRight"]) x += 1;
    if (keys["KeyW"] || keys["ArrowUp"])    y += 1;
    if (keys["KeyS"] || keys["ArrowDown"])  y -= 1;
    return { x: x, y: y };
  }

  // ---------------------------------------------------------------- ゲーム制御
  function resetGame() {
    // クリア
    var i;
    for (i = 0; i < bullets.length; i++) scene.remove(bullets[i]);
    for (i = 0; i < enemyBullets.length; i++) scene.remove(enemyBullets[i]);
    for (i = 0; i < enemies.length; i++) scene.remove(enemies[i]);
    for (i = 0; i < particles.length; i++) scene.remove(particles[i]);
    bullets = []; enemyBullets = []; enemies = []; particles = [];

    state.score = 0; state.wave = 1; state.hp = 100;
    state.time = 0; state.spawnTimer = 0; state.spawnInterval = 1.6;
    state.fireCooldown = 0; state.shake = 0; state.over = false; state.paused = false;
    player.position.set(0, 0, 0);
    vel.set(0, 0, 0);
    refreshHUD();
  }

  function startGame() {
    resetGame();
    state.running = true;
    elOverlay.classList.remove("show");
    banner("WAVE 1");
    clock.getDelta(); // リセット
  }

  function togglePause() {
    if (!state.running || state.over) return;
    state.paused = !state.paused;
    if (state.paused) {
      elOvTitle.textContent = "PAUSED";
      elOvText.innerHTML = "一時停止中。<br>P キーまたは下のボタンで再開できます。";
      elOvBtn.textContent = "再開";
      elOverlay.classList.add("show");
    } else {
      elOverlay.classList.remove("show");
    }
  }

  function gameOver() {
    state.over = true;
    state.running = false;
    elOvTitle.textContent = "GAME OVER";
    elOvText.innerHTML =
      "スコア: <b>" + state.score + "</b><br>到達ウェーブ: <b>" + state.wave + "</b><br><br>" +
      "もう一度挑戦する？";
    elOvBtn.textContent = "リトライ";
    elOverlay.classList.add("show");
  }

  elOvBtn.addEventListener("click", function () {
    if (state.paused) { togglePause(); return; }
    startGame();
  });

  // ---------------------------------------------------------------- 更新
  function updateStars(dt) {
    for (var i = 0; i < starLayers.length; i++) {
      var s = starLayers[i];
      var arr = s.geometry.attributes.position.array;
      var sp = s.userData.speed * dt;
      var back = s.userData.spread * 1.4;
      for (var j = 0; j < arr.length; j += 3) {
        arr[j + 2] += sp;
        if (arr[j + 2] > 40) arr[j + 2] -= back;
      }
      s.geometry.attributes.position.needsUpdate = true;
    }
  }

  function updatePlayer(dt) {
    var a = axis();
    var accel = new THREE.Vector3(a.x, a.y, 0).multiplyScalar(PLAYER_SPEED);
    vel.addScaledVector(accel, dt);
    // 減衰
    vel.multiplyScalar(1 - Math.min(PLAYER_DAMP * dt, 0.9));
    // ブーストで前進
    if (keys["ShiftLeft"] || keys["ShiftRight"]) vel.z -= PLAYER_SPEED * (PLAYER_BOOST - 1) * dt * 8;

    player.position.addScaledVector(vel, dt);
    player.position.x = Math.max(-BOUND_X, Math.min(BOUND_X, player.position.x));
    player.position.y = Math.max(-BOUND_Y, Math.min(BOUND_Y, player.position.y));
    player.position.z = Math.max(-40, Math.min(6, player.position.z));

    // 傾き（見た目）
    player.rotation.z = -a.x * 0.35;
    player.rotation.x = a.y * 0.18;
    glow.scale.setScalar(0.85 + Math.random() * 0.3);
    glowLight.intensity = 2.0 + Math.random() * 0.9;

    // 射撃
    state.fireCooldown -= dt;
    if ((keys["Space"] || pointerFire) && state.fireCooldown <= 0) {
      spawnBullet();
      state.fireCooldown = FIRE_INTERVAL;
    }
  }

  function updateBullets(dt) {
    var i;
    for (i = bullets.length - 1; i >= 0; i--) {
      var b = bullets[i];
      b.position.z += b.userData.vz * dt;
      b.userData.life -= dt;
      if (b.userData.life <= 0 || b.position.z < -400) {
        scene.remove(b); bullets.splice(i, 1);
      }
    }
    for (i = enemyBullets.length - 1; i >= 0; i--) {
      var e = enemyBullets[i];
      e.position.addScaledVector(e.userData.v, dt);
      e.userData.life -= dt;
      var dP = e.position.distanceTo(player.position);
      if (dP < 2.4) {
        scene.remove(e); enemyBullets.splice(i, 1);
        state.hp -= 8; state.shake = Math.min(state.shake + 0.5, 1.6);
        if (state.hp <= 0) { refreshHUD(); gameOver(); return; }
        refreshHUD();
        continue;
      }
      if (e.userData.life <= 0 || e.position.z > 30 || e.position.z < -500) {
        scene.remove(e); enemyBullets.splice(i, 1);
      }
    }
  }

  function updateEnemies(dt) {
    for (var i = enemies.length - 1; i >= 0; i--) {
      var en = enemies[i];
      var u = en.userData;
      u.spin && (en.rotation.x += u.spin.x * dt, en.rotation.y += u.spin.y * dt, en.rotation.z += u.spin.z * dt);

      // 前進＋ゆるく追尾
      en.position.z += u.speed * dt;
      en.position.x += Math.sign(player.position.x - en.position.x) * 6 * dt;
      en.position.y += Math.sign(player.position.y - en.position.y) * 6 * dt;

      // 射撃型
      if (u.shooter) {
        u.fireTimer -= dt;
        if (u.fireTimer <= 0 && en.position.z > -180) {
          spawnEnemyBullet(en.position);
          u.fireTimer = 1.6 + Math.random() * 1.4;
        }
      }

      // 自弾ヒット判定
      var hit = false;
      for (var j = bullets.length - 1; j >= 0; j--) {
        var b = bullets[j];
        if (b.position.distanceTo(en.position) < u.radius + 1.2) {
          scene.remove(b); bullets.splice(j, 1);
          u.hp -= 1;
          if (u.hp <= 0) { hit = true; }
          break;
        }
      }
      if (hit) {
        boom(en.position, u.col, 18, 26);
        state.score += u.shooter ? 30 : 10;
        refreshHUD();
        scene.remove(en); enemies.splice(i, 1);
        continue;
      }

      // 衝突（体当たり）
      if (en.position.distanceTo(player.position) < u.radius + 1.6) {
        boom(en.position, u.col, 16, 24);
        scene.remove(en); enemies.splice(i, 1);
        state.hp -= 20; state.shake = Math.min(state.shake + 0.9, 1.8);
        if (state.hp <= 0) { refreshHUD(); gameOver(); return; }
        refreshHUD();
        continue;
      }

      // 通り過ぎた敵は消す
      if (en.position.z > 40) { scene.remove(en); enemies.splice(i, 1); }
    }
  }

  function updateParticles(dt) {
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.position.addScaledVector(p.userData.v, dt);
      p.userData.v.multiplyScalar(1 - 1.6 * dt);
      p.userData.life -= dt;
      p.material.opacity = Math.max(0, p.userData.life / p.userData.max);
      p.scale.multiplyScalar(1 - 0.9 * dt);
      if (p.userData.life <= 0) { scene.remove(p); particles.splice(i, 1); }
    }
  }

  function updateWaves(dt) {
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      spawnEnemy();
      state.spawnTimer = Math.max(0.45, state.spawnInterval - state.wave * 0.08);
    }
    // ウェーブ進行
    var newWave = 1 + Math.floor(state.time / 20);
    if (newWave !== state.wave) {
      state.wave = newWave;
      banner("WAVE " + state.wave);
      refreshHUD();
    }
  }

  function updateCamera(dt) {
    var target = new THREE.Vector3(player.position.x * 0.35, 5 + player.position.y * 0.25, 26);
    // シェイク
    if (state.shake > 0) {
      target.x += (Math.random() - 0.5) * state.shake * 1.6;
      target.y += (Math.random() - 0.5) * state.shake * 1.6;
      state.shake = Math.max(0, state.shake - dt * 3.2);
    }
    camera.position.lerp(target, Math.min(1, dt * 4.5));
    camera.lookAt(player.position.x * 0.4, player.position.y * 0.2, -30);
  }

  // ---------------------------------------------------------------- メインループ
  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.05);

    // 星空は常に流す
    updateStars(dt);

    if (state.running && !state.paused && !state.over) {
      state.time += dt;
      updatePlayer(dt);
      updateBullets(dt);
      updateEnemies(dt);
      updateParticles(dt);
      updateWaves(dt);

      if (bannerTimer > 0) {
        bannerTimer -= dt;
        if (bannerTimer <= 0) elBanner.classList.remove("show");
      }
    } else {
      updateParticles(dt);
    }

    updateCamera(dt);
    renderer.render(scene, camera);
  }

  // ---------------------------------------------------------------- リサイズ
  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ---------------------------------------------------------------- 起動
  refreshHUD();
  animate();
  window.__SPACE_HUNTER__ = { state: state, start: startGame };
})();
