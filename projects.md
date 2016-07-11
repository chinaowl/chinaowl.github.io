---
layout: default
title: Projects
permalink: /projects/
projects:
  - title: Best Books
    url: http://best-books.herokuapp.com
    github: https://github.com/chinaowl/best-books
    summary: My first React app.
  - title: Next Caltrain
    url: http://next-caltrain.herokuapp.com/
    github: https://github.com/chinaowl/next-caltrain
    summary: Work in progress.
  - title: Five Letters
    url: http://five-letters.herokuapp.com/
    github: https://github.com/chinaowl/word-game
    summary: Work in progress.
  - title: Timestamper
    url: https://chinaowl-timestamper.firebaseapp.com/
    github: https://github.com/chinaowl/timestamper
    summary: A simple Angular app created to help the innovation team at a large clothing retailer perform in-store research.
---


{% for project in page.projects %}
  <div class="project">
    <div class="project__header">
      <a class="project__title" href="{{ project.url }}" target="_blank">
        <h2>{{ project.title }}</h2>
      </a>
      <a href="{{ project.github }}" target="_blank"><span class="project__github"></span></a>
    </div>
    <p class="project__summary">
      {{ project.summary }}
    </p>
  </div>
{% endfor %}
