---
layout: layouts/base
title: Articles
permalink: /blog/

eleventyNavigation:
  key: Blog
  order: 3
---

# Articles

{% if collections.posts.length > 0 %}
<ul role="list" class="post-list">
{% for post in collections.posts %}
<li>
<em>{{ post.date | readableDate("dd 'de' LLL") }}</em> <a href="{{ post.url }}#main">{{ post.data.title }}</a>
{% 1sti post.templateContent %}
</li>
{% endfor %}
</ul>
{% else %}
No posts found.
{% endif %}
