---
layout: default
title: Projects
permalink: /projects/
projects:
  - title: Best Books
  - url: http://best-books.herokuapp.com
  - summary: My first React app.
---

<div class="">
  {% for project in page.projects %}
    <div class="">
      <a href="{{ project.url }}" target="_blank" class="">
        <h3 class="">{{ project.title }}</h3>
      </a>
      <p class="">
        {{ project.summary }}
      </p>
    </div>
  {% endfor %}
</div>
