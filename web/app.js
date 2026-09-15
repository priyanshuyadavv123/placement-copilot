/**
 * PlacementCopilot AI — Bento UI Application Controller
 * High-performance event loop for Bento Grid, Soundwaves, Real-time telemetry & scoring.
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let activeQuestions = [];
  let currentQuestionIndex = 0;
  let lastATSResult = null;
  let lastEvalResult = null;
  let timerInterval = null;
  let secondsElapsed = 0;

  // Floating Toast Notification
  function showToast(message, icon = '✓') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color: var(--cyan); font-size: 1.1rem;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(80px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Bento Navigation Segments
  const navSegments = document.querySelectorAll('.nav-seg');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navSegments.forEach(seg => {
    seg.addEventListener('click', () => {
      navSegments.forEach(s => s.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      seg.classList.add('active');
      const targetId = seg.getAttribute('data-tab');
      const pane = document.getElementById(targetId);
      if (pane) pane.classList.add('active');

      if (targetId === 'company-vault') loadCompanyVault();
    });
  });

  // -------------------------------------------------------------
  // 1. BENTO RECRUITER PILLS & QUICK SELECTOR
  // -------------------------------------------------------------
  const bentoPills = document.querySelectorAll('.bento-pill');
  const companySelect = document.getElementById('companySelect');
  const factKeywords = document.getElementById('factKeywords');
  const predictorStatus = document.getElementById('predictorStatus');
  const predictorDesc = document.getElementById('predictorDesc');
  const predictorIcon = document.getElementById('predictorIcon');

  const COMPANY_FACTS = {
    amazon_sde: { kwCount: 16, rounds: 4, name: "Amazon SDE-1" },
    tcs_digital: { kwCount: 14, rounds: 3, name: "TCS Digital" },
    accenture_ase: { kwCount: 15, rounds: 4, name: "Accenture ASE" },
    infosys_sp: { kwCount: 12, rounds: 3, name: "Infosys SP" },
    google_swe: { kwCount: 15, rounds: 5, name: "Google SWE" }
  };

  function updateRecruiterTelemetry(cid) {
    const facts = COMPANY_FACTS[cid] || COMPANY_FACTS.tcs_digital;
    if (factKeywords) factKeywords.innerText = facts.kwCount;
    const roundsElem = document.getElementById('factRounds');
    if (roundsElem) roundsElem.innerText = facts.rounds;
    if (predictorDesc && !lastATSResult) {
      predictorDesc.innerText = `Screening calibrated for ${facts.name} campus criteria.`;
    }
  }

  bentoPills.forEach(pill => {
    pill.addEventListener('click', () => {
      bentoPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cid = pill.getAttribute('data-cid');
      
      if (companySelect) companySelect.value = cid;
      
      const interviewSelect = document.getElementById('interviewCompanySelect');
      if (interviewSelect) {
        interviewSelect.value = cid;
        loadInterviewQuestions(cid);
      }
      
      updateRecruiterTelemetry(cid);
      showToast(`Target recruiter set to ${pill.querySelector('strong').innerText}`, '🎯');
    });
  });

  // -------------------------------------------------------------
  // 2. RESUME EDITOR & NEURAL ATS DIAGNOSTIC
  // -------------------------------------------------------------
  const btnLoadSampleResume = document.getElementById('btnLoadSampleResume');
  const resumeInput = document.getElementById('resumeInput');
  const charCount = document.getElementById('charCount');
  const btnRunATS = document.getElementById('btnRunATS');
  const atsEmptyState = document.getElementById('atsEmptyState');
  const atsResultsContent = document.getElementById('atsResultsContent');

  const SAMPLE_LPU_RESUME = `PRIYANSHU YADAV
Lovely Professional University | B.Tech Computer Science & Engineering
CGPA: 8.4/10 | Jalandhar, Punjab

TECHNICAL SKILLS:
- Languages: Python, C++, JavaScript, SQL, HTML/CSS
- Frameworks & Tools: React, Node.js, Git, GitHub, VS Code
- Core CS: Object-Oriented Programming, Data Structures & Algorithms, DBMS

PROJECTS:
1. Automated Lead Generation Engine (Python, REST APIs)
- Worked on a web scraper in Python to extract business contacts.
- Used regex to collect emails and phone numbers from public websites.
- Helped with building an export tool that saves data into CSV format.

2. College Event Portal (React, Firebase)
- Responsible for the frontend UI using React and Tailwind CSS.
- Did database operations to store registered student information.
- Tested features and fixed bugs before campus fest launch.

EDUCATION:
- B.Tech in CSE, Lovely Professional University (2024 - 2028)`;

  btnLoadSampleResume.addEventListener('click', () => {
    resumeInput.value = SAMPLE_LPU_RESUME;
    charCount.innerText = `${resumeInput.value.length} characters`;
    showToast("Loaded benchmark LPU student resume!", "✨");
  });

  resumeInput.addEventListener('input', () => {
    charCount.innerText = `${resumeInput.value.length} characters`;
  });

  btnRunATS.addEventListener('click', async () => {
    const resumeText = resumeInput.value.trim();
    if (!resumeText) {
      showToast("Please paste or load resume text first!", "⚠️");
      return;
    }

    const companyId = companySelect ? companySelect.value : 'tcs_digital';
    btnRunATS.disabled = true;
    btnRunATS.innerHTML = `<span class="btn-icon">⏳</span> Neural Scanning...`;

    try {
      const res = await fetch('/api/ats/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: resumeText, company_id: companyId })
      });
      const data = await res.json();

      if (data.success) {
        lastATSResult = data.data;
        renderBentoATSResults(data.data);
        updateReadinessSummary();
        showToast("Neural ATS Diagnostic Completed!", "⚡");
      } else {
        alert("Diagnostic error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      showToast("Could not reach local PlacementCopilot engine", "❌");
    } finally {
      btnRunATS.disabled = false;
      btnRunATS.innerHTML = `<span class="btn-icon">⚡</span> Run Neural ATS Diagnostic`;
    }
  });

  function animateBentoCounter(elem, target) {
    let current = 0;
    const step = Math.max(1, Math.floor(target / 24));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        elem.innerText = target;
        clearInterval(timer);
      } else {
        elem.innerText = current;
      }
    }, 20);
  }

  function renderBentoATSResults(data) {
    if (atsEmptyState) atsEmptyState.style.display = 'none';
    if (atsResultsContent) atsResultsContent.style.display = 'block';

    const score = data.overall_score;
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreCircle = document.getElementById('scoreCircle');

    animateBentoCounter(scoreNumber, score);

    const circumference = 264;
    const offset = circumference - (circumference * score) / 100;
    scoreCircle.style.strokeDashoffset = offset;

    // Update Predictor Card
    if (score >= 75) {
      scoreCircle.style.stroke = 'var(--emerald)';
      if (predictorStatus) {
        predictorStatus.innerText = "Shortlist Ready";
        predictorStatus.style.color = "var(--emerald)";
      }
      if (predictorIcon) predictorIcon.innerText = "🟢";
      if (predictorDesc) predictorDesc.innerText = `High probability of clearing ${data.company_name} automated screening.`;
      document.getElementById('matchBadge').className = 'bento-badge emerald-badge';
      document.getElementById('matchBadge').innerText = 'Optimal Fit';
    } else if (score >= 50) {
      scoreCircle.style.stroke = 'var(--amber)';
      if (predictorStatus) {
        predictorStatus.innerText = "Borderline Risk";
        predictorStatus.style.color = "var(--amber)";
      }
      if (predictorIcon) predictorIcon.innerText = "🟡";
      if (predictorDesc) predictorDesc.innerText = `Candidate lacks high-yield keywords required by ${data.company_name}.`;
      document.getElementById('matchBadge').className = 'bento-badge purple-badge';
      document.getElementById('matchBadge').innerText = 'Borderline';
    } else {
      scoreCircle.style.stroke = 'var(--rose)';
      if (predictorStatus) {
        predictorStatus.innerText = "High Rejection Risk";
        predictorStatus.style.color = "var(--rose)";
      }
      if (predictorIcon) predictorIcon.innerText = "🔴";
      if (predictorDesc) predictorDesc.innerText = `Resume filtered out by ${data.company_name} ATS parser due to missing technical signals.`;
      document.getElementById('matchBadge').className = 'bento-badge';
      document.getElementById('matchBadge').style.background = 'rgba(244, 63, 94, 0.15)';
      document.getElementById('matchBadge').style.color = 'var(--rose)';
      document.getElementById('matchBadge').innerText = 'At Risk';
    }

    document.getElementById('companyBadge').innerText = data.company_name;
    document.getElementById('scoreStatusTitle').innerText = data.summary.status;
    document.getElementById('scoreCritiqueText').innerText = data.summary.critique;
    document.getElementById('scoreActionItem').innerText = "⚡ Priority Action: " + data.summary.top_action_item;

    // Sub-metric bars
    const totalKW = data.matched_count + data.missing_count;
    const kwPercent = totalKW > 0 ? Math.round((data.matched_count / totalKW) * 100) : 50;
    const metricPercent = Math.min(data.quantified_metrics_found * 25, 100);
    const verbPercent = data.weak_verbs_detected.length === 0 ? 95 : Math.max(30, 95 - (data.weak_verbs_detected.length * 20));

    document.getElementById('kwScoreText').innerText = `${kwPercent}%`;
    document.getElementById('kwBarFill').style.width = `${kwPercent}%`;

    document.getElementById('metricScoreText').innerText = `${metricPercent}%`;
    document.getElementById('metricBarFill').style.width = `${metricPercent}%`;

    document.getElementById('verbScoreText').innerText = `${verbPercent}%`;
    document.getElementById('verbBarFill').style.width = `${verbPercent}%`;

    // Missing Keywords
    const missingContainer = document.getElementById('missingKeywordsList');
    missingContainer.innerHTML = '';
    if (data.missing_keywords.length > 0) {
      data.missing_keywords.forEach(kw => {
        const chip = document.createElement('span');
        chip.className = 'bento-chip chip-missing';
        chip.innerText = "+ " + kw;
        missingContainer.appendChild(chip);
      });
    } else {
      missingContainer.innerHTML = '<span class="bento-chip chip-matched">All targeted competencies present!</span>';
    }

    // Matched Keywords
    const matchedContainer = document.getElementById('matchedKeywordsList');
    matchedContainer.innerHTML = '';
    data.matched_keywords.forEach(kw => {
      const chip = document.createElement('span');
      chip.className = 'bento-chip chip-matched';
      chip.innerText = "✓ " + kw;
      matchedContainer.appendChild(chip);
    });

    // Rewrites Drawer
    const rewritesContainer = document.getElementById('bulletRewritesList');
    rewritesContainer.innerHTML = '';
    data.bullet_rewrites.forEach(r => {
      const item = document.createElement('div');
      item.className = 'bento-rewrite-item';
      item.innerHTML = `
        <div class="rewrite-top-line">
          <span class="rewrite-old">Before: "${r.original}"</span>
          <button class="bento-btn-copy" data-copy="${encodeURIComponent(r.improved)}">📋 Copy</button>
        </div>
        <div class="rewrite-boost">✨ Boosted: "${r.improved}"</div>
      `;
      rewritesContainer.appendChild(item);
    });

    // Wire copy buttons
    document.querySelectorAll('.bento-btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.getAttribute('data-copy'));
        navigator.clipboard.writeText(text).then(() => {
          btn.innerText = '✓ Copied';
          showToast('Google X-Y-Z bullet copied to clipboard!', '📋');
          setTimeout(() => btn.innerText = '📋 Copy', 2200);
        });
      });
    });
  }

  // -------------------------------------------------------------
  // 3. BENTO LIVE MOCK INTERVIEW STUDIO
  // -------------------------------------------------------------
  const interviewCompanySelect = document.getElementById('interviewCompanySelect');
  const btnNewQuestion = document.getElementById('btnNewQuestion');
  const questionCategory = document.getElementById('questionCategory');
  const activeQuestionText = document.getElementById('activeQuestionText');
  const btnReadAloud = document.getElementById('btnReadAloud');
  const soundwaveContainer = document.getElementById('soundwaveContainer');
  const studentAnswerInput = document.getElementById('studentAnswerInput');
  const btnFillSampleAnswer = document.getElementById('btnFillSampleAnswer');
  const answerWordCount = document.getElementById('answerWordCount');
  const btnSubmitAnswer = document.getElementById('btnSubmitAnswer');
  const interviewTimer = document.getElementById('interviewTimer');
  const evalEmptyState = document.getElementById('evalEmptyState');
  const evalContent = document.getElementById('evalContent');
  const btnCopyIdeal = document.getElementById('btnCopyIdeal');

  function startBentoTimer() {
    if (timerInterval) clearInterval(timerInterval);
    secondsElapsed = 0;
    timerInterval = setInterval(() => {
      secondsElapsed++;
      const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
      const secs = String(secondsElapsed % 60).padStart(2, '0');
      if (interviewTimer) interviewTimer.innerText = `⏱️ ${mins}:${secs}`;
    }, 1000);
  }

  async function loadInterviewQuestions(companyId) {
    try {
      const res = await fetch('/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_id: companyId })
      });
      const data = await res.json();
      if (data.success) {
        activeQuestions = data.data.questions;
        currentQuestionIndex = 0;
        displayBentoQuestion();
      }
    } catch (e) {
      console.error(e);
    }
  }

  function displayBentoQuestion() {
    if (!activeQuestions || activeQuestions.length === 0) return;
    const q = activeQuestions[currentQuestionIndex];
    if (activeQuestionText) activeQuestionText.innerText = q.question;
    if (questionCategory) questionCategory.innerText = q.category;
    if (studentAnswerInput) studentAnswerInput.value = '';
    updateBentoWordCount();
    startBentoTimer();
  }

  if (interviewCompanySelect) {
    interviewCompanySelect.addEventListener('change', () => {
      loadInterviewQuestions(interviewCompanySelect.value);
    });
  }

  if (btnNewQuestion) {
    btnNewQuestion.addEventListener('click', () => {
      if (activeQuestions.length > 0) {
        currentQuestionIndex = (currentQuestionIndex + 1) % activeQuestions.length;
        displayBentoQuestion();
        showToast("Loaded next interview question!", "🎙️");
      }
    });
  }

  // -------------------------------------------------------------
  // Natural Voice Model Engine (Persona Selection & Human Cadence)
  // -------------------------------------------------------------
  const voicePersonaSelect = document.getElementById('voicePersonaSelect');
  let availableVoices = [];

  function loadVoices() {
    if ('speechSynthesis' in window) {
      availableVoices = window.speechSynthesis.getVoices();
    }
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }

  function playInterviewChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  }

  function humanizeSpeechText(text) {
    return text
      .replace(/\bO\(1\)\b/gi, "Big O of 1")
      .replace(/\bO\(n\)\b/gi, "Big O of N")
      .replace(/\bO\(log n\)\b/gi, "Big O of log N")
      .replace(/\bO\(n\^2\)\b/gi, "Big O of N squared")
      .replace(/\bDSA\b/g, "D. S. A.")
      .replace(/\bLRU\b/g, "L. R. U.")
      .replace(/\bSQL\b/g, "S. Q. L.")
      .replace(/\bDBMS\b/g, "D. B. M. S.")
      .replace(/\bAPI\b/g, "A. P. I.")
      .replace(/\bAPIs\b/g, "A. P. I.s")
      .replace(/\bOOP\b/g, "Object Oriented Programming")
      .replace(/\bOOPs\b/g, "Object Oriented Programming")
      .replace(/\bCTE\b/g, "C. T. E.");
  }

  function findBestHumanVoice(persona) {
    if (!availableVoices || availableVoices.length === 0) {
      availableVoices = window.speechSynthesis.getVoices();
    }
    const p = (persona || 'samantha').toLowerCase();

    if (p === 'rishi') {
      return availableVoices.find(v => v.name.includes('Rishi')) ||
             availableVoices.find(v => v.lang === 'en-IN' || v.lang === 'en_IN') ||
             availableVoices.find(v => v.name.includes('Samantha'));
    }
    if (p === 'aman') {
      return availableVoices.find(v => v.name.includes('Aman')) ||
             availableVoices.find(v => v.lang === 'en-IN' || v.lang === 'en_IN') ||
             availableVoices.find(v => v.name.includes('Daniel'));
    }
    if (p === 'samantha') {
      return availableVoices.find(v => v.name.includes('Samantha')) ||
             availableVoices.find(v => v.name.includes('Ava')) ||
             availableVoices.find(v => v.name.includes('Karen')) ||
             availableVoices.find(v => v.lang === 'en-US' || v.lang === 'en_US');
    }
    if (p === 'daniel') {
      return availableVoices.find(v => v.name.includes('Daniel')) ||
             availableVoices.find(v => v.name.includes('Oliver')) ||
             availableVoices.find(v => v.lang === 'en-GB' || v.lang === 'en_GB');
    }
    return availableVoices.find(v => v.lang.startsWith('en')) || null;
  }

  // Voice Synthesizer with Equalizer Waveform & Human Persona
  if (btnReadAloud) {
    btnReadAloud.addEventListener('click', () => {
      const rawText = activeQuestionText ? activeQuestionText.innerText : '';
      if ('speechSynthesis' in window && rawText) {
        window.speechSynthesis.cancel();
        
        // Play soft meeting room chime
        playInterviewChime();

        const naturalText = humanizeSpeechText(rawText);
        const utter = new SpeechSynthesisUtterance(naturalText);
        
        // Natural human conversational pacing
        utter.rate = 0.94;
        utter.pitch = 1.0;
        utter.volume = 1.0;

        const persona = voicePersonaSelect ? voicePersonaSelect.value : 'samantha';
        const chosenVoice = findBestHumanVoice(persona);
        if (chosenVoice) {
          utter.voice = chosenVoice;
        }

        utter.onstart = () => {
          if (soundwaveContainer) soundwaveContainer.style.display = 'flex';
          btnReadAloud.innerHTML = `<span class="voice-wave-icon">🔊</span> <span>Speaking...</span>`;
        };
        utter.onend = utter.onerror = () => {
          if (soundwaveContainer) soundwaveContainer.style.display = 'none';
          btnReadAloud.innerHTML = `<span class="voice-wave-icon">🔊</span> <span>Listen to Interviewer</span>`;
        };

        // Small delay after chime for ultra-realism
        setTimeout(() => {
          window.speechSynthesis.speak(utter);
        }, 150);
      } else {
        showToast("Audio synthesizer active", "🔊");
      }
    });
  }

  if (studentAnswerInput) {
    studentAnswerInput.addEventListener('input', updateBentoWordCount);
  }

  function updateBentoWordCount() {
    if (!studentAnswerInput || !answerWordCount) return;
    const words = studentAnswerInput.value.trim().split(/\s+/).filter(Boolean).length;
    answerWordCount.innerText = `${words} words`;
    answerWordCount.style.color = (words >= 40 && words <= 120) ? 'var(--emerald)' : '#fff';
  }

  if (btnFillSampleAnswer) {
    btnFillSampleAnswer.addEventListener('click', () => {
      const currentQ = activeQuestions[currentQuestionIndex];
      if (currentQ && currentQ.question.includes("SQL")) {
        studentAnswerInput.value = "To find the 2nd highest salary without LIMIT, I would use the MAX function in a correlated subquery: SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee). For production scalability and duplicate handling, a window function like DENSE_RANK() OVER (ORDER BY salary DESC) inside a CTE is preferred.";
      } else if (currentQ && currentQ.question.includes("LRU")) {
        studentAnswerInput.value = "An LRU Cache can be implemented using a Hash Map combined with a Doubly Linked List. The Hash Map stores the key pointing directly to the linked list node for O(1) lookup. The Doubly Linked List maintains access order where the most recently used node is moved to the head and the least recently used node at the tail is evicted when capacity exceeds.";
      } else {
        studentAnswerInput.value = "In my approach, I always identify the edge cases first. Using an optimal data structure like a hash map with two-pointer technique allows us to achieve O(n) time complexity and O(1) auxiliary space, which satisfies the company's production scalability requirements.";
      }
      updateBentoWordCount();
      showToast("Loaded benchmark answer!", "💡");
    });
  }

  if (btnSubmitAnswer) {
    btnSubmitAnswer.addEventListener('click', async () => {
      const answer = studentAnswerInput.value.trim();
      if (!answer) {
        showToast("Please provide an answer before submitting!", "⚠️");
        return;
      }

      if (timerInterval) clearInterval(timerInterval);

      const currentQ = activeQuestions[currentQuestionIndex];
      btnSubmitAnswer.disabled = true;
      btnSubmitAnswer.innerHTML = `<span>Evaluating Response...</span> ⏳`;

      try {
        const res = await fetch('/api/interview/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_id: interviewCompanySelect.value,
            question: currentQ.question,
            answer: answer,
            category: currentQ.category
          })
        });
        const data = await res.json();
        if (data.success) {
          lastEvalResult = data.data;
          renderBentoEvaluation(data.data);
          updateReadinessSummary();
          showToast("Response evaluated successfully!", "🏆");
        }
      } catch (e) {
        console.error(e);
        showToast("Evaluation failed. Local engine unreachable", "❌");
      } finally {
        btnSubmitAnswer.disabled = false;
        btnSubmitAnswer.innerHTML = `<span>Evaluate Response</span> ⚡`;
      }
    });
  }

  function renderBentoEvaluation(data) {
    if (evalEmptyState) evalEmptyState.style.display = 'none';
    if (evalContent) evalContent.style.display = 'block';

    document.getElementById('ratingTechnical').innerText = `${data.technical_score}/10`;
    document.getElementById('ratingClarity').innerText = `${data.clarity_score}/10`;
    document.getElementById('ratingOverall').innerText = `${data.overall_score}/10`;

    document.getElementById('evalStrengthsText').innerText = data.strengths;
    document.getElementById('evalGapsText').innerText = data.gaps;
    document.getElementById('evalIdealText').innerText = data.ideal_answer;
  }

  if (btnCopyIdeal) {
    btnCopyIdeal.addEventListener('click', () => {
      const text = document.getElementById('evalIdealText').innerText;
      navigator.clipboard.writeText(text).then(() => {
        btnCopyIdeal.innerText = "✓ Copied";
        showToast("Benchmark model copied to clipboard!", "🏆");
        setTimeout(() => btnCopyIdeal.innerText = "📋 Copy", 2200);
      });
    });
  }

  // -------------------------------------------------------------
  // 4. BENTO COMPANY VAULT MODULE
  // -------------------------------------------------------------
  async function loadCompanyVault() {
    const grid = document.getElementById('companyVaultGrid');
    if (!grid) return;
    grid.innerHTML = '<p style="color: var(--text-muted);">Loading verified campus recruitment blueprints...</p>';

    try {
      const res = await fetch('/api/companies');
      const data = await res.json();
      if (data.success) {
        grid.innerHTML = '';
        for (const c of data.companies) {
          const detailRes = await fetch(`/api/companies/${c.id}`);
          const detailData = await detailRes.json();
          const intel = detailData.intel;

          const card = document.createElement('div');
          card.className = 'bento-vault-card';
          card.innerHTML = `
            <div class="vault-top">
              <h4>${intel.name}</h4>
              <span class="vault-pkg">${intel.ctc_range}</span>
            </div>
            <div class="vault-role">${intel.role} • ${intel.tier}</div>
            <ul class="vault-rounds-list">
              ${intel.rounds.map(r => `<li>✓ ${r}</li>`).join('')}
            </ul>
            <button class="bento-btn-secondary" onclick="selectCompanyForPractice('${intel.id}')">
              Practice for ${intel.name} ➔
            </button>
          `;
          grid.appendChild(card);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  window.selectCompanyForPractice = (cid) => {
    if (companySelect) companySelect.value = cid;
    if (interviewCompanySelect) interviewCompanySelect.value = cid;
    bentoPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-cid') === cid));
    updateRecruiterTelemetry(cid);
    document.querySelector('.nav-seg[data-tab="mock-interview"]').click();
  };

  // -------------------------------------------------------------
  // 5. READINESS REPORT & CSV TELEMETRY EXPORT
  // -------------------------------------------------------------
  function updateReadinessSummary() {
    if (lastATSResult) {
      document.getElementById('summaryScore').innerText = `${lastATSResult.overall_score}%`;
      document.getElementById('summaryTargetCompany').innerText = lastATSResult.company_name;
    }
    if (lastEvalResult) {
      document.getElementById('summaryInterviewScore').innerText = `${lastEvalResult.overall_score}/10`;
    }

    if (lastATSResult && lastEvalResult) {
      const ready = lastATSResult.overall_score >= 70 && lastEvalResult.overall_score >= 7;
      document.getElementById('summaryStatus').innerText = ready ? "Shortlist Ready" : "Gap Optimization";
      document.getElementById('summaryStatus').style.color = ready ? "var(--emerald)" : "var(--amber)";

      const logList = document.getElementById('sessionLogsList');
      if (logList) {
        const log = document.createElement('li');
        log.innerText = `[${new Date().toLocaleTimeString()}] ${lastATSResult.company_name} | ATS: ${lastATSResult.overall_score}% | Mock Rating: ${lastEvalResult.overall_score}/10`;
        logList.prepend(log);
      }
    }
  }

  const btnDownloadCSV = document.getElementById('btnDownloadCSV');
  if (btnDownloadCSV) {
    btnDownloadCSV.addEventListener('click', () => {
      if (!lastATSResult && !lastEvalResult) {
        showToast("Run at least one scan or interview before exporting!", "⚠️");
        return;
      }

      const rows = [
        ["Telemetry Metric", "Recorded Value"],
        ["Target Recruiter", lastATSResult ? lastATSResult.company_name : "N/A"],
        ["Designation", lastATSResult ? lastATSResult.target_role : "N/A"],
        ["ATS Compatibility Score", lastATSResult ? `${lastATSResult.overall_score}%` : "N/A"],
        ["Missing Competencies", lastATSResult ? `"${lastATSResult.missing_keywords.join(', ')}"` : "N/A"],
        ["Technical Interview Rating", lastEvalResult ? `${lastEvalResult.technical_score}/10` : "N/A"],
        ["Communication Score", lastEvalResult ? `${lastEvalResult.clarity_score}/10` : "N/A"],
        ["Campus Readiness Verdict", document.getElementById('summaryStatus').innerText],
        ["Engine Signature", "PlacementCopilot AI Bento v2.0 (LPU Edu Revolution)"]
      ];

      const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `PlacementCopilot_Telemetry_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Readiness telemetry exported as CSV!", "📥");
    });
  }

  // Initial State
  updateRecruiterTelemetry('tcs_digital');
  loadInterviewQuestions('tcs_digital');
});
