// boot sequence
  (function(){
    var bootScreen = document.getElementById('bootScreen');
    var bootLog = document.getElementById('bootLog');
    var bar = document.getElementById('bootBarFill');
    if(!bootScreen) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var lines = [
      '[ 0.000000 ] Linux 6.8.0-secops (tivani@console)',
      '[ 0.041 ] Initializing identity kernel modules <span class="ok">OK</span>',
      '[ 0.089 ] Mounting /var/log/audit <span class="ok">OK</span>',
      '[ 0.132 ] Starting iam-daemon <span class="ok">OK</span>',
      '[ 0.178 ] Loading access-control policies <span class="ok">OK</span>',
      '[ 0.221 ] Verifying credentials for tivani.mathebula <span class="ok">OK</span>',
      '[ 0.266 ] Establishing secure session <span class="ok">OK</span>',
      '[ 0.310 ] Starting reporting-engine (Power BI, SQL) <span class="ok">OK</span>',
      '[ 0.355 ] Running compliance checks <span class="ok">0 issues</span>',
      '[ 0.402 ] <span class="ok">ACCESS GRANTED</span> — welcome',
      '$ ./launch-portfolio.sh'
    ];
    var finished = false;
    function finish(){
      if(finished) return;
      finished = true;
      bootScreen.classList.add('hide');
      document.body.classList.remove('boot-lock');
      setTimeout(function(){ if(bootScreen.parentNode) bootScreen.parentNode.removeChild(bootScreen); }, 550);
      window.removeEventListener('keydown', finish);
      bootScreen.removeEventListener('click', finish);
    }
    if(reduce){ finish(); return; }
    document.body.classList.add('boot-lock');
    window.addEventListener('keydown', finish);
    bootScreen.addEventListener('click', finish);
    setTimeout(finish, 3400); // hard fallback so the site is never blocked
    var i = 0;
    var total = lines.length;
    var timer = setInterval(function(){
      if(i >= total){
        clearInterval(timer);
        setTimeout(finish, 420);
        return;
      }
      var div = document.createElement('div');
      div.className = 'ln';
      div.innerHTML = lines[i];
      bootLog.appendChild(div);
      bar.style.width = Math.round(((i+1)/total)*100) + '%';
      i++;
    }, 150);
  })();

  // hero code-rain background
  (function(){
    var canvas = document.getElementById('codeRain');
    var hero = document.getElementById('hero');
    if(!canvas || !hero) return;
    var ctx = canvas.getContext('2d');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var snippets = [
      'sudo tail -f /var/log/auth.log','ps aux | grep sshd','iptables -L -n -v',
      'chmod 640 /etc/shadow','systemctl status fail2ban','grep "Failed password" auth.log',
      'useradd -m -s /bin/bash svc_audit','chown root:secops /var/log/secure',
      'auditctl -w /etc/passwd -p wa','nmap -sV -p22,443 10.0.0.0/24',
      'journalctl -u sshd --since today','ACCESS_GRANTED uid=1001 role=analyst',
      'crontab -l | grep backup','df -h /var/log','openssl x509 -in cert.pem -noout -dates',
      'sudo ufw status verbose','id -nG tivani','history | tail -20',
      'curl -s https://api.internal/health','systemctl restart iam-daemon',
      'SELECT * FROM access_log WHERE risk_score > 7;','rsync -avz /backup/ secops@vault:/data/'
    ];
    var cols = [], w = 0, h = 0, dpr = 1, raf = null;
    function rand(a,b){ return a + Math.random()*(b-a); }
    function pick(){ return snippets[Math.floor(Math.random()*snippets.length)]; }
    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w*dpr; canvas.height = h*dpr;
      canvas.style.width = w+'px'; canvas.style.height = h+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      var colCount = Math.max(4, Math.floor(w/190));
      cols = new Array(colCount).fill(0).map(function(_,idx){
        return {
          x: (w/colCount)*idx + rand(10,40),
          y: rand(-h, h),
          speed: rand(14,26),
          text: pick(),
          alpha: rand(.32,.85)
        };
      });
    }
    function draw(){
      ctx.fillStyle = 'rgba(10,14,19,0.16)';
      ctx.fillRect(0,0,w,h);
      ctx.font = '12px "JetBrains Mono", monospace';
      cols.forEach(function(c){
        ctx.fillStyle = 'rgba(63,217,199,' + c.alpha + ')';
        ctx.fillText(c.text, c.x, c.y);
        c.y -= c.speed/60;
        if(c.y < -20){
          c.y = h + rand(0,80);
          c.text = pick();
          c.alpha = rand(.3,.85);
          c.speed = rand(14,26);
        }
      });
    }
    function staticFrame(){
      ctx.fillStyle = 'rgba(10,14,19,1)';
      ctx.fillRect(0,0,w,h);
      ctx.font = '12px "JetBrains Mono", monospace';
      cols.forEach(function(c){
        ctx.fillStyle = 'rgba(63,217,199,' + (c.alpha*.55) + ')';
        ctx.fillText(c.text, c.x, c.y);
      });
    }
    function loop(){ draw(); raf = requestAnimationFrame(loop); }
    resize();
    if(reduce){ staticFrame(); } else { loop(); }
    var resizeTimer;
    window.addEventListener('resize', function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function(){
        resize();
        if(reduce) staticFrame();
      }, 200);
    });
    document.addEventListener('visibilitychange', function(){
      if(document.hidden){ if(raf) cancelAnimationFrame(raf); raf = null; }
      else if(!reduce && !raf){ loop(); }
    });
  })();

  // mobile menu
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  }));

  // terminal typed log
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lines = [
    { html: '<span class="prompt">$</span> whoami', delay: 0 },
    { html: 'tivani.mathebula — data.security.analyst', delay: 550 },
    { html: '<span class="prompt">$</span> iam-status --check', delay: 1150 },
    { html: '<span class="ok">✓ access granted</span> — clearance: analyst', delay: 1650 },
    { html: '<span class="prompt">$</span> monitor --systems', delay: 2350 },
    { html: '<span class="ok">✓ monitoring active</span> :: 3 systems, 0 anomalies', delay: 2850 },
    { html: '<span class="prompt">$</span> report --generate weekly', delay: 3550 },
    { html: '<span class="warn">↻ compiling</span> Power BI dashboard...', delay: 4050 },
    { html: '<span class="ok">✓ report ready</span> — 0 critical findings <span class="cursor"></span>', delay: 4700 },
  ];
  const termBody = document.getElementById('termBody');
  function runTerminal(){
    termBody.innerHTML = '';
    if (reduce){
      lines.forEach(l => {
        const d = document.createElement('div');
        d.className = 'term-line';
        d.style.opacity = 1;
        d.innerHTML = l.html;
        termBody.appendChild(d);
      });
      return;
    }
    lines.forEach(l => {
      setTimeout(() => {
        const d = document.createElement('div');
        d.className = 'term-line';
        d.innerHTML = l.html;
        termBody.appendChild(d);
      }, l.delay);
    });
  }
  runTerminal();
  if(!reduce) setInterval(runTerminal, 8000);

  // scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // skill bars fill on view
  const skillList = document.getElementById('skillList');
  const skillIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        skillList.querySelectorAll('.skill-row').forEach(row => {
          row.querySelector('.bar i').style.width = row.dataset.pct + '%';
        });
        skillIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  skillIO.observe(skillList);

  // portfolio filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.p-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(c => {
        c.classList.toggle('p-hide', f !== 'all' && c.dataset.cat !== f);
      });
    });
  });

  // active nav link on scroll
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = ['hero','about','resume','portfolio','services','contact'].map(id => document.getElementById(id)).filter(Boolean);
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        navLinks.forEach(a => a.classList.remove('active'));
        const match = document.querySelector('.nav-links a[href="#' + e.target.id + '"]');
        if(match) match.classList.add('active');
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px -60% 0px' });
  sections.forEach(s => navIO.observe(s));

  // contact form -> mailto
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    const name = this.name.value, email = this.email.value, subject = this.subject.value, message = this.message.value;
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:tivaninick71@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  });
