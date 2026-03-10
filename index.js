        // API Base URL — points to our Node.js Express server
        const API_BASE = 'http://localhost:3000/api';

        const MOVIES = [
            { title: 'DARK WATERS', color: 'teal', emoji: '🌊', year: '2025', runtime: '2h 14m', rating: '16+', genre: 'Thriller', type: 'Original', desc: 'A marine biologist uncovers a chilling conspiracy beneath the ocean\'s surface — where silence is law and the truth is buried deep. Critically acclaimed and visually stunning.', cast: 'Starring: <span>Sofia Esposito, Marcus Webb, Yuna Tanaka</span> · Directed by: <span>Ari Malone</span>', tags: ['t-y:ORIGINAL', 't-t:THRILLER', 't-o:4K'] },
            { title: 'ECLIPSE', color: 'purple', emoji: '🌑', year: '2025', runtime: '1h 58m', rating: '15+', genre: 'Sci-Fi', type: 'Original', desc: 'A physicist discovers the sun is dimming — but the cause is anything but natural. Racing against eternal night, she must trust the very forces she once feared.', cast: 'Starring: <span>Diane Okafor, Liam Cross</span> · Directed by: <span>Mila Renn</span>', tags: ['t-y:ORIGINAL', 't-o:SCI-FI', 't-o:4K'] },
            { title: 'NEON SAINTS', color: 'red', emoji: '🔫', year: '2025', runtime: '2h 02m', rating: '18+', genre: 'Action', type: 'Movie', desc: 'A retired assassin is pulled back into the shadows when her daughter is kidnapped by a global syndicate. One night. One city. One last job.', cast: 'Starring: <span>Valentina Cruz, Ji-Ho Kim</span> · Directed by: <span>Desmond Ray</span>', tags: ['t-r:ACTION', 't-o:HD'] },
            { title: 'HOLLOW CROWN', color: 'amber', emoji: '👑', year: '2025', runtime: '1h 45m', rating: '12+', genre: 'Drama', type: 'Movie', desc: 'The rise and fall of a tech dynasty told across three generations. Power, betrayal, and the impossible cost of legacy.', cast: 'Starring: <span>Robert Aiken, Claire Fontaine</span>', tags: ['t-o:DRAMA', 't-o:HD'] },
            { title: 'FREQUENCY', color: 'blue', emoji: '📡', year: '2024', runtime: '1h 52m', rating: '12+', genre: 'Mystery', type: 'Series', desc: 'A radio operator in rural Iceland starts receiving transmissions from a future that hasn\'t happened yet. Are the voices warning her — or manipulating her?', cast: 'Starring: <span>Sigrid Bjornsdottir, Ethan Blake</span>', tags: ['t-o:MYSTERY', 't-o:HD'] },
            { title: 'BONE GARDEN', color: 'green', emoji: '🦴', year: '2025', runtime: '1h 34m', rating: '16+', genre: 'Horror', type: 'Movie', desc: 'An isolated greenhouse on an abandoned estate holds unspeakable secrets. The plants are growing — and so is the body count.', cast: 'Starring: <span>Mia Torres, Dev Anand Jr.</span>', tags: ['t-r:HORROR', 't-o:HD'] },
            { title: 'VELOCITY', color: 'amber', emoji: '🏎️', year: '2025', runtime: '2h 08m', rating: '12+', genre: 'Action', type: 'Movie', desc: 'The fastest street racer in Asia must outrun both the law and a cartel in an illegal cross-continent race for a stolen formula.', cast: 'Starring: <span>Leon Park, Naomi Castillo</span>', tags: ['t-r:ACTION', 't-o:4K'] },
            { title: 'THE QUIET HOUR', color: 'purple', emoji: '🌙', year: '2024', runtime: '1h 40m', rating: '15+', genre: 'Drama', type: 'Original', desc: 'In a near-future city where silence is mandated from midnight to dawn, two strangers meet during the forbidden hours and fall dangerously in love.', cast: 'Starring: <span>Ada Mensah, Ryo Yamamoto</span>', tags: ['t-y:ORIGINAL', 't-o:HD'] },
            { title: 'IRONCLAD', color: 'teal', emoji: '⚓', year: '2025', runtime: '2h 22m', rating: '15+', genre: 'War', type: 'Movie', desc: 'The true untold story of the last naval battle in the war that reshaped the modern world. Seven crew. One ship. No way home.', cast: 'Starring: <span>Samuel Okoro, Franz Meyer</span>', tags: ['t-o:WAR', 't-o:4K'] },
            { title: 'GHOST SIGNAL', color: 'blue', emoji: '👻', year: '2025', runtime: '1h 48m', rating: '16+', genre: 'Thriller', type: 'Original', desc: 'Deep in the digital grid, an AI starts dreaming. And those dreams are becoming everyone else\'s nightmares.', cast: 'Starring: <span>Kenji Mori, Isabel Reyes</span>', tags: ['t-y:ORIGINAL', 't-o:SCI-FI'] },
            // NEW ADDITIONS
            { title: 'YODDHA', color: 'red', emoji: '⚔️', year: '2026', runtime: '2h 35m', rating: '15+', genre: 'Action', type: 'Movie', desc: 'In a land torn by ancient feuds, a lone warrior emerges to unite the kingdom against an impending empire. A spectacular Bollywood epic.', cast: 'Starring: <span>Arjun Kapoor, Priya Sen</span>', tags: ['t-r:ACTION', 't-o:BOLLYWOOD', 't-o:4K'] },
            { title: 'PYAAR IMPOSSIBLE', color: 'pink', emoji: '💖', year: '2025', runtime: '2h 10m', rating: 'PG', genre: 'Romance', type: 'Movie', desc: 'Two complete opposites are forced to plan a big fat Indian wedding together. Will sparks fly, or will the wedding be a disaster?', cast: 'Starring: <span>Rohan Malhotra, Tara Singh</span>', tags: ['t-o:ROMANCE', 't-o:BOLLYWOOD'] },
            { title: 'RAHASYA', color: 'black', emoji: '👁️', year: '2025', runtime: '1h 55m', rating: '18+', genre: 'Thriller', type: 'Movie', desc: 'A haunted mansion. A missing heir. And a detective who realizes some secrets are better left buried. A gripping psychological thriller.', cast: 'Starring: <span>Dev Verma, Anjali Desai</span>', tags: ['t-t:THRILLER', 't-o:BOLLYWOOD', 't-o:HD'] },
            { title: 'AVALON PRIME', color: 'cyan', emoji: '🛸', year: '2026', runtime: '2h 20m', rating: '12+', genre: 'Sci-Fi', type: 'Movie', desc: 'When an alien mega-structure is discovered at the edge of the solar system, a team of astronauts must unlock its secrets before it activates.', cast: 'Starring: <span>Evelyn Cross, David Vance</span>', tags: ['t-o:SCI-FI', 't-o:HOLLYWOOD', 't-o:4K'] },
            { title: 'VENDETTA RUN', color: 'amber', emoji: '🏎️', year: '2025', runtime: '1h 50m', rating: '18+', genre: 'Action', type: 'Movie', desc: 'A former getaway driver is pulled back into the underworld for one final, high-octane heist across neon-lit streets.', cast: 'Starring: <span>Jack Stone, Maria Ortiz</span>', tags: ['t-r:ACTION', 't-o:HOLLYWOOD', 't-y:DOLBY'] },
            { title: 'ECHOES', color: 'green', emoji: '🏚️', year: '2025', runtime: '1h 40m', rating: '18+', genre: 'Horror', type: 'Movie', desc: 'A remote cabin in the woods holds a dark history that refuses to stay dead. A terrifying new vision in modern horror.', cast: 'Starring: <span>Sarah Jenkins, Tom Hardy Jr.</span>', tags: ['t-t:HORROR', 't-o:HOLLYWOOD', 't-o:HD'] }
        ];

        const CW = [
            { title: 'ECLIPSE', color: 'purple', emoji: '🌑', progress: 68, left: '42 min left' },
            { title: 'NEON SAINTS', color: 'red', emoji: '🔫', progress: 35, left: '1h 19m left' },
            { title: 'FREQUENCY S2', color: 'blue', emoji: '📡', progress: 90, left: '11 min left' },
            { title: 'THE QUIET HOUR', color: 'purple', emoji: '🌙', progress: 15, left: '1h 24m left' },
            { title: 'BONE GARDEN', color: 'green', emoji: '🦴', progress: 52, left: '47 min left' },
        ];

        const CATS = [
            { emoji: '💥', label: 'Action', count: '342 titles' }, { emoji: '😱', label: 'Horror', count: '218 titles' },
            { emoji: '🚀', label: 'Sci-Fi', count: '195 titles' }, { emoji: '😂', label: 'Comedy', count: '410 titles' },
            { emoji: '❤️', label: 'Romance', count: '287 titles' }, { emoji: '🔍', label: 'Mystery', count: '163 titles' },
            { emoji: '🎌', label: 'Anime', count: '520 titles' }, { emoji: '🎬', label: 'Drama', count: '634 titles' },
            { emoji: '📹', label: 'Docs', count: '311 titles' }, { emoji: '🏆', label: 'Sport', count: '95 titles' },
            { emoji: '👶', label: 'Kids', count: '248 titles' }, { emoji: '🌍', label: 'World', count: '392 titles' },
        ];

        const BG = {
            amber: 'linear-gradient(135deg,#1a1200,#3d2a00)',
            teal: 'linear-gradient(135deg,#001a15,#003d2e)',
            red: 'linear-gradient(135deg,#1a0000,#3d0000)',
            blue: 'linear-gradient(135deg,#00051a,#00103d)',
            purple: 'linear-gradient(135deg,#0d0018,#1e003d)',
            green: 'linear-gradient(135deg,#001a05,#003d10)',
        };

        function makeThumb(color, emoji) {
            const d = document.createElement('div');
            d.className = `card-thumb c-${color}`;
            const e = document.createElement('span');
            e.className = 'card-emoji'; e.textContent = emoji;
            d.appendChild(e);
            return d;
        }

        function makeCard(movie) {
            const el = document.createElement('div');
            el.className = 'card';
            el.appendChild(makeThumb(movie.color, movie.emoji));
            const info = document.createElement('div'); info.className = 'card-info';
            info.innerHTML = `<div class="card-title">${movie.title}</div><div class="card-sub">${movie.year} · ${movie.genre}</div>`;
            el.appendChild(info);
            const ov = document.createElement('div'); ov.className = 'card-overlay';
            const tags = (movie.tags || []).map(t => { const [c, l] = t.split(':'); return `<span class="tag ${c}">${l}</span>`; }).join('');
            ov.innerHTML = `<div class="card-tags">${tags}</div><div class="card-title" style="font-size:.78rem">${movie.title}</div><div class="card-sub">${movie.runtime || ''} · ${movie.rating || ''}</div>`;
            el.appendChild(ov);
            const pb = document.createElement('button'); pb.className = 'card-play-btn';
            pb.innerHTML = `<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>`;
            pb.addEventListener('click', e => { e.stopPropagation(); showToast(`▶ Playing ${movie.title}`); });
            el.appendChild(pb);
            el.addEventListener('click', () => openModal(movie));
            return el;
        }

        function makeCWCard(s) {
            const el = document.createElement('div'); el.className = 'cw-card';
            el.appendChild(makeThumb(s.color, s.emoji));
            const info = document.createElement('div'); info.className = 'card-info';
            info.innerHTML = `<div class="card-title">${s.title}</div>`;
            el.appendChild(info);
            el.innerHTML += `<div class="cw-bar"><div class="cw-fill" style="width:${s.progress}%"></div></div><div class="cw-label">${s.left}</div>`;
            el.addEventListener('click', () => showToast(`▶ Resuming ${s.title}`));
            return el;
        }

        function makeTop10(movie, i) {
            const el = document.createElement('div'); el.className = 'top10-item';
            const num = document.createElement('span'); num.className = 'top10-num'; num.textContent = i + 1;
            const inner = document.createElement('div'); inner.className = 'top10-inner';
            inner.appendChild(makeThumb(movie.color, movie.emoji));
            el.appendChild(num); el.appendChild(inner);
            el.addEventListener('click', () => openModal(movie));
            return el;
        }

        let currentCategory = 'Home';
        let carouselInterval;

        function startHeroCarousel() {
            if (carouselInterval) clearInterval(carouselInterval);
            const heroMovies = [MOVIES[0], MOVIES[2], MOVIES[4], MOVIES[7], MOVIES[9]]; // Pick a few varied features
            let currentIndex = 1; // Start from 2nd, since 1st is static HTML default

            function updateHero() {
                const m = heroMovies[currentIndex];
                const hBadge = document.getElementById('heroBadge');
                if (hBadge) hBadge.textContent = m.type === 'Original' ? '🦆 Duckshow Original' : '🦆 Featured ' + m.type;

                const hTitle = document.getElementById('heroMainTitle');
                if (hTitle) {
                    const parts = m.title.split(' ');
                    if (parts.length > 1) {
                        hTitle.innerHTML = parts.slice(0, Math.ceil(parts.length/2)).join(' ') + '<br><span>' + parts.slice(Math.ceil(parts.length/2)).join(' ') + '</span>';
                    } else {
                        hTitle.innerHTML = m.title + '<br><span></span>';
                    }
                }

                const hMeta = document.getElementById('heroMeta');
                if (hMeta) hMeta.innerHTML = `<span class="rating">${m.rating || '13+'}</span><span class="dot">●</span><span>${m.year}</span><span class="dot">●</span><span>${m.runtime || '1h 30m'}</span><span class="dot">●</span><span>${m.genre}</span>`;

                const hDesc = document.getElementById('heroDesc');
                if (hDesc) hDesc.textContent = m.desc;

                const hBgBase = document.getElementById('heroBgBase');
                if (hBgBase && BG[m.color]) {
                    hBgBase.style.background = BG[m.color];
                }

                const hPlayBtn = document.getElementById('heroPlayBtn');
                if (hPlayBtn) {
                    hPlayBtn.onclick = () => playVideo(m.title);
                }

                const hInfoBtn = document.getElementById('heroInfoBtn');
                if (hInfoBtn) {
                    hInfoBtn.onclick = () => openModal(m);
                }

                currentIndex = (currentIndex + 1) % heroMovies.length;
            }

            carouselInterval = setInterval(updateHero, 3000);
        }

        function stopHeroCarousel() {
            if (carouselInterval) clearInterval(carouselInterval);
        }

        function populate(category = 'Home') {
            currentCategory = category;

            // Update Header/Hero UI
            const heroSection = document.getElementById('heroSection');
            const categoryHeader = document.getElementById('categoryHeader');
            const categoryTitle = document.getElementById('categoryTitle');
            const promoCard = document.getElementById('promoCard');
            const genreCategories = document.getElementById('genreCategories');

            if (category === 'Home') {
                if(heroSection) heroSection.style.display = 'flex';
                if(categoryHeader) categoryHeader.style.display = 'none';
                if(promoCard) promoCard.style.display = 'flex';
                if(genreCategories) genreCategories.style.display = 'block';
                startHeroCarousel();
                
                // Ensure initial hero play button works
                const hPlayBtn = document.getElementById('heroPlayBtn');
                if (hPlayBtn) {
                     hPlayBtn.onclick = () => playVideo('DARK WATERS');
                }
            } else {
                if(heroSection) heroSection.style.display = 'none';
                if(categoryHeader) categoryHeader.style.display = 'block';
                if(categoryTitle) categoryTitle.textContent = category.toUpperCase();
                if(promoCard) promoCard.style.display = 'none';
                if(genreCategories) genreCategories.style.display = 'none';
                stopHeroCarousel();
            }

            // Clear existing rows
            const cw = document.getElementById('cwRow');
            if(cw) cw.innerHTML = '';
            const tr = document.getElementById('trendingRow');
            if(tr) tr.innerHTML = '';
            const or = document.getElementById('originalsRow');
            if(or) or.innerHTML = '';
            const nr = document.getElementById('newRow');
            if(nr) nr.innerHTML = '';
            const t10 = document.getElementById('top10Row');
            if(t10) t10.innerHTML = '';

            // Filter Movies Array
            let filteredMovies = MOVIES;
            
            if (category === 'Movies') {
                filteredMovies = MOVIES.filter(m => m.type === 'Movie');
            } else if (category === 'Series') {
                filteredMovies = MOVIES.filter(m => m.type === 'Series');
            } else if (category === 'Anime') {
                // Assuming any movie could have the genre anime, mock it for now since none are explicitly 'anime'
                filteredMovies = MOVIES; // Will show all items for now, you can add explicit types later
            } else if (category === 'Documentaries') {
                filteredMovies = MOVIES.filter(m => m.genre === 'Documentary');
            } else if (category === 'New & Hot') {
                filteredMovies = [...MOVIES].reverse();
            } else if (category === 'My List') {
                // Read from localStorage
                let mylist = [];
                try {
                    mylist = JSON.parse(localStorage.getItem('duckshow_mylist') || '[]');
                } catch(e) {}
                filteredMovies = MOVIES.filter(m => mylist.includes(m.title));
            }

            // Populate Continue Watching (only on Home or if relevant)
            if (category === 'Home') {
                if(cw) { cw.parentElement.style.display = 'block'; CW.forEach(s => cw.appendChild(makeCWCard(s))); }
            } else {
                if(cw) cw.parentElement.style.display = 'none';
            }

            // Populate Trending
            if(tr) {
                filteredMovies.forEach(m => tr.appendChild(makeCard(m)));
                if (filteredMovies.length === 0) tr.innerHTML = '<div style="padding: 20px; color: var(--muted); font-family: monospace;">No titles found in this category.</div>';
            }

            // Populate Originals
            const originals = filteredMovies.filter(m => m.type === 'Original');
            if (category === 'Home' || originals.length > 0) {
                if(or) {
                    if(originals.length === 0 && category !== 'Home') {
                        or.parentElement.style.display = 'none';
                    } else {
                        or.parentElement.style.display = 'block';
                        originals.forEach(m => or.appendChild(makeCard(m)));
                        if(originals.length === 0 && category === 'Home') {
                           MOVIES.filter(m => m.type !== 'Original').slice(0, 4).forEach(m => or.appendChild(makeCard(m)));
                        }
                    }
                }
            } else {
                if(or) or.parentElement.style.display = 'none';
            }

            // Populate New Releases
            const newReleases = [...filteredMovies].reverse();
            if(nr) newReleases.forEach(m => nr.appendChild(makeCard(m)));

            // Populate Top 10
            if (category === 'Home') {
                if(t10) { t10.parentElement.style.display = 'block'; filteredMovies.forEach((m, i) => t10.appendChild(makeTop10(m, i))); }
            } else {
                if(t10) t10.parentElement.style.display = 'none';
            }

            // Category Grid Init (Run once)
            const cg = document.getElementById('catsGrid');
            if (cg && cg.innerHTML === '') {
                CATS.forEach(c => {
                    const el = document.createElement('a'); el.href = '#'; el.className = 'cat-pill';
                    el.innerHTML = `<span class="cat-emoji">${c.emoji}</span><span class="cat-label">${c.label}</span><span class="cat-count">${c.count}</span>`;
                    el.addEventListener('click', e => { 
                        e.preventDefault(); 
                        showToast(`Browsing ${c.label}`); 
                        // Open Search Overlay and trigger search for this genre
                        const searchOverlay = document.getElementById('searchOverlay');
                        const searchInput = document.getElementById('searchInput');
                        if (searchOverlay && searchInput) {
                            searchOverlay.classList.add('open');
                            document.body.style.overflow = 'hidden';
                            searchInput.value = c.label;
                            searchInput.focus();
                            // Dispatch an input event to trigger the live filtering logic automatically
                            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    });
                    cg.appendChild(el);
                });
            }
            
            // Trigger Intersection Observer for newly added elements
            setTimeout(() => {
                document.querySelectorAll('.fade-s:not(.vis)').forEach(el => obs.observe(el));
            }, 100);
        }

        // SPA handlers removed, each HTML page will invoke populate() individually.

        function openModal(movie) {
            document.getElementById('modalBg').style.background = BG[movie.color] || '#141414';
            document.getElementById('modalEmoji').textContent = movie.emoji;
            document.getElementById('modalTitle').textContent = movie.title;
            document.getElementById('modalDesc').textContent = movie.desc;
            document.getElementById('modalCast').innerHTML = movie.cast || '';
            const tags = (movie.tags || []).map(t => { const [c, l] = t.split(':'); return `<span class="tag ${c}">${l}</span>`; }).join('');
            document.getElementById('modalBadges').innerHTML = tags + `<span class="tag t-o">${movie.year}</span><span class="tag t-o">${movie.runtime || '—'}</span>`;
            
            // My List Persistence State
            let mylist = [];
            try { mylist = JSON.parse(localStorage.getItem('duckshow_mylist') || '[]'); } catch(e){}
            const isInList = mylist.includes(movie.title);
            
            const ma = document.getElementById('modalActions');
            const safeTitle = movie.title.replace(/'/g, "\\'");
            ma.innerHTML = `
    <button class="btn-play" style="font-size:.85rem;padding:11px 24px" onclick="playVideo('${safeTitle}')">
      <svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:var(--black)"><polygon points="5,3 19,12 5,21"/></svg>PLAY
    </button>
    <button class="wl-btn ${isInList ? 'added' : ''}" id="wlb">${isInList ? '✓' : '+'}</button>
    <button class="btn-info" onclick="showToast('Liked! 👍')">👍</button>
    <button class="btn-info" onclick="showToast('Got it 👎')">👎</button>
  `;
            document.getElementById('wlb').addEventListener('click', function () {
                this.classList.toggle('added');
                const added = this.classList.contains('added');
                this.textContent = added ? '✓' : '+';
                
                let currentList = [];
                try { currentList = JSON.parse(localStorage.getItem('duckshow_mylist') || '[]'); } catch(e){}
                
                if (added && !currentList.includes(movie.title)) {
                    currentList.push(movie.title);
                } else if (!added) {
                    currentList = currentList.filter(t => t !== movie.title);
                }
                localStorage.setItem('duckshow_mylist', JSON.stringify(currentList));
                
                // Also sync with the Node.js API if server is available
                const userId = localStorage.getItem('duckshow_user_id');
                if (userId) {
                    const apiMethod = added ? 'POST' : 'DELETE';
                    fetch(`${API_BASE}/mylist`, {
                        method: apiMethod,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, movieTitle: movie.title })
                    }).catch(() => {}); // Silently fail if server is not running
                }

                showToast(added ? `Added "${movie.title}" to My List ✓` : `Removed from My List`);
                
                if(currentCategory === 'My List') {
                    populate('My List');
                }
            });
            document.getElementById('modalOverlay').classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        document.getElementById('modalClose').addEventListener('click', closeModal);
        document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target === document.getElementById('modalOverlay')) closeModal(); });
        function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); document.body.style.overflow = ''; }

        document.getElementById('searchBtn').addEventListener('click', () => { document.getElementById('searchOverlay').classList.add('open'); document.getElementById('searchInput').focus(); document.body.style.overflow = 'hidden'; });
        document.getElementById('searchOverlay').addEventListener('click', e => { if (e.target === document.getElementById('searchOverlay')) { document.getElementById('searchOverlay').classList.remove('open'); document.body.style.overflow = ''; } });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') { document.getElementById('searchOverlay').classList.remove('open'); closeModal(); document.body.style.overflow = ''; } });

        // Video Player Modal Injection
        const videoOverlay = document.createElement('div');
        videoOverlay.className = 'modal-overlay';
        videoOverlay.id = 'videoOverlay';
        videoOverlay.style.zIndex = '3000';
        videoOverlay.innerHTML = `
            <div class="modal" style="width: 90%; max-width: 1000px; padding: 0; background: #000; overflow: hidden; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; position: relative;">
                <button class="modal-close" id="videoClose" style="position: absolute; top: 20px; right: 20px; z-index: 3010; background: rgba(0,0,0,0.5); border: none; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 20px;">✕</button>
                <video id="duckVideoPlayer" controls style="width: 100%; height: 100%; object-fit: cover;">
                    <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
                    Your browser does not support HTML5 video.
                </video>
            </div>
        `;
        document.body.appendChild(videoOverlay);

        function playVideo(title) {
            document.getElementById('videoOverlay').classList.add('open');
            const player = document.getElementById('duckVideoPlayer');
            player.play().catch(e => console.log("Autoplay blocked:", e));
            document.body.style.overflow = 'hidden';
            
            // Close details modal if open
            closeModal();
        }

        document.getElementById('videoClose').addEventListener('click', () => {
            document.getElementById('videoOverlay').classList.remove('open');
            document.getElementById('duckVideoPlayer').pause();
            document.body.style.overflow = '';
        });

        // Live Search Filtering
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const resultsContainer = document.getElementById('searchResults');
            resultsContainer.innerHTML = '';
            
            if (term.length < 2) {
                if (term.length === 0) resultsContainer.innerHTML = '<div style="color:var(--muted); text-align:center; padding-top: 2rem;">Start typing to search available movies and shows...</div>';
                return;
            }
            
            const matches = MOVIES.filter(m => 
                m.title.toLowerCase().includes(term) || 
                m.genre.toLowerCase().includes(term) ||
                (m.cast && m.cast.toLowerCase().includes(term))
            );
            
            if (matches.length === 0) {
                resultsContainer.innerHTML = `<div style="color:var(--muted); text-align:center; padding-top: 2rem;">No titles found matching "${term}"</div>`;
                return;
            }
            
            const grid = document.createElement('div');
            grid.className = 'cards-row';
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
            grid.style.gap = '24px';
            grid.style.marginTop = '24px';
            grid.style.padding = '0'; // reset row padding
            
            matches.forEach(m => {
                grid.appendChild(makeCard(m));
            });
            resultsContainer.appendChild(grid);
        });

        function showToast(msg) {
            const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
            clearTimeout(t._to); t._to = setTimeout(() => t.classList.remove('show'), 2600);
        }

        const cursor = document.getElementById('cursor');
        document.addEventListener('mousemove', e => { 
            cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; 
            cursor.style.opacity = '1';
        });
        document.addEventListener('mouseover', e => { if (e.target.closest('a,button,.card,.cw-card,.top10-item,.cat-pill,.nav-avatar,.section-more')) cursor.classList.add('hovered'); else cursor.classList.remove('hovered'); });
        
        // Hide cursor when leaving window and add click animations
        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mousedown', () => cursor.classList.add('clicked'));
        document.addEventListener('mouseup', () => cursor.classList.remove('clicked'));

        window.addEventListener('scroll', () => { document.getElementById('navbar').classList.toggle('scrolled', scrollY > 40); });

        // Expand rows when "View All" is clicked
        setTimeout(() => {
            document.querySelectorAll('.section-more').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Assuming structure: <div class="section-header">...</div> <div class="cards-row">
                    const row = e.target.closest('.section-header').nextElementSibling;
                    if (row && row.classList.contains('cards-row') || row && row.classList.contains('top10-row')) {
                        row.classList.toggle('expanded');
                        e.target.textContent = row.classList.contains('expanded') ? 'View Less' : 'View All';
                    }
                });
            });
        }, 500);

        const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }), { threshold: 0.08 });
        document.querySelectorAll('.fade-s').forEach(el => obs.observe(el));

        function checkAuthState() {
            const isAuth = localStorage.getItem('duckshow_auth');
            const userName = localStorage.getItem('duckshow_user_name');
            const userEmail = localStorage.getItem('duckshow_user_email');
            
            if (isAuth === 'true' && userName) {
                // Update avatar everywhere
                document.querySelectorAll('.nav-avatar').forEach(avatar => {
                    // Get initials (up to 2 characters)
                    const initials = userName.substring(0, 2).toUpperCase();
                    avatar.textContent = initials;
                    
                    // Add a nice greeting tooltip
                    avatar.title = `Logged in as ${userName} (${userEmail})`;
                    
                    // Optional: Change appearance to show active status
                    avatar.style.background = 'linear-gradient(135deg, var(--teal), var(--blue))';
                    avatar.style.color = 'var(--white)';
                    
                    // User Profile Dropdown
                    const dropdown = document.createElement('div');
                    dropdown.className = 'user-dropdown';
                    dropdown.style.cssText = 'display: none; position: absolute; top: calc(100% + 10px); right: 0; background: var(--card2); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); width: 200px; padding: 8px 0; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);';
                    dropdown.innerHTML = `
                        <div style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 8px;">
                            <div style="font-weight: bold; color: var(--white);">${userName}</div>
                            <div style="font-size: 0.8rem; color: var(--muted); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${userEmail}</div>
                        </div>
                        <a href="my-list.html" style="display: block; padding: 8px 16px; color: var(--white); text-decoration: none; font-size: 0.9rem;">My List</a>
                        <a href="settings.html" style="display: block; padding: 8px 16px; color: var(--white); text-decoration: none; font-size: 0.9rem;">Settings</a>
                        <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 8px 0;"></div>
                        <a href="#" class="sign-out-btn" style="display: block; padding: 8px 16px; color: var(--red); text-decoration: none; font-size: 0.9rem;">Sign out of Duckshow</a>
                    `;
                    avatar.parentElement.style.position = 'relative';
                    avatar.parentElement.appendChild(dropdown);

                    avatar.href = '#';
                    avatar.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Hide other dropdowns if necessary, but there's only one.
                        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
                    });

                    document.addEventListener('click', (e) => {
                        if (!dropdown.contains(e.target) && e.target !== avatar && !avatar.contains(e.target)) {
                            dropdown.style.display = 'none';
                        }
                    });

                    dropdown.querySelector('.sign-out-btn').addEventListener('click', (e) => {
                        e.preventDefault();
                        // Clear ALL user-specific keys so next user starts fresh
                        const keysToRemove = [
                            'duckshow_auth', 'duckshow_user_id',
                            'duckshow_user_name', 'duckshow_user_email', 'duckshow_user_age',
                            'duckshow_mylist', 'duckshow_subscription', 'duckshow_billing_date'
                        ];
                        keysToRemove.forEach(k => localStorage.removeItem(k));
                        window.location.replace('/');
                    });
                });
            }
        }

        // Run auth and theme check on load
        applyTheme();
        checkAuthState();
        populate();

        // Theme management logic
        function applyTheme(overrideTheme) {
            let theme = overrideTheme || localStorage.getItem('duckshow_theme') || 'auto';
            
            if (theme === 'auto') {
                const hour = new Date().getHours();
                // Morning (6AM to 11:59AM) -> Light
                if (hour >= 6 && hour < 12) {
                    theme = 'light';
                } 
                // Afternoon (12PM to 5:59PM) -> Special
                else if (hour >= 12 && hour < 18) {
                    theme = 'special';
                } 
                // Night (6PM to 5:59AM) -> Dark
                else {
                    theme = 'dark';
                }
            }
            
            // Apply setting to HTML root tag for CSS overrides
            const root = document.documentElement;
            if (theme === 'dark') {
                root.removeAttribute('data-theme'); // default is dark
            } else {
                root.setAttribute('data-theme', theme);
            }
        }

