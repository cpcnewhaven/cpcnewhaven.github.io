(() => {
  const courses = [
    ['wonders-of-communal-worship.html', 'The Wonders of Communal Worship'],
    ['emotions-spirituality.html', 'Emotions & Spirituality'],
    ['mission-study.html', 'Mission Study'],
    ['walking-through-sinai.html', 'Walking With Jesus Through Sinai'],
    ['what-we-believe.html', 'What We Believe'],
    ['confessional-theology.html', 'Confessional Theology'],
    ['biblical-interpretation.html', 'Biblical Interpretation'],
    ['total-christ.html', 'Total Christ']
  ];
  const courseDetails = {
    'wonders-of-communal-worship.html': {
      title: 'The Wonders of Communal Worship',
      image: 'https://storage.googleapis.com/cpc-public-website/adult-studies/fall2026/THE%20WONDERS%20OF%20COMMUNAL%20WORSHIP.jpg',
      description: 'A six-week study of the God-centered worship Christ gives to his church, shaped by his Word and shared by his people.',
      calendar: 'Fall 2026', time: 'Sundays · 9:30am', location: 'CPC New Haven'
    },
    'emotions-spirituality.html': {
      title: 'Emotions & Spirituality', image: '/assets/web-assets/emotions-class.png',
      description: 'A four-week class exploring the connection between our faith and our feelings.',
      calendar: 'April 26–May 17, 2026', time: 'Sundays · 9:30am', location: 'Fellowship Hall'
    },
    'mission-study.html': {
      title: 'Living Missionally in our Neighborhoods', image: '/assets/podcast-thumbnails/CPC%20CLASSES.jpg',
      description: 'A four-week study of mission, hospitality, presence, and gospel witness in New Haven.',
      calendar: 'March 15–April 19, 2026', time: 'Sundays · 9:30am', location: 'Fellowship Hall'
    },
    'walking-through-sinai.html': {
      title: 'Walking with Jesus Through Sinai', image: '/assets/podcast-thumbnails/CPC%20CLASSES.jpg',
      description: 'Seeking moral clarity in an age of chaos through the Ten Commandments.',
      calendar: 'Course archive', time: 'Adult Sunday Studies', location: 'CPC New Haven'
    },
    'what-we-believe.html': {
      title: 'What We Believe', image: '/assets/podcast-thumbnails/wwb.jpg',
      description: 'A comprehensive exploration of Christian doctrine and Reformed theology.',
      calendar: 'Course archive', time: 'Adult Sunday Studies', location: 'CPC New Haven'
    },
    'confessional-theology.html': {
      title: 'Confessional Theology', image: 'https://files.cpcnewhaven.org/podcast-thumbnails/confessional-theology.png',
      description: 'A course in forming a holistic Christian worldview through Scripture and the Westminster Confession of Faith.',
      calendar: 'Course archive', time: 'Adult Sunday Studies', location: 'CPC New Haven'
    },
    'biblical-interpretation.html': {
      title: 'Biblical Interpretation', image: '/assets/podcast-thumbnails/CPC%20CLASSES.jpg',
      description: 'A course on the reliability, sufficiency, and faithful interpretation of Scripture.',
      calendar: 'Course archive', time: 'Adult Sunday Studies', location: 'CPC New Haven'
    },
    'total-christ.html': {
      title: 'Total Christ', image: '/static/img/total_Christ_Graphic.jpg',
      description: 'An exploration of the comprehensive work of Christ in salvation and the life of his church.',
      calendar: 'Fall 2025', time: 'Adult Sunday Studies', location: 'CPC New Haven'
    }
  };

  const currentCourse = window.location.pathname.split('/').pop();
  const sidebar = document.querySelector('.adult-studies-page .sidebar.fixed-sidebar');
  const mainContent = document.querySelector('.adult-studies-page .main-content');
  const dashboard = document.querySelector('.adult-studies-page .dashboard-container');
  const course = courseDetails[currentCourse];

  if (sidebar) {
    sidebar.querySelectorAll('ul, hr').forEach((element) => element.remove());

    const library = document.createElement('nav');
    library.className = 'study-library';
    library.setAttribute('aria-label', 'Adult Sunday Studies course library');
    const list = document.createElement('ul');

    courses.forEach(([path, title]) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `/sunday-studies/${path}`;
      link.textContent = title;

      if (path === currentCourse) {
        link.setAttribute('aria-current', 'page');
      }

      item.append(link);
      list.append(item);
    });

    library.append(list);
    sidebar.append(library);
  }

  document.querySelectorAll('.adult-studies-page .list-table a').forEach((link) => {
    const style = link.getAttribute('style') || '';
    const isPlaceholder = link.href.includes('/your-episode-link-') || link.getAttribute('href') === '#';

    if (style.includes('pointer-events: none') || isPlaceholder) {
      const unavailable = document.createElement('span');
      unavailable.className = 'session-action session-action--unavailable';
      unavailable.textContent = 'Recording unavailable';
      link.replaceWith(unavailable);
    }
  });

  document.querySelectorAll('.adult-studies-page .list-table li').forEach((row) => {
    const actions = [...row.children].filter((element) =>
      element.matches('a, .session-action, .button-container')
    );

    if (!actions.length) return;

    const actionGroup = document.createElement('div');
    actionGroup.className = 'session-actions';

    actions.forEach((action) => {
      if (action.classList.contains('button-container')) {
        [...action.children].forEach((button) => actionGroup.append(button));
        action.remove();
      } else {
        actionGroup.append(action);
      }
    });

    [...row.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '-') {
        node.remove();
      }
    });

    row.classList.add('session-row');
    row.append(actionGroup);
  });

  const actionFor = (source, className) => {
    const action = document.createElement(source.tagName === 'A' ? 'a' : 'span');
    action.className = source.classList.contains('btn-disabled') || source.classList.contains('session-action--unavailable')
      ? `${className} session-table-action--unavailable`
      : className;
    action.textContent = source.textContent.trim();
    if (source.tagName === 'A') {
      action.href = source.href;
      action.target = source.target || '_blank';
      action.rel = 'noopener';
    }
    return action;
  };

  const sessionRows = [];
  const generalResources = [...document.querySelectorAll('.adult-studies-page a')].filter((link) =>
    !link.closest('.list-table, .episode-table, .episode-card') &&
    !link.getAttribute('href')?.startsWith('#') &&
    (/handout|curriculum|schedule/i.test(link.textContent) || /\/handouts\//i.test(link.href))
  );
  document.querySelectorAll('.adult-studies-page .list-table li').forEach((row) => {
    const title = row.querySelector('.episode-title')?.textContent.trim();
    const number = row.querySelector('.list-number')?.textContent.trim();
    if (!title) return;
    const actions = [...row.querySelectorAll('a, .session-action')];
    sessionRows.push({ number, title, actions });
  });
  document.querySelectorAll('.adult-studies-page .episode-table tbody tr').forEach((row, index) => {
    const cells = [...row.querySelectorAll('td')];
    if (cells.length < 2) return;
    sessionRows.push({
      number: cells[0].textContent.trim() || `${index + 1}`,
      title: cells[1].textContent.trim(),
      date: cells[2]?.textContent.trim(),
      actions: [...row.querySelectorAll('a, .episode-coming')]
    });
  });
  document.querySelectorAll('.adult-studies-page .episode-card').forEach((card, index) => {
    sessionRows.push({
      number: card.querySelector('.episode-badge')?.textContent.trim() || `${index + 1}`,
      title: card.querySelector('h3')?.textContent.trim(),
      date: card.querySelector('.episode-date')?.textContent.trim(),
      actions: [...card.querySelectorAll('a, .btn-disabled')]
    });
  });
  if (generalResources.length) {
    sessionRows.push({ number: '—', title: 'Course materials', actions: generalResources });
  }

  if (course && mainContent && sessionRows.length) {
    document.body.classList.add('course-shell-ready');
    const overview = document.createElement('section');
    overview.className = 'course-overview';
    overview.innerHTML = `
      <div class="course-overview__image"><img src="${course.image}" alt="${course.title}"></div>
      <div class="course-overview__content">
        <p class="study-library-label">Adult Sunday Studies</p>
        <h1>${course.title}</h1>
        <p class="course-overview__description">${course.description}</p>
        <div class="course-calendar" aria-label="Course details">
          <div><i class="far fa-calendar-alt" aria-hidden="true"></i><span><strong>Calendar</strong>${course.calendar}</span></div>
          <div><i class="far fa-clock" aria-hidden="true"></i><span><strong>Time</strong>${course.time}</span></div>
          <div><i class="fas fa-map-marker-alt" aria-hidden="true"></i><span><strong>Location</strong>${course.location}</span></div>
        </div>
      </div>`;

    const sessions = document.createElement('section');
    sessions.className = 'course-sessions';
    sessions.innerHTML = `<h2>Class sessions</h2><div class="course-sessions__table-wrap"><table><thead><tr><th>Session</th><th>Topic</th><th>Date</th><th>Listen</th><th>Handouts & resources</th></tr></thead><tbody></tbody></table></div>`;
    const body = sessions.querySelector('tbody');
    sessionRows.forEach((session, index) => {
      const row = document.createElement('tr');
      const number = document.createElement('td'); number.textContent = session.number || `${index + 1}`;
      const title = document.createElement('td'); title.textContent = session.title || 'Untitled session';
      const date = document.createElement('td'); date.textContent = session.date || '—';
      const listen = document.createElement('td');
      const resources = document.createElement('td');
      session.actions.forEach((action) => {
        const isListen = action.classList.contains('episode-coming') || /listen|spotify|recording/i.test(action.textContent);
        (isListen ? listen : resources).append(actionFor(action, isListen ? 'session-table-action session-table-action--listen' : 'session-table-action'));
      });
      if (!listen.children.length) listen.textContent = '—';
      if (!resources.children.length) resources.textContent = '—';
      row.append(number, title, date, listen, resources);
      body.append(row);
    });

    mainContent.prepend(sessions);
    mainContent.prepend(overview);
    document.querySelectorAll('.list-table, .episode-table, .episodes-section, .handouts-section, .course-roadmap').forEach((element) => element.hidden = true);
  }

  if (mainContent && mainContent.tagName !== 'MAIN') {
    mainContent.setAttribute('role', 'main');
  }

  if (mainContent && !mainContent.querySelector('.styled-section-a')) {
    const newsletter = document.createElement('section');
    newsletter.className = 'styled-section-a study-newsletter';
    newsletter.setAttribute('aria-labelledby', 'study-newsletter-title');
    newsletter.innerHTML = `
      <div class="form-container">
        <h2 id="study-newsletter-title">Subscribe to our Newsletter</h2>
        <p>Our weekly newsletter shares Sunday service information, highlights, upcoming events, and useful links.</p>
        <form action="https://formspree.io/f/meojowwg" method="POST" class="neumorphic-form">
          <input type="text" name="name" placeholder="Your name" required>
          <input type="email" name="email" placeholder="Your email" required>
          <button type="submit">Subscribe to CPC New Haven</button>
        </form>
      </div>`;
    mainContent.append(newsletter);
  }

  const footer = mainContent?.querySelector(':scope > footer');
  if (footer && dashboard) {
    dashboard.insertAdjacentElement('afterend', footer);
  }
})();
