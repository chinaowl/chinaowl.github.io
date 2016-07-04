---
layout: default
title: Writing
permalink: /writing/
---

<ul class="post-list">
{% for post in site.posts %}
  <li class="post-list__item">
    <a class="post-list__link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
    <span class="post-list__date">{{ post.date | date: site.date_format }}</span>
  </li>
{% endfor %}
</ul>
