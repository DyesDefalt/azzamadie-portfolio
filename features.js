/* ==========================================================================
   features.js — Marketing Tools Logic
   AI Chat (demo), RSA Generator, UTM Builder
   ========================================================================== */

(function () {
  'use strict';

  // ===== AI CHAT (Demo Mode) =====
  const chatHistory = [];

  const DEMO_RESPONSES = {
    'roas': "**ROAS (Return on Ad Spend)** = Revenue ÷ Ad Spend.\n\nA ROAS of 4x means for every $1 spent, you get $4 in revenue.\n\n**Industry benchmarks:**\n- E-commerce: typically targets 3-5x\n- Lead gen: focuses on cost per lead instead\n- Brand awareness: measured by reach/impression metrics\n\n**Tips to improve ROAS:**\n1. Optimize audience targeting (exclude low-performers)\n2. Test creative variations weekly\n3. Use retargeting to capture warm audiences\n4. Align landing page with ad messaging",

    'cpl': "**To reduce Cost Per Lead (CPL):**\n\n1. **Test different audiences** — Lookalike vs interest-based targeting\n2. **Improve landing page** — Faster load, clearer CTA, social proof\n3. **Use retargeting** — Warm audiences convert at 2-3x the rate\n4. **Test ad creative variations** — Different hooks, visuals, formats\n5. **Optimize bid strategy** — Manual CPC vs Target CPA\n6. **Refine ad scheduling** — Run during high-conversion hours\n7. **Use lead forms** — In-platform forms reduce friction\n\n**Pro tip:** In Indonesia, WhatsApp click-to-chat campaigns often outperform traditional lead forms for SMEs.",

    'budget': "**Recommended starting budgets for Meta Ads:**\n\n- Start with at least **3-5x your target CPA** for the learning phase\n- For lead gen SMEs: **Rp 500K–1M/day** is a good starting point\n- For e-commerce: **Rp 1M–3M/day** minimum to exit learning phase\n- Scale by **20% increments** once you see stable results for 3+ days\n\n**Budget allocation framework:**\n- 70% on proven audiences/creatives\n- 20% on testing new audiences\n- 10% on creative testing\n\n**Important:** Never judge performance before spending at least 2x your target CPA. Facebook's algorithm needs data to optimize.",

    'meta': "**Meta Ads best practices for Indonesian market:**\n\n1. **Campaign structure:** Use CBO (Campaign Budget Optimization) with 3-5 ad sets\n2. **Audiences:** Start with Lookalike 1-3% from your best customers\n3. **Creative:** Video content performs 2x better than static in ID market\n4. **Placements:** Use Advantage+ placements for better distribution\n5. **Bidding:** Start with lowest cost, switch to cost cap when you have data\n\n**Key metrics to monitor:**\n- CTR > 1% (good), > 2% (great)\n- CPM varies: Rp 15K-50K typical for Indonesian audiences\n- Frequency: Keep under 3 per week to avoid fatigue",

    'google': "**Google Ads optimization tips:**\n\n1. **Search campaigns:** Use phrase match + exact match, avoid broad match initially\n2. **Quality Score:** Aim for 7+ by matching ad copy to keywords and landing page\n3. **Extensions:** Add sitelinks, callouts, structured snippets — they increase CTR by 10-15%\n4. **Bid strategy:** Start manual CPC, switch to Target CPA after 30+ conversions\n5. **Negative keywords:** Add weekly from search terms report\n\n**RSA tips:**\n- Write 15 unique headlines (pin key messages to positions 1-2)\n- Include keyword in at least 3 headlines\n- Use different CTAs across descriptions",

    'tiktok': "**TikTok Ads tips for SEA markets:**\n\n1. **Creative is king** — Native-looking content outperforms polished ads by 3-5x\n2. **First 3 seconds matter** — Hook viewers immediately with text overlay + movement\n3. **Sound ON** — Unlike other platforms, 88% of TikTok users have sound on\n4. **Spark Ads** — Boost organic posts that already perform well\n5. **Video Shopping Ads** — For e-commerce, product cards in-feed drive highest ROAS\n\n**Indonesia-specific:**\n- Peak hours: 11am-1pm, 7pm-10pm WIB\n- TikTok Shop integration is crucial for e-commerce\n- Bahasa content performs better than English for mass market",

    'attribution': "**Attribution modeling explained:**\n\n- **Last Click:** Credits the final touchpoint (default in most platforms)\n- **First Click:** Credits the discovery channel\n- **Linear:** Equal credit to all touchpoints\n- **Time Decay:** More credit to recent interactions\n- **Data-Driven:** ML-based, recommended when you have 600+ conversions/month\n\n**Cross-platform attribution tips:**\n1. Use UTM parameters consistently across all campaigns\n2. Set up GA4 with proper conversion events\n3. Use Appsflyer for mobile app attribution\n4. Compare platform-reported vs GA4 data weekly\n5. Accept 10-20% discrepancy as normal between platforms",

    'default': "That's a great marketing question! Here are some general principles to consider:\n\n1. **Start with data** — Review your current metrics before making changes\n2. **Test one variable at a time** — Don't change audience AND creative simultaneously\n3. **Set clear KPIs** — Define success before launching\n4. **Budget for learning** — Allocate 10-20% of budget for experimentation\n5. **Iterate weekly** — Review and optimize on a regular cadence\n\nFor more specific advice, try asking about:\n- ROAS optimization\n- How to reduce CPL\n- Meta Ads budgets\n- Google Ads tips\n- TikTok Ads strategy\n- Attribution modeling"
  };

  function findDemoResponse(message) {
    const lower = message.toLowerCase();
    if (lower.includes('roas') || lower.includes('return on ad')) return DEMO_RESPONSES['roas'];
    if (lower.includes('cpl') || lower.includes('cost per lead') || lower.includes('reduce cost') || lower.includes('kurangi biaya')) return DEMO_RESPONSES['cpl'];
    if (lower.includes('budget') || lower.includes('anggaran') || lower.includes('how much') || lower.includes('berapa')) return DEMO_RESPONSES['budget'];
    if (lower.includes('meta') || lower.includes('facebook') || lower.includes('instagram ad')) return DEMO_RESPONSES['meta'];
    if (lower.includes('google') || lower.includes('search ad') || lower.includes('sem')) return DEMO_RESPONSES['google'];
    if (lower.includes('tiktok') || lower.includes('tik tok')) return DEMO_RESPONSES['tiktok'];
    if (lower.includes('attribution') || lower.includes('atribusi') || lower.includes('tracking')) return DEMO_RESPONSES['attribution'];
    return DEMO_RESPONSES['default'];
  }

  function formatMessage(text) {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/- /g, '• ');
  }

  function addMessage(text, type) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const msg = document.createElement('div');
    msg.className = `chat-message chat-message--${type}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'chat-message__avatar';
    avatar.textContent = type === 'ai' ? 'Az' : 'You';
    
    const bubble = document.createElement('div');
    bubble.className = 'chat-message__bubble';
    bubble.innerHTML = type === 'ai' ? formatMessage(text) : text;
    
    msg.appendChild(avatar);
    msg.appendChild(bubble);
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return null;

    const msg = document.createElement('div');
    msg.className = 'chat-message chat-message--ai chat-typing';
    msg.innerHTML = `
      <div class="chat-message__avatar">Az</div>
      <div class="chat-message__bubble">
        <span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>
      </div>
    `;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msg;
  }

  function initChat() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    if (!input || !sendBtn) return;

    function handleSend() {
      const message = input.value.trim();
      if (!message) return;

      addMessage(message, 'user');
      input.value = '';
      chatHistory.push({ role: 'user', content: message });

      const typingEl = addTypingIndicator();

      // Simulate response delay
      setTimeout(() => {
        if (typingEl) typingEl.remove();
        const response = findDemoResponse(message);
        addMessage(response, 'ai');
        chatHistory.push({ role: 'ai', content: response });
      }, 800 + Math.random() * 700);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  // ===== RSA GENERATOR =====
  function initRSAGenerator() {
    const generateBtn = document.getElementById('rsaGenerate');
    if (!generateBtn) return;

    generateBtn.addEventListener('click', () => {
      const product = document.getElementById('rsaProduct').value.trim();
      const benefit = document.getElementById('rsaBenefit').value.trim();
      const keyword = document.getElementById('rsaKeyword').value.trim();
      const cta = document.getElementById('rsaCta').value;

      if (!product) {
        alert('Please enter a product or service name.');
        return;
      }

      const headlines = generateHeadlines(product, benefit, keyword, cta);
      const descriptions = generateDescriptions(product, benefit, keyword, cta);

      renderRSAOutput(headlines, descriptions);
    });

    const copyBtn = document.getElementById('rsaCopy');
    if (copyBtn) {
      copyBtn.addEventListener('click', copyRSAOutput);
    }
  }

  function truncate(str, max) {
    return str.length > max ? str.substring(0, max) : str;
  }

  function generateHeadlines(product, benefit, keyword, cta) {
    const shortProduct = product.split(' ').slice(0, 3).join(' ');
    const shortBenefit = benefit ? benefit.split(',')[0].trim() : '';
    const shortKeyword = keyword ? keyword.split(',')[0].trim() : product;
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    const templates = [
      shortKeyword + ' Terpercaya',
      shortProduct + ' #1',
      cta + ' — ' + shortProduct,
      'Promo ' + shortProduct + ' ' + month,
      'Kenapa Pilih ' + shortProduct + '?',
      shortBenefit || shortProduct,
      shortProduct + ' — ' + cta,
      'Diskon ' + shortProduct + ' ' + year,
      shortKeyword + ' Terbaik',
      shortProduct + ' — Gratis Konsultasi',
      'Cek ' + shortProduct + ' Sekarang',
      shortProduct + ' | ' + cta,
      'Review ' + shortProduct + ' ' + year,
      shortProduct + ' Profesional',
      shortProduct + ' — Hasil Terbukti',
    ];

    // Remove empty/duplicate and ensure uniqueness
    const seen = new Set();
    return templates
      .filter(h => {
        const trimmed = h.trim();
        if (!trimmed || seen.has(trimmed.toLowerCase())) return false;
        seen.add(trimmed.toLowerCase());
        return true;
      })
      .slice(0, 15);
  }

  function generateDescriptions(product, benefit, keyword, cta) {
    const shortBenefit = benefit || 'layanan terbaik';
    const shortKeyword = keyword ? keyword.split(',')[0].trim() : product;

    return [
      `${product} dengan ${shortBenefit}. ${cta} sekarang dan dapatkan penawaran terbaik hari ini.`,
      `Dapatkan ${shortKeyword} berkualitas. ${shortBenefit}. Hubungi kami untuk info lebih lanjut.`,
      `Cari ${shortKeyword}? ${product} hadir dengan ${shortBenefit}. ${cta} sekarang juga!`,
      `${product} terpercaya. ${shortBenefit}. Ribuan pelanggan puas. ${cta} hari ini.`
    ];
  }

  function renderRSAOutput(headlines, descriptions) {
    const output = document.getElementById('rsaOutput');
    const headlinesEl = document.getElementById('rsaHeadlines');
    const descriptionsEl = document.getElementById('rsaDescriptions');
    if (!output || !headlinesEl || !descriptionsEl) return;

    headlinesEl.innerHTML = '';
    descriptionsEl.innerHTML = '';

    headlines.forEach(h => {
      const item = document.createElement('div');
      const charCount = h.length;
      const isOver = charCount > 30;
      item.className = `output-item${isOver ? ' output-item--over' : ''}`;
      item.innerHTML = `
        <span class="output-item__text">${h}</span>
        <span class="output-item__chars">${charCount}/30</span>
      `;
      headlinesEl.appendChild(item);
    });

    descriptions.forEach(d => {
      const item = document.createElement('div');
      const charCount = d.length;
      const isOver = charCount > 90;
      item.className = `output-item${isOver ? ' output-item--over' : ''}`;
      item.innerHTML = `
        <span class="output-item__text">${d}</span>
        <span class="output-item__chars">${charCount}/90</span>
      `;
      descriptionsEl.appendChild(item);
    });

    output.style.display = 'block';
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function copyRSAOutput() {
    const headlinesEl = document.getElementById('rsaHeadlines');
    const descriptionsEl = document.getElementById('rsaDescriptions');
    if (!headlinesEl || !descriptionsEl) return;

    const headlines = Array.from(headlinesEl.querySelectorAll('.output-item__text')).map(el => el.textContent);
    const descriptions = Array.from(descriptionsEl.querySelectorAll('.output-item__text')).map(el => el.textContent);

    let text = '=== HEADLINES ===\n';
    headlines.forEach((h, i) => { text += `${i + 1}. ${h}\n`; });
    text += '\n=== DESCRIPTIONS ===\n';
    descriptions.forEach((d, i) => { text += `${i + 1}. ${d}\n`; });

    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('rsaCopy');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 2000);
      }
    }).catch(() => {
      // Fallback: select text area
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      const btn = document.getElementById('rsaCopy');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 2000);
      }
    });
  }

  // ===== UTM BUILDER =====
  function initUTMBuilder() {
    const fields = ['utmUrl', 'utmSource', 'utmMedium', 'utmCampaign', 'utmTerm', 'utmContent'];
    const encodeCheckbox = document.getElementById('utmEncode');

    // Real-time URL generation
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', generateUTM);
    });
    if (encodeCheckbox) encodeCheckbox.addEventListener('change', generateUTM);

    // Copy button
    const copyBtn = document.getElementById('utmCopy');
    if (copyBtn) {
      copyBtn.addEventListener('click', copyUTM);
    }

    // Load history
    loadUTMHistory();
  }

  function generateUTM() {
    const url = document.getElementById('utmUrl')?.value.trim() || '';
    const source = document.getElementById('utmSource')?.value.trim() || '';
    const medium = document.getElementById('utmMedium')?.value.trim() || '';
    const campaign = document.getElementById('utmCampaign')?.value.trim() || '';
    const term = document.getElementById('utmTerm')?.value.trim() || '';
    const content = document.getElementById('utmContent')?.value.trim() || '';
    const encode = document.getElementById('utmEncode')?.checked;

    const resultEl = document.getElementById('utmResultText');
    if (!resultEl) return;

    if (!url || !source || !medium || !campaign) {
      resultEl.textContent = 'Fill in the required fields above to generate your URL...';
      return;
    }

    function enc(val) {
      let v = val;
      if (encode) v = v.replace(/\s+/g, '_');
      return encodeURIComponent(v);
    }

    let finalUrl = url;
    if (!finalUrl.includes('://')) finalUrl = 'https://' + finalUrl;

    const sep = finalUrl.includes('?') ? '&' : '?';
    let params = `utm_source=${enc(source)}&utm_medium=${enc(medium)}&utm_campaign=${enc(campaign)}`;
    if (term) params += `&utm_term=${enc(term)}`;
    if (content) params += `&utm_content=${enc(content)}`;

    const result = finalUrl + sep + params;
    resultEl.textContent = result;
  }

  function copyUTM() {
    const resultEl = document.getElementById('utmResultText');
    if (!resultEl) return;

    const text = resultEl.textContent;
    if (text.startsWith('Fill in')) return;

    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('utmCopy');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = '✓';
        setTimeout(() => { btn.textContent = orig; }, 2000);
      }
      saveToUTMHistory(text);
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      saveToUTMHistory(text);
    });
  }

  function saveToUTMHistory(url) {
    try {
      let history = JSON.parse(localStorage.getItem('utm_history') || '[]');
      // Remove duplicate
      history = history.filter(h => h !== url);
      history.unshift(url);
      history = history.slice(0, 5);
      localStorage.setItem('utm_history', JSON.stringify(history));
      renderUTMHistory(history);
    } catch (e) { /* localStorage not available */ }
  }

  function loadUTMHistory() {
    try {
      const history = JSON.parse(localStorage.getItem('utm_history') || '[]');
      renderUTMHistory(history);
    } catch (e) { /* localStorage not available */ }
  }

  function renderUTMHistory(history) {
    const listEl = document.getElementById('utmHistoryList');
    const container = document.getElementById('utmHistory');
    if (!listEl || !container) return;

    if (history.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    listEl.innerHTML = '';
    history.forEach(url => {
      const item = document.createElement('div');
      item.className = 'utm-history-item';
      item.textContent = url.length > 80 ? url.substring(0, 80) + '...' : url;
      item.title = url;
      item.addEventListener('click', () => {
        navigator.clipboard.writeText(url).then(() => {
          item.textContent = '✓ Copied!';
          setTimeout(() => {
            item.textContent = url.length > 80 ? url.substring(0, 80) + '...' : url;
          }, 1500);
        });
      });
      listEl.appendChild(item);
    });
  }

  // ===== INIT =====
  function initFeatures() {
    initChat();
    initRSAGenerator();
    initUTMBuilder();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeatures);
  } else {
    initFeatures();
  }
})();
