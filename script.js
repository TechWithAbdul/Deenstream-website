document.addEventListener('DOMContentLoaded', () => {
  // Navbar and Scroll Animation
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
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

  // Daily Content
  const dailyContent = document.getElementById('daily-content');
  if (!dailyContent) console.error('dailyContent element not found');
  fetch('http://api.alquran.cloud/v1/ayah/1')
    .then((res) => res.json())
    .then((data) => {
      const text = data.data.text || 'O Lord, increase me in knowledge';
      dailyContent.innerHTML = `<h3>Daily Dua</h3><p>${text}</p>`;
      console.log('Daily content updated:', dailyContent.innerHTML);
    })
    .catch((err) => {
      console.error('Error fetching daily content:', err);
      if (dailyContent) dailyContent.innerHTML = '<p>Failed to load daily content. Check connection.</p>';
    });

  // Quran Section with API and Navigation Stack
  const quranDashboard = document.getElementById('quran-dashboard');
  const quranContent = document.getElementById('quran-content');
  const quranPlaceholder = document.getElementById('quran-placeholder');
  const quranControls = document.getElementById('quran-controls');
  const audioElement = document.getElementById('quran-audio');
  const returnQuranBtn = document.getElementById('return-quran');
  let navStack = ['dashboard']; // Initialize with initial state

  fetch('http://api.alquran.cloud/v1/quran/quran-uthmani')
    .then((res) => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then((data) => {
      const surahArr = data.data.surahs || [];
      console.log('Fetched surahs from API:', surahArr);

      // Render current state based on stack
      function renderState(state) {
        quranContent.style.display = 'none';
        quranControls.style.display = 'none';
        returnQuranBtn.style.display = state === 'dashboard' ? 'none' : 'block';

        if (state === 'dashboard') {
          quranDashboard.innerHTML = `
            <div class="dashboard-item" data-type="surah">Read by Surah - قراءة حسب السورة</div>
            <div class="dashboard-item" data-type="parah">Read by Parah - قراءة حسب الجزء</div>
          `;
          quranDashboard.style.display = 'grid';
        } else if (state === 'surah-list') {
          quranDashboard.innerHTML = '';
          surahArr.forEach((s) => {
            const div = document.createElement('div');
            div.className = 'dashboard-item';
            div.textContent = `${s.number}. ${s.englishName} (${s.name})`;
            div.dataset.surah = s.number;
            quranDashboard.appendChild(div);
          });
          quranDashboard.style.display = 'grid';
        } else if (state === 'parah-list') {
          quranDashboard.innerHTML = '';
          for (let i = 1; i <= 30; i++) {
            const div = document.createElement('div');
            div.className = 'dashboard-item';
            div.textContent = `Parah ${i} - الجزء ${i}`;
            div.dataset.parah = i;
            quranDashboard.appendChild(div);
          }
          quranDashboard.style.display = 'grid';
        }
      }

      // Initialize with dashboard
      renderState('dashboard');

      // Navigation handler
      quranDashboard.addEventListener('click', (e) => {
        const item = e.target.closest('.dashboard-item');
        if (!item) return;
        const type = item.dataset.type;
        const surah = item.dataset.surah;
        const parah = item.dataset.parah;

        if (type === 'surah' && !surah) {
          navStack.push('surah-list');
          renderState('surah-list');
        } else if (type === 'parah' && !parah) {
          navStack.push('parah-list');
          renderState('parah-list');
        } else if (surah) {
          loadSurah(surah);
          navStack.push(`surah-${surah}`);
        } else if (parah) {
          loadParah(parah);
          navStack.push(`parah-${parah}`);
        }
      });

      function loadSurah(surahNum) {
        fetch(`http://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`)
          .then((res) => res.json())
          .then((data) => {
            const surah = data.data;
            console.log('Fetched surah:', surah);
            quranContent.innerHTML = `<h3>${surah.number}. ${surah.englishName} (${surah.name})</h3>`;
            surah.ayahs.forEach((ayah, index) => {
              const verseDiv = document.createElement('div');
              verseDiv.className = 'verse';
              verseDiv.textContent = `${index + 1}. ${ayah.text}`;
              verseDiv.dataset.surah = surahNum;
              verseDiv.dataset.verse = index + 1;
              quranContent.appendChild(verseDiv);
            });
            quranContent.style.display = 'block';
            quranDashboard.style.display = 'none';
            quranControls.style.display = 'block';
            quranControls.innerHTML = `
              <button onclick="playSurah(${surahNum})">Play Full Surah - تشغيل السورة كاملة</button>
              <button onclick="explainVerse(${surahNum}, 1)">Explain Verse - شرح الآية</button>
            `;
          })
          .catch((err) => {
            console.error('Error fetching surah:', err);
            quranContent.innerHTML = '<p>Failed to load Surah. Check connection.</p>';
          });
      }

      function loadParah(parahNum) {
        fetch(`http://api.alquran.cloud/v1/juz/${parahNum}/quran-uthmani`)
          .then((res) => res.json())
          .then((data) => {
            const juz = data.data;
            console.log('Fetched parah:', juz);
            quranContent.innerHTML = `<h3>Parah ${parahNum} - الجزء ${parahNum}</h3>`;
            juz.ayahs.forEach((ayah, index) => {
              const verseDiv = document.createElement('div');
              verseDiv.className = 'verse';
              verseDiv.textContent = `${ayah.surah.number}.${ayah.numberInSurah} ${ayah.text}`;
              verseDiv.dataset.surah = ayah.surah.number;
              verseDiv.dataset.verse = ayah.numberInSurah;
              quranContent.appendChild(verseDiv);
            });
            quranContent.style.display = 'block';
            quranDashboard.style.display = 'none';
            quranControls.style.display = 'block';
            quranControls.innerHTML = `
              <button onclick="playParah(${parahNum})">Play Full Parah - تشغيل الجزء كامل</button>
              <button onclick="explainVerse(${juz.ayahs[0].surah.number}, ${juz.ayahs[0].numberInSurah})">Explain Verse - شرح الآية</button>
            `;
          })
          .catch((err) => {
            console.error('Error fetching parah:', err);
            quranContent.innerHTML = '<p>Failed to load Parah. Check connection.</p>';
          });
      }

      returnQuranBtn.addEventListener('click', () => {
        navStack.pop(); // Remove current state
        const prevState = navStack[navStack.length - 1] || 'dashboard';
        if (prevState === 'dashboard') {
          renderState('dashboard');
        } else if (prevState === 'surah-list') {
          renderState('surah-list');
        } else if (prevState === 'parah-list') {
          renderState('parah-list');
        } else if (prevState.startsWith('surah-')) {
          loadSurah(prevState.split('-')[1]);
        } else if (prevState.startsWith('parah-')) {
          loadParah(prevState.split('-')[1]);
        }
        if (navStack.length <= 1) returnQuranBtn.style.display = 'none'; // Hide if back to initial state
      });
    })
    .catch((err) => {
      console.error('Error fetching Quran data:', err);
      quranPlaceholder.textContent = 'Failed to load Quran data. Check connection.';
    });

  window.playSurah = (surah) => {
    const audioUrl = `http://api.alquran.cloud/v1/surah/${surah}/ar.alafasy`;
    audioElement.src = audioUrl;
    audioElement.play().catch((err) => {
      console.error('Audio play failed:', err);
      alert('Failed to play Surah audio. Check connection.');
    });
  };

  window.playParah = (parah) => {
    const audioUrl = `http://api.alquran.cloud/v1/juz/${parah}/ar.alafasy`;
    audioElement.src = audioUrl;
    audioElement.play().catch((err) => {
      console.error('Audio play failed:', err);
      alert('Failed to play Parah audio. Check connection.');
    });
  };

  window.explainVerse = (surah, verse) => {
    alert(`Explanation for Verse ${surah}:${verse}: This verse holds great spiritual guidance. Refer to Tafsir for details. - شرح الآية ${surah}:${verse}: هذه الآية تحمل إرشادًا روحيًا عظيمًا. راجع التفسير للتفاصيل`);
  };

  quranContent.addEventListener('click', (e) => {
    const verseDiv = e.target.closest('.verse');
    if (verseDiv) {
      const surah = verseDiv.dataset.surah;
      const verse = verseDiv.dataset.verse;
      if (confirm(`Select action for Verse ${surah}:${verse}\n- OK for Audio\n- Cancel for Explanation - اختر إجراء للآية ${surah}:${verse}\n- موافق للصوت\n- إلغاء للشرح`)) {
        playVerse(surah, verse);
      } else {
        explainVerse(surah, verse);
      }
    }
  });

  window.playVerse = (surah, verse) => {
    const audioUrl = `http://api.alquran.cloud/v1/ayah/${surah}:${verse}/ar.alafasy`;
    audioElement.src = audioUrl;
    audioElement.play().catch((err) => {
      console.error('Audio play failed:', err);
      alert('Failed to play verse audio. Check connection.');
    });
  };

  // Hadith Section with Al-Adhan API
  const hadithContent = document.getElementById('hadith-content');
  fetch('http://api.aladhan.com/v1/hadiths')
    .then((res) => res.json())
    .then((data) => {
      const hadithArr = data.data || [];
      console.log('Fetched hadiths from Al-Adhan API:', hadithArr);

      hadithArr.forEach((h) => {
        const card = document.createElement('div');
        card.className = 'hadith-card';
        card.innerHTML = `
          <p class="english">${h.english || 'Text not available'}</p>
          <p class="arabic hidden">${h.arabic || 'نص غير متوفر'}</p>
          <button class="toggle-btn">Show Arabic - إظهار العربية</button>`;
        hadithContent.appendChild(card);
        const btn = card.querySelector('.toggle-btn');
        btn.addEventListener('click', () => {
          const eLang = card.querySelector('.english');
          const aLang = card.querySelector('.arabic');
          if (aLang.classList.contains('hidden')) {
            aLang.classList.remove('hidden');
            eLang.classList.add('hidden');
            btn.textContent = 'Show English - إظهار الإنجليزية';
          } else {
            aLang.classList.add('hidden');
            eLang.classList.remove('hidden');
            btn.textContent = 'Show Arabic - إظهار العربية';
          }
        });
      });
    })
    .catch((err) => {
      console.error('Error fetching Hadith data:', err);
      hadithContent.innerHTML = '<p>Failed to load Hadiths. Check connection or API limits.</p>';
    });

  // Prayer Times by Location using Al-Adhan API
  const prayerTimesContainer = document.getElementById('prayer-times');
  const countdownEl = document.getElementById('prayer-countdown');
  const prayerAlert = document.getElementById('prayer-alert');
  const adhanBtn = document.getElementById('adhan-btn');
  const adhanAudio = document.getElementById('adhan-audio');

  function getLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
          (error) => reject(error)
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  }

  function fetchPrayerTimes(lat, lon) {
    return fetch(`http://api.aladhan.com/v1/timingsByCity?city=Karachi&country=Pakistan&method=2`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => data.data.timings)
      .catch((err) => {
        console.error('Error fetching prayer times:', err);
        return {
          Fajr: '04:31',
          Sunrise: '05:43',
          Dhuhr: '12:34',
          Asr: '15:56',
          Maghrib: '19:25',
          Isha: '20:37',
          Tahajjud: '03:30',
        };
      });
  }

  function showPrayers(timings) {
    prayerTimesContainer.innerHTML = '';
    const prayerTimes = [
      { name: 'Fajr - الفجر', time: timings.Fajr || '04:31' },
      { name: 'Sunrise - شروق الشمس', time: timings.Sunrise || '05:43' },
      { name: 'Dhuhr - الظهر', time: timings.Dhuhr || '12:34' },
      { name: 'Asr - العصر', time: timings.Asr || '15:56' },
      { name: 'Maghrib - المغرب', time: timings.Maghrib || '19:25' },
      { name: 'Isha - العشاء', time: timings.Isha || '20:37' },
      { name: 'Tahajjud - تهجد', time: timings.Tahajjud || '03:30' },
    ];
    prayerTimes.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'prayer-time-card';
      card.innerHTML = `<div class="prayer-name">${p.name}</div><div class="prayer-time">${p.time}</div>`;
      prayerTimesContainer.appendChild(card);
    });
    console.log('Prayer cards created:', prayerTimesContainer.innerHTML); // Debug
    // Force reflow to ensure visibility
    prayerTimesContainer.style.display = 'grid';
    void prayerTimesContainer.offsetHeight; // Trigger reflow
  }

  function updateCountdown(timings) {
    const now = new Date();
    const prayerTimes = [
      { name: 'Fajr - الفجر', time: timings.Fajr || '04:31' },
      { name: 'Sunrise - شروق الشمس', time: timings.Sunrise || '05:43' },
      { name: 'Dhuhr - الظهر', time: timings.Dhuhr || '12:34' },
      { name: 'Asr - العصر', time: timings.Asr || '15:56' },
      { name: 'Maghrib - المغرب', time: timings.Maghrib || '19:25' },
      { name: 'Isha - العشاء', time: timings.Isha || '20:37' },
      { name: 'Tahajjud - تهجد', time: timings.Tahajjud || '03:30' },
    ];
    const upcoming = prayerTimes.find((p) => {
      const [h, m] = p.time.split(':').map(Number);
      const dt = new Date(now);
      dt.setHours(h, m, 0, 0);
      return dt > now;
    }) || prayerTimes[0];
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
      prayerAlert.innerHTML = `<p>Prayer Alert: ${upcoming.name} starting soon!</p>`;
    } else {
      prayerAlert.innerHTML = '';
    }
  }

  adhanBtn.addEventListener('click', () => {
    adhanAudio.src = 'https://www.islamicfinder.org/mp3/adhan.mp3';
    adhanAudio.style.display = 'block';
    adhanAudio.play().catch((err) => {
      console.error('Adhan play failed:', err);
      alert('Failed to play Adhan. Check connection.');
    });
  });

  getLocation()
    .then(({ lat, lon }) => fetchPrayerTimes(lat, lon))
    .catch(() => fetchPrayerTimes())
    .then((timings) => {
      showPrayers(timings);
      setInterval(() => updateCountdown(timings), 1000);
    });

  // Islamic Calendar
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
    islamicDateElem.textContent = `Islamic Date: ${hijri} (17 Dhul-Qadah 1446 AH) - التاريخ الإسلامي`;
    todayEventElem.textContent = "No special events today. - لا توجد أحداث خاصة اليوم";
    const events = [
      { date: '1 Muharram', event: 'Islamic New Year' },
      { date: '10 Muharram', event: 'Ashura' },
    ];
    upcomingEventsList.innerHTML = events
      .map((e) => `<li>${e.date} - ${e.date}: ${e.event} - ${e.event}</li>`)
      .join('');
  }

  getIslamicDate();
});