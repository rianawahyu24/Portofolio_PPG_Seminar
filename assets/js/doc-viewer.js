/* Pratinjau dokumen inline (tanpa tab baru).
   Pemakaian: <div class="doc-viewer" data-doc-name="..." data-doc-url="..." data-doc-thumb="..."></div>
   - data-doc-url: path PDF lokal (assets/pdf/xxx.pdf) atau tautan Google Drive (…/file/d/ID/view)
   - data-doc-thumb: (opsional) gambar sampul halaman pertama; untuk Drive dibuat otomatis
   Tanpa data-doc-url, kartu tampil sebagai "belum diunggah". */
(function () {
  function driveId(u) {
    var m = /drive\.google\.com\/file\/d\/([^/]+)/.exec(u) || /[?&]id=([^&]+)/.exec(u);
    return m ? m[1] : null;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  window.renderDocViewer = function (el, opt) {
    var name = opt.name || 'Dokumen belum tersedia';
    var url = opt.url || '';
    var gid = url ? driveId(url) : null;
    var embed = !url ? '' : gid ? 'https://drive.google.com/file/d/' + gid + '/preview' : url + '#view=FitH&toolbar=1&navpanes=0';
    var thumb = opt.thumb || (gid ? 'https://drive.google.com/thumbnail?id=' + gid + '&sz=w600' : '');
    var dl = gid ? 'https://drive.google.com/uc?export=download&id=' + gid : url;
    var ready = !!url;
    var uid = 'dv' + Math.random().toString(36).slice(2, 8);

    el.classList.add('doc-viewer');
    el.innerHTML =
      '<div class="doc-card' + (ready ? '' : ' is-empty') + '">' +
        '<div class="doc-paper" aria-hidden="true">' +
          (thumb ? '<img src="' + esc(thumb) + '" alt="" loading="lazy" onerror="this.remove()">' : '') +
          '<div class="doc-lines"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
          '<span class="doc-badge">PDF</span>' +
        '</div>' +
        '<div class="doc-meta">' +
          '<p class="eyebrow">Artefak Tugas</p>' +
          '<p class="doc-name">' + esc(name) + '</p>' +
          '<p class="muted doc-sub">' + (ready ? 'Klik tombol untuk membuka pratinjau langsung di halaman ini.' : 'Berkas belum diunggah.') + '</p>' +
          (ready
            ? '<div class="doc-actions"><button type="button" class="btn btn-primary btn-sm" aria-expanded="false" aria-controls="' + uid + '">Lihat Dokumen</button>' +
              '<a class="btn btn-outline btn-sm" href="' + esc(dl) + '" download>Unduh</a></div>'
            : '') +
        '</div>' +
      '</div>' +
      '<div class="doc-preview" id="' + uid + '" hidden>' +
        '<div class="doc-toolbar"><span class="doc-tname">' + esc(name) + '</span>' +
        '<button type="button" class="doc-close" aria-label="Tutup pratinjau">Tutup ✕</button></div>' +
        '<div class="doc-frame"></div>' +
        '<p class="muted doc-note">Pratinjau tidak tampil di perangkat Anda? Gunakan tombol Unduh.</p>' +
      '</div>';

    if (!ready) return;
    var btn = el.querySelector('.doc-actions button');
    var box = el.querySelector('.doc-preview');
    var frame = el.querySelector('.doc-frame');
    function open() {
      if (!frame.firstChild) {
        var f = document.createElement('iframe');
        f.src = embed; f.title = 'Pratinjau ' + name; f.loading = 'lazy';
        frame.appendChild(f);
      }
      box.hidden = false; btn.setAttribute('aria-expanded', 'true'); btn.textContent = 'Sembunyikan Dokumen';
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    function close() { box.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Lihat Dokumen'; }
    btn.addEventListener('click', function () { box.hidden ? open() : close(); });
    el.querySelector('.doc-close').addEventListener('click', close);
  };

  document.querySelectorAll('.doc-viewer[data-doc-name]').forEach(function (el) {
    window.renderDocViewer(el, { name: el.dataset.docName, url: el.dataset.docUrl, thumb: el.dataset.docThumb });
  });
})();
