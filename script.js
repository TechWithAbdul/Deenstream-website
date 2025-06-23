document.addEventListener('DOMContentLoaded', () => {
  // Navbar and Scroll Animation
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  let lastScrollY = window.scrollY;

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      if (window.scrollY > lastScrollY + 50) {
        navbar.classList.add('hidden');
      } else {
        navbar.classList.remove('hidden');
      }
    } else {
      navbar.classList.remove('scrolled', 'hidden');
    }
    lastScrollY = window.scrollY;
  });

  // Scroll-in animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });

  // Prayer Times
  const prayerCities = {
    karachi: [
      { name: 'Fajr', time: '05:00' },
      { name: 'Ishraaq', time: '06:15' },
      { name: 'Duha', time: '08:00' },
      { name: 'Dhuhr', time: '12:30' },
      { name: 'Asr', time: '15:45' },
      { name: 'Maghrib', time: '18:30' },
      { name: 'Isha', time: '20:00' },
      { name: 'Tahajjud', time: '03:30' },
    ],
    makkah: [
      { name: 'Fajr', time: '04:45' },
      { name: 'Ishraaq', time: '05:50' },
      { name: 'Duha', time: '07:30' },
      { name: 'Dhuhr', time: '12:15' },
      { name: 'Asr', time: '15:30' },
      { name: 'Maghrib', time: '18:15' },
      { name: 'Isha', time: '19:45' },
      { name: 'Tahajjud', time: '03:00' },
    ],
    dubai: [
      { name: 'Fajr', time: '04:30' },
      { name: 'Ishraaq', time: '05:35' },
      { name: 'Duha', time: '07:10' },
      { name: 'Dhuhr', time: '12:00' },
      { name: 'Asr', time: '15:15' },
      { name: 'Maghrib', time: '18:00' },
      { name: 'Isha', time: '19:30' },
      { name: 'Tahajjud', time: '02:45' },
    ],
  };
  const citySelect = document.getElementById('city-select');
  const cardsContainer = document.getElementById('prayer-cards');
  const countdownEl = document.getElementById('prayer-countdown');
  const prayerAlert = document.getElementById('prayer-alert');

  function showPrayers(city) {
    cardsContainer.innerHTML = '';
    prayerCities[city].forEach((p) => {
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
    const upcoming = prayerCities[city].find((p) => {
      const [h, m] = p.time.split(':').map(Number);
      const dt = new Date(now);
      dt.setHours(h, m, 0, 0);
      return dt > now;
    }) || prayerCities[city][0];
    const [h, m] = upcoming.time.split(':').map(Number);
    const prayerTime = new Date(now);
    prayerTime.setHours(h, m, 0, 0);
    if (prayerTime < now) prayerTime.setDate(prayerTime.getDate() + 1);
    const diff = prayerTime - now;
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    countdownEl.textContent = `Next: ${upcoming.name} in ${hrs}h ${mins}m ${secs}s`;

    if (diff <= 5 * 60 * 1000 && diff > 0) {
      prayerAlert.textContent = `Prayer Alert: ${upcoming.name} starts soon!`;
      if (Notification.permission === 'granted') {
        new Notification(`Prayer Alert: ${upcoming.name}`, {
          body: `Starts in ${hrs}h ${mins}m ${secs}s`,
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    } else {
      prayerAlert.textContent = '';
    }
  }

  citySelect.addEventListener('change', () => {
    showPrayers(citySelect.value);
    updateCountdown();
  });
  showPrayers(citySelect.value);
  setInterval(updateCountdown, 1000);

  // Quran Section
  const modeSelect = document.getElementById('quran-mode');
  const dropdown = document.getElementById('quran-selector');
  const quranContainer = document.getElementById('quran-content');
  const quranPlaceholder = document.getElementById('quran-placeholder');
  const readingProgress = document.getElementById('reading-progress');
  const audioElement = document.getElementById('quran-audio');

  fetch('./data/surahs.json')
    .then((res) => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then((data) => {
      const surahArr = data || [];
      console.log('Fetched surahs:', surahArr);

      function populateOptions(type) {
        dropdown.innerHTML = '<option disabled selected>Select an option</option>';
        if (type === 'surah') {
          surahArr.forEach((s) => {
            const o = document.createElement('option');
            o.value = s.index;
            o.textContent = `${s.index}. ${s.name}`;
            dropdown.appendChild(o);
          });
        } else {
          const parahSet = new Set();
          surahArr.forEach((s) => s.juz.forEach((j) => parahSet.add(j.index)));
          Array.from(parahSet)
            .sort((a, b) => a - b)
            .forEach((jIdx) => {
              const o = document.createElement('option');
              o.value = jIdx;
              o.textContent = `Parah ${jIdx}`;
              dropdown.appendChild(o);
            });
        }
        quranContainer.innerHTML = '';
        quranPlaceholder.style.display = 'block';
      }

      modeSelect.addEventListener('change', () => {
        populateOptions(modeSelect.value);
      });

      dropdown.addEventListener('change', () => {
        quranContainer.innerHTML = '';
        quranPlaceholder.style.display = 'none';
        console.log('Selected value:', dropdown.value, 'Mode:', modeSelect.value);

        const value = dropdown.value;
        if (modeSelect.value === 'surah') {
          const surah = surahArr.find((s) => s.index === +value);
          console.log('Found surah:', surah);
          if (surah && surah.verse) {
            const h = document.createElement('h3');
            h.textContent = `${surah.index}. ${surah.name}`;
            quranContainer.appendChild(h);
            for (let i = 1; i <= surah.count; i++) {
              const verseKey = `verse_${i}`;
              const verseText = surah.verse[verseKey] || `Verse ${i} not available`;
              console.log(`Rendering verse ${i}:`, verseText); // Debug each verse
              const p = document.createElement('p');
              p.className = 'arabic animate-on-scroll';
              p.innerHTML = `${i}. ${verseText} <span class="verse-audio"><button onclick="playVerse(${surah.index}, ${i})">Play</button></span>`;
              quranContainer.appendChild(p);
            }
            updateReadingProgress(surahArr.length, 1);
          } else {
            quranContainer.innerHTML = '<p>No surah or verses found for the selected index.</p>';
          }
        } else {
          const verses = [];
          surahArr.forEach((s) => {
            s.juz.forEach((j) => {
              if (j.index === +value) {
                const start = +j.verse.start.split('_')[1];
                const end = +j.verse.end.split('_')[1];
                for (let i = start; i <= end; i++) {
                  verses.push({
                    sIndex: s.index,
                    vNum: i,
                    text: s.verse[`verse_${i}`] || 'Verse not available',
                  });
                }
              }
            });
          });
          if (verses.length) {
            const h = document.createElement('h3');
            h.textContent = `Parah ${value}`;
            quranContainer.appendChild(h);
            verses.forEach((v) => {
              const p = document.createElement('p');
              p.className = 'arabic animate-on-scroll';
              p.innerHTML = `${v.sIndex}.${v.vNum} ${v.text} <span class="verse-audio"><button onclick="playVerse(${v.sIndex}, ${v.vNum})">Play</button></span>`;
              quranContainer.appendChild(p);
            });
            updateReadingProgress(surahArr.length, Math.ceil(verses.length / 6236));
          } else {
            quranContainer.innerHTML = '<p>No verses found for the selected parah.</p>';
          }
        }
        quranContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      populateOptions(modeSelect.value);
      loadUserPreferences(surahArr);
    })
    .catch((err) => {
      console.error('Error fetching Quran data:', err);
      quranPlaceholder.textContent = 'Failed to load Quran data. Please check the console.';
      dropdown.innerHTML = '<option>Error loading surahs</option>';
    });

  // Hadith Section
  const hadithContainer = document.getElementById('hadith-list');
  fetch('./data/hadiths.json')
    .then((res) => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then((data) => {
      const hadithArr = data || [];
      console.log('Fetched hadiths:', hadithArr);

      const colSet = new Set(hadithArr.map((h) => h.englishCollection));
      const colArr = Array.from(colSet);
      const hadithFilter = document.createElement('select');
      hadithFilter.className = 'styled-select animate-on-scroll';
      const allOpt = document.createElement('option');
      allOpt.value = 'all';
      allOpt.textContent = 'All Collections';
      hadithFilter.appendChild(allOpt);
      colArr.forEach((col) => {
        const o = document.createElement('option');
        o.value = col;
        o.textContent = col;
        hadithFilter.appendChild(o);
      });
      hadithContainer.parentElement.insertBefore(hadithFilter, hadithContainer); // Ensure filter is before container
      observer.observe(hadithFilter);

      function displayHadith(filter) {
        hadithContainer.innerHTML = '';
        const filteredHadiths = hadithArr.filter((h) => filter === 'all' || h.englishCollection === filter);
        console.log('Filtered hadiths:', filteredHadiths);
        if (filteredHadiths.length > 0) {
          filteredHadiths.forEach((h) => {
            const card = document.createElement('div');
            card.className = 'card animate-on-scroll';
            card.innerHTML = `
              <p class="english">${h.englishText || 'Text not available'}</p>
              <p class="arabic hidden">${h.arabicText || 'Text not available'}</p>
              <button class="toggle-btn">Show Arabic</button>`;
            hadithContainer.appendChild(card);
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
        } else {
          hadithContainer.innerHTML = '<p>No hadiths found for the selected collection.</p>';
        }
      }

      displayHadith('all');
      hadithFilter.addEventListener('change', () => displayHadith(hadithFilter.value));
    })
    .catch((err) => {
      console.error('Error fetching Hadith data:', err);
      hadithContainer.innerHTML = '<p>Failed to load Hadith data. Please check the console.</p>';
    });

  // Islamic Calendar Section
  const islamicDateElem = document.getElementById('islamic-date');
  const todayEventElem = document.getElementById('today-event');
  const upcomingEventsList = document.getElementById('upcoming-events-list');

  function getIslamicDate() {
    const dt = new Date();
    const hijri = dt.toLocaleDateString('en-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    islamicDateElem.textContent = hijri;
    todayEventElem.textContent = "No special events today.";
    const events = [
      { date: '1 Muharram', event: 'Islamic New Year' },
      { date: '10 Muharram', event: 'Ashura' },
    ];
    upcomingEventsList.innerHTML = events
      .map((e) => `<li>${e.date}: ${e.event}</li>`)
      .join('');
  }
  getIslamicDate();

  // Daily Content (Dua or Hadith) on Welcome Section
  const dailyContent = document.getElementById('daily-content');
  if (!dailyContent) console.error('dailyContent element not found');
  const dailyData = [
    {
      type: 'Dua',
      text: 'Rabbi Zidni Ilma (O my Lord! Increase me in knowledge) - Quran 20:114',
    },
    {
      type: 'Hadith',
      text: 'The best among you are those who learn the Qur’an and teach it. - Sahih Bukhari',
    },
  ];
  function getDailyContent() {
    const today = new Date().toDateString();
    const lastUpdate = localStorage.getItem('lastDailyUpdate');
    if (!lastUpdate || lastUpdate !== today) {
      const index = Math.floor(Math.random() * dailyData.length);
      const content = `<h3>${dailyData[index].type}</h3><p>${dailyData[index].text}</p>`;
      if (dailyContent) dailyContent.innerHTML = content; // Check if element exists
      localStorage.setItem('lastDailyUpdate', today);
      localStorage.setItem('lastDailyContent', content);
    } else {
      if (dailyContent) dailyContent.innerHTML = localStorage.getItem('lastDailyContent') || '<p>Loading daily content...</p>';
    }
    if (dailyContent) console.log('Daily content updated:', dailyContent.innerHTML);
  }
  getDailyContent();

  // User Preferences and Reading Progress
  function loadUserPreferences(surahArr) {
    const savedCity = localStorage.getItem('preferredCity') || 'karachi';
    citySelect.value = savedCity;
    showPrayers(savedCity);
    updateCountdown();

    const savedSurah = localStorage.getItem('lastReadSurah');
    if (savedSurah) {
      dropdown.value = savedSurah;
      dropdown.dispatchEvent(new Event('change'));
    }

    updateReadingProgress(surahArr.length, savedSurah ? 1 : 0);
  }

  function updateReadingProgress(totalSurahs, completedSurahs) {
    const progress = ((completedSurahs / totalSurahs) * 100).toFixed(1);
    readingProgress.innerHTML = `<p>Quran Reading Progress: ${progress}% (${completedSurahs}/${totalSurahs} Surahs)</p>`;
    localStorage.setItem('lastReadSurah', completedSurahs > 0 ? dropdown.value : null);
  }

  window.playVerse = (surah, verse) => {
    const audioUrl = `https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/${surah}:${verse}`;
    audioElement.src = audioUrl;
    audioElement.play().catch((err) => console.error('Audio play failed:', err));
  };

  citySelect.addEventListener('change', () => {
    localStorage.setItem('preferredCity', citySelect.value);
  });
});