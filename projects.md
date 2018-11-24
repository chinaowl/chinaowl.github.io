---
layout: default
title: Projects
permalink: /projects/
projects:
  - title: Next Caltrain
    url: http://next-caltrain.herokuapp.com/
    github: https://github.com/chinaowl/next-caltrain
    summary: A simple web app that tells you the next Caltrain you can take, based on your origin and destination stations and the current time. I used Knockout on the client-side and Node and Postgres on the server-side. Hosted on Heroku.
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
