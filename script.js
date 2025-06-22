document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll animation
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;
  });


  // Scroll-in animations
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  /* Prayer Times */
  const prayerCities = {
    karachi: [
      { name: 'Fajr', time: '05:00' },
      { name: 'Ishraaq', time: '06:15' },
      { name: 'Duha', time: '08:00' },
      { name: 'Dhuhr', time: '12:30' },
      { name: 'Asr', time: '15:45' },
      { name: 'Maghrib', time: '18:30' },
      { name: 'Isha', time: '20:00' },
      { name: 'Tahajjud', time: '03:30' }
    ],
    makkah: [
      { name: 'Fajr', time: '04:45' },
      { name: 'Ishraaq', time: '05:50' },
      { name: 'Duha', time: '07:30' },
      { name: 'Dhuhr', time: '12:15' },
      { name: 'Asr', time: '15:30' },
      { name: 'Maghrib', time: '18:15' },
      { name: 'Isha', time: '19:45' },
      { name: 'Tahajjud', time: '03:00' }
    ],
    dubai: [
      { name: 'Fajr', time: '04:30' },
      { name: 'Ishraaq', time: '05:35' },
      { name: 'Duha', time: '07:10' },
      { name: 'Dhuhr', time: '12:00' },
      { name: 'Asr', time: '15:15' },
      { name: 'Maghrib', time: '18:00' },
      { name: 'Isha', time: '19:30' },
      { name: 'Tahajjud', time: '02:45' }
    ]
  };
  const citySelect = document.getElementById('city-select');
  const cardsContainer = document.getElementById('prayer-cards');
  const countdownEl = document.getElementById('prayer-countdown');

  function showPrayers(city) {
    cardsContainer.innerHTML = '';
    prayerCities[city]?.forEach(p => {
      const card = document.createElement('div');
      card.className = 'prayer-card animate-on-scroll';
      card.innerHTML = `<div class="prayer-name">${p.name}</div><div class="prayer-time">${p.time}</div>`;
      cardsContainer.appendChild(card); 
      observer.observe(card);
    });
  }

  function updateCountdown() {
    const city = citySelect.value;
    const now = new Date();
    const upcoming = prayerCities[city].find(p => {
      const [h,m] = p.time.split(':').map(Number);
      const dt = new Date(now); dt.setHours(h,m,0,0);
      return dt > now;
    }) || prayerCities[city][0];
    const [h,m] = upcoming.time.split(':').map(Number);
    const prayerTime = new Date(now); prayerTime.setHours(h,m,0,0);
    if (prayerTime < now) prayerTime.setDate(prayerTime.getDate()+1);
    const diff = prayerTime - now;
    const hrs = Math.floor(diff/3600000), mins = Math.floor(diff%3600000/60000), secs = Math.floor(diff%60000/1000);
    countdownEl.textContent = `Next: ${upcoming.name} in ${hrs}h ${mins}m ${secs}s`;
  }

  citySelect.addEventListener('change', () => {
    showPrayers(citySelect.value);
    updateCountdown();
  });
  showPrayers(citySelect.value);
  setInterval(updateCountdown, 1000);


  /* Quran Section */
  const modeSelect = document.getElementById('quran-mode');
  const dropdown = document.getElementById('quran-selector');
  const quranContainer = document.getElementById('quran-content');
  const quranPlaceholder = document.getElementById('quran-placeholder');

  fetch('data/surahs.json')
    .then(res => res.json())
    .then(surahArr => {
      function populateOptions(type) {
        dropdown.innerHTML = '';
        if (type === 'surah') {
          surahArr.forEach(s => {
            const o = document.createElement('option');
            o.value = s.index;
            o.textContent = `${s.index}. ${s.name}`;
            dropdown.appendChild(o);
          });
        } else {
          // Collect unique Parah indices
          const parahSet = new Set();
          surahArr.forEach(s => s.juz.forEach(j => parahSet.add(j.index)));
          Array.from(parahSet).sort().forEach(jIdx => {
            const o = document.createElement('option');
            o.value = jIdx;
            o.textContent = `Parah ${jIdx}`;
            dropdown.appendChild(o);
          });
        }
        // Reset container and placeholder on filter change
        quranContainer.innerHTML = '';
        quranPlaceholder.style.display = 'block';
      }

      modeSelect.addEventListener('change', () => {
        populateOptions(modeSelect.value);
      });

      dropdown.addEventListener('change', () => {
        quranContainer.innerHTML = '';
        quranPlaceholder.style.display = 'none';

        if (modeSelect.value === 'surah') {
          const surah = surahArr.find(s => s.index === dropdown.value);
          displaySurah(surah);
          scrollToSection(quranContainer);
        } else {
          // Parah mode
          const verses = [];
          surahArr.forEach(s => {
            s.juz.forEach(j => {
              if (j.index === dropdown.value) {
                const start = +j.verse.start.split('_')[1];
                const end = +j.verse.end.split('_')[1];
                for (let i = start; i <= end; i++) {
                  verses.push({ sIndex: s.index, vNum: i, text: s.verse[`verse_${i}`] });
                }
              }
            });
          });
          displayParah(dropdown.value, verses);
          scrollToSection(quranContainer);
        }
      });

      populateOptions(modeSelect.value);

      function displaySurah(s) {
        if (!s) return;
        const h = document.createElement('h3');
        h.textContent = `${s.index}. ${s.name}`;
        quranContainer.appendChild(h);
        for (let i = 1; i <= s.count; i++) {
          const p = document.createElement('p');
          p.className = 'arabic animate-on-scroll';
          p.textContent = `${i}. ${s.verse[`verse_${i}`]}`;
          quranContainer.appendChild(p);
        }
      }

      function displayParah(idx, arr) {
        const h = document.createElement('h3');
        h.textContent = `Parah ${idx}`;
        quranContainer.appendChild(h);
        arr.forEach(v => {
          const p = document.createElement('p');
          p.className = 'arabic animate-on-scroll';
          p.textContent = `${v.sIndex}.${v.vNum} ${v.text}`;
          quranContainer.appendChild(p);
        });
      }

      function scrollToSection(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    })
    .catch(err => console.error(err));

  /* Hadith Section */
   const hadithContainer = document.getElementById('hadith-list');
  fetch('data/hadiths.json')
    .then(res => res.json())
    .then(data => {
      const colSet = new Set(data.map(h=>h.englishCollection));
      const colArr = Array.from(colSet);
      const hadithFilter = document.createElement('select');
      hadithFilter.className = 'styled-select animate-on-scroll';
      const allOpt = document.createElement('option'); allOpt.value='all'; allOpt.text='All Collections';
      hadithFilter.append(allOpt);
      colArr.forEach(col => {
        const o = document.createElement('option'); o.value=col; o.text=col;
        hadithFilter.append(o);
      });
      hadithContainer.parentElement.prepend(hadithFilter);
      observer.observe(hadithFilter);
      function displayHadith(filter) {
        hadithContainer.innerHTML = '';
        data.filter(h => filter==='all' || h.englishCollection===filter)
          .forEach(h => {
            const card = document.createElement('div');
            card.className = 'card animate-on-scroll';
            card.innerHTML = `
              <p class="english">${h.englishText}</p>
              <p class="arabic hidden">${h.arabicText}</p>
              <button class="toggle-btn">Show Arabic</button>`;
            hadithContainer.append(card);
            const btn = card.querySelector('.toggle-btn');
            btn.addEventListener('click', () => {
              const eLang = card.querySelector('.english');
              const aLang = card.querySelector('.arabic');
              if (aLang.classList.contains('hidden')) {
                aLang.classList.remove('hidden');
                eLang.classList.add('hidden');
                btn.textContent = 'Show English';
              } else {
                aLang.classList.add('hidden');
                eLang.classList.remove('hidden');
                btn.textContent = 'Show Arabic';
              }
            });
          });
      }
      displayHadith('all');
      hadithFilter.addEventListener('change', () => displayHadith(hadithFilter.value));
    })
    .catch(err => console.error(err));
  /* Islamic Calendar Section */
  const islamicDateElem = document.getElementById('islamic-date');
  const todayEventElem = document.getElementById('today-event');

  function getIslamicDate() {
    // For now: static example
    const dt = new Date();
    const hijri = dt.toLocaleDateString('en-u-ca-islamic', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    islamicDateElem.textContent = hijri;
    todayEventElem.textContent = "No special events today.";
  }
  getIslamicDate();

});
