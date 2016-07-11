---
layout: default
title: Writing
permalink: /writing/
---

{% for post in site.posts %}
  <div class="post-list__item">
    <a class="post-list__link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
    <span class="post-list__date">{{ post.date | date: site.date_format }}</span>
  </div>
{% endfor %}
