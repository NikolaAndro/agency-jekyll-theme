# Treat

Food/baking blog template for Jekyll. Browse through a [live demo](https://spring-bat.cloudvent.net/).

![Treat template screenshot](images/_screenshot.png)

Treat was made by [CloudCannon](http://cloudcannon.com/), the Cloud CMS for Jekyll.

Find more templates, themes and step-by-step Jekyll tutorials at [CloudCannon Academy](https://learn.cloudcannon.com/).

[![Deploy to CloudCannon](https://buttons.cloudcannon.com/deploy.svg)](https://app.cloudcannon.com/register#sites/connect/github/CloudCannon/treat-jekyll-template)

## Features

* Contact form
* Pre-built pages
* Pre-styled components
* Blog with pagination
* Disqus comments for posts
* Configurable sidebar
* Optimised for editing in [CloudCannon](http://cloudcannon.com/)
* RSS/Atom feed
* SEO tags
* Google Analytics

## Setup

1. Add your site and author details in `_config.yml`.
2. Add your Google Analytics, Disqus and MailChimp keys to `_config.yml`.
3. Add your details to `_data/sidebar.yml`
4. Get a workflow going to see your site's output (with [CloudCannon](https://app.cloudcannon.com/) or Jekyll locally).

## Develop

Treat was built with [Jekyll](http://jekyllrb.com/) version 3.4.3, but should support newer versions as well.

Install the dependencies with [Bundler](http://bundler.io/):

~~~bash
$ bundle install
~~~

Run `jekyll` commands through Bundler to ensure you're using the right versions:

~~~bash
$ bundle exec jekyll serve
~~~

## Editing

Treat is already optimised for adding, updating and removing recipes, navigation, page content, and sidebar information in CloudCannon.

### Posts/Recipes

* Add, update or remove a post in the *Posts* collection.
* The recipes page is organised by categories.
* Change the defaults when new posts are created in `_posts/_defaults.md`.

### Contact Form

* Preconfigured to work with CloudCannon, but easily changed to another provider (e.g. [FormSpree](https://formspree.io/)).
* Sends email to the address listed in company details.

### Navigation

* Exposed as a data file to give clients better access.
* Set in the *Data* / *Navigation* section.

### Footer

* Exposed as a data file to give clients better access.
* Set in the *Data* / *Footer* section.

# Ideas for improvement

## Mealplan Generator
- [x] The aggregated macros need to stay below the navbar
- [ ] Breakfast, lunch, dinner, and snacks can be clickable buttons on the side that when clicked will show the foods for that section to be selected
- [ ] When foods are offered, they can be split up into subsections such as fruits, dairy, etc.
- [ ] Export mealplan button that will save the mealplan under mealplans tab
- [ ] Move the foods into a firebase database
- [ ] Print/Export Mealplan schedule
- [ ] View Recepie inside the food description
- [ ] Add fiber to foods
- [ ] Fix what happens when you enter quantity for food and then hit enter button
