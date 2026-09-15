(function () {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const data = (typeof matkulData !== 'undefined') ? matkulData[id] : null;

  if (!data) {
    document.getElementById('course-title').textContent = 'Mata kuliah tidak ditemukan';
    document.getElementById('course-intro').textContent = 'Periksa kembali tautan yang digunakan, atau kembali ke Daftar Isi.';
    return;
  }

  document.title = data.title + ' — Portofolio Seminar PPG';
  document.getElementById('page-title').textContent = data.title + ' — Portofolio Seminar PPG';
  document.getElementById('course-kicker').textContent = data.semesterLabel + ' — Refleksi Mata Kuliah';
  document.getElementById('course-title').textContent = data.title;
  document.getElementById('course-intro').textContent = data.intro;
  document.getElementById('crumb-course').textContent = data.title;

  const semesterHref = 'semester-' + data.semester + '.html';
  const crumbSemester = document.getElementById('crumb-semester');
  crumbSemester.href = semesterHref;
  crumbSemester.textContent = data.semesterLabel;
  document.getElementById('back-link').href = semesterHref;

  const cIcons = {
    connection: '<path d="M9 17H7a5 5 0 0 1 0-10h2"/><path d="M15 7h2a5 5 0 0 1 0 10h-2"/><path d="M8 12h8"/>',
    challenge: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6" fill="currentColor" stroke="none"/>',
    concept: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.46.9 1.02.9 1.7v.5h5.4v-.5c0-.68.3-1.24.9-1.7A6 6 0 0 0 12 3Z"/>',
    change: '<path d="M4 20c2-6 4-9 8-9s6 3 8 9"/><path d="M12 3v8"/><path d="M9 6l3-3 3 3"/>'
  };

  const cItems = [
    { key: 'connection', label: 'Connection', sub: 'Keterkaitan dengan pengalaman mengajar' },
    { key: 'challenge', label: 'Challenge', sub: 'Tantangan yang dihadapi' },
    { key: 'concept', label: 'Concept', sub: 'Konsep utama yang dipelajari' },
    { key: 'change', label: 'Change', sub: 'Perubahan yang ingin dilakukan' }
  ];

  const accWrap = document.getElementById('accordion-4c');
  const connector = document.createElement('div');
  connector.className = 'c-connector';
  accWrap.appendChild(connector);
  cItems.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'accordion-item' + (i === 0 ? ' open' : '');
    el.dataset.c = item.key;
    el.innerHTML = `
      <button class="accordion-trigger" aria-expanded="${i === 0}">
        <span class="a-title">
          <span class="a-num">0${i + 1}</span>
          <span class="deco-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${cIcons[item.key]}</svg></span>
          <span class="a-label">${item.label}</span>
          <span class="a-sub">${item.sub}</span>
        </span>
        <span class="accordion-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </span>
      </button>
      <div class="accordion-panel">
        <div class="accordion-panel-inner"><p>${data[item.key]}</p></div>
      </div>`;
    accWrap.appendChild(el);
  });

  document.getElementById('artefact-name').textContent = data.artefactName;
  document.getElementById('analisis-content').innerHTML = `<p>${data.analysis}</p>`;
  document.getElementById('praktis-content').innerHTML = `<p>${data.practical}</p>`;

  // Open first accordion panel by default (main.js handles further toggling)
  requestAnimationFrame(() => {
    const first = accWrap.querySelector('.accordion-item.open .accordion-panel');
    if (first) first.style.maxHeight = first.scrollHeight + 'px';
  });
})();
