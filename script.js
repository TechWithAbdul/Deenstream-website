document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    animateElements.forEach(el => observer.observe(el));

    // Qur’an Page
    if (document.getElementById('quran-list')) {
        fetch('data/surahs.json')
            .then(response => response.json())
            .then(data => {
                const quranList = document.getElementById('quran-list');
                data.forEach(surah => {
                    const card = document.createElement('div');
                    card.className = 'card animate-on-scroll';
                    card.innerHTML = `
                        <h3>${surah.name}</h3>
                        <p>${surah.englishName} - ${surah.verses} Verses</p>
                        <p class="arabic verse" data-verse="${surah.number}">${surah.arabicText}</p>
                        <audio controls src="${surah.audioUrl}" onplay="highlightVerse(${surah.number})"></audio>
                    `;
                    quranList.appendChild(card);
                });
            })
            .catch(error => console.error('Error loading Surahs:', error));
    }

    // Highlight Verse
    window.highlightVerse = (verseNumber) => {
        document.querySelectorAll('.verse').forEach(verse => {
            verse.classList.remove('verse-highlight');
        });
        document.querySelector(`.verse[data-verse="${verseNumber}"]`).classList.add('verse-highlight');
    };

    // Hadith Page
    if (document.getElementById('hadith-list')) {
        fetch('data/hadiths.json')
            .then(response => response.json())
            .then(data => {
                const hadithList = document.getElementById('hadith-list');
                const collections = [...new Set(data.map(h => h.englishCollection))];
                collections.forEach(collection => {
                    const card = document.createElement('div');
                    card.className = 'card animate-on-scroll';
                    card.innerHTML = `<h3>${collection}</h3>`;
                    const collectionHadiths = data.filter(h => h.englishCollection === collection);
                    collectionHadiths.forEach(hadith => {
                        const div = document.createElement('div');
                        div.innerHTML = `
                            <p class="english">${hadith.englishText}</p>
                            <p class="arabic hidden">${hadith.arabicText}</p>
                            <button class="toggle-btn" onclick="toggleText(this)">Show Arabic</button>
                        `;
                        card.appendChild(div);
                    });
                    hadithList.appendChild(card);
                });
            })
            .catch(error => console.error('Error loading Hadiths:', error));
    }

    // Toggle Arabic/English
    window.toggleText = (btn) => {
        const parent = btn.parentElement;
        const english = parent.querySelector('.english');
        const arabic = parent.querySelector('.arabic');
        if (arabic.classList.contains('hidden')) {
            english.classList.add('hidden');
            arabic.classList.remove('hidden');
            btn.textContent = 'Show English';
        } else {
            arabic.classList.add('hidden');
            english.classList.remove('hidden');
            btn.textContent = 'Show Arabic';
        }
    };

    // Prayer Times Data
    const prayerTimes = {
        karachi: [
            { name: 'Fajr (فجر)', time: '05:00' },
            { name: 'Dhuhr (ظهر)', time: '12:30' },
            { name: 'Asr (عصر)', time: '15:45' },
            { name: 'Maghrib (مغرب)', time: '18:30' },
            { name: 'Isha (عشاء)', time: '20:00' }
        ],
        makkah: [
            { name: 'Fajr (فجر)', time: '04:45' },
            { name: 'Dhuhr (ظهر)', time: '12:15' },
            { name: 'Asr (عصر)', time: '15:30' },
            { name: 'Maghrib (مغرب)', time: '18:15' },
            { name: 'Isha (عشاء)', time: '19:45' }
        ],
        dubai: [
            { name: 'Fajr (فجر)', time: '04:30' },
            { name: 'Dhuhr (ظهر)', time: '12:00' },
            { name: 'Asr (عصر)', time: '15:15' },
            { name: 'Maghrib (مغرب)', time: '18:00' },
            { name: 'Isha (عشاء)', time: '19:30' }
        ]
    };

    // Update Prayer Times
    window.updatePrayerTimes = () => {
        const city = document.getElementById('city-select')?.value || 'karachi';
        const prayerTable = document.getElementById('prayer-table');
        if (prayerTable) {
            prayerTable.innerHTML = '';
            prayerTimes[city].forEach(prayer => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${prayer.name}</td><td>${prayer.time}</td>`;
                prayerTable.appendChild(row);
            });
            updateCountdown(city);
        }
    };

    // Prayer Widget and Countdown
    const updatePrayerWidget = () => {
        const now = new Date();
        const times = prayerTimes.karachi; // Default city
        let nextPrayer = null;
        for (let prayer of times) {
            const [hours, minutes] = prayer.time.split(':').map(Number);
            const prayerTime = new Date(now);
            prayerTime.setHours(hours, minutes, 0, 0);
            if (prayerTime > now) {
                nextPrayer = prayer;
                break;
            }
        }
        if (!nextPrayer) nextPrayer = times[0]; // Next day's Fajr
        const widget = document.getElementById('prayer-widget-time');
        if (widget) {
            widget.textContent = `Next: ${nextPrayer.name} at ${nextPrayer.time}`;
        }
    };

    const updateCountdown = (city) => {
        const now = new Date();
        const times = prayerTimes[city];
        let nextPrayer = null;
        let nextTime = null;
        for (let prayer of times) {
            const [hours, minutes] = prayer.time.split(':').map(Number);
            const prayerTime = new Date(now);
            prayerTime.setHours(hours, minutes, 0, 0);
            if (prayerTime > now) {
                nextPrayer = prayer.name;
                nextTime = prayerTime;
                break;
            }
        }
        if (!nextPrayer) {
            nextPrayer = times[0].name;
            nextTime = new Date(now);
            nextTime.setDate(now.getDate() + 1);
            nextTime.setHours(times[0].time.split(':')[0], times[0].time.split(':')[1], 0, 0);
        }
        const countdown = document.getElementById('prayer-countdown');
        if (countdown) {
            const diff = nextTime - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            countdown.textContent = `Next: ${nextPrayer} in ${hours}h ${minutes}m ${seconds}s`;
        }
    };

    if (document.getElementById('prayer-table')) {
        updatePrayerTimes();
        setInterval(updateCountdown, 1000, document.getElementById('city-select')?.value || 'karachi');
    }

    if (document.getElementById('prayer-widget-time')) {
        updatePrayerWidget();
        setInterval(updatePrayerWidget, 60000);
    }
});