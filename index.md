---
layout: layouts/base
eleventyNavigation:
  key: Home
  order: 1
---

# Últimos

{% if collections.posts.length > 0 %}
<ul>
{% for post in collections.posts | head(3) %}
<li><em>{{ post.date | readableDate("dd 'de' LLL") }}</em> <a href="{{ post.url }}#main">{{ post.data.title }}</a></li>
{% endfor %}
</ul>
{% else %}
No posts found. 
{% endif %}

[Veja Mais](/blog)
|||||||||||||||||||||||||||||||||||||||||
