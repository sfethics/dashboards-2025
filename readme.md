# Campaign Finance Dashboards — San Francisco Ethics Commission

This repository contains the source code and latest data files for the San Francisco Ethics Commission’s Campaign Watch website, [https://campaign.sfethics.org/](https://campaign.sfethics.org/).

The Campaign Watch website summarizes San Francisco political campaign fundraising and spending data by candidates and committees in local elections. The goal of the website is to promote election transparency by presenting campaign data in a user-friendly and mobile-accessible format.


## About the San Francisco Ethics Commission

The San Francisco Ethics Commission is the city department responsible for administering and enforcing local laws related to campaign finance, ethics, conflicts of interest, lobbying, campaign consulting, permit consulting, and major developers.

[More information about the Ethics Commission](https://sfethics.org/)


## What’s in This Repository

This repository supports the development and publication of the Campaign Watch website, which is built on Jekyll and deployed to GitHub pages. Files in this repository include:

- **HTML layout templates** to display the various types of pages such as committee, contest, election, etc.
- **Markdown data files** used to populate data elements in HTML templates
- **Tooltips/explainer pages** describing SF campaign finance concepts, how the data is derived or calculated
- **Frontend assets** (CSS, JavaScript, images) used to render and style the website
- **Build and deployment configuration** for building on Jekyll and publishing via GitHub Pages


## Data Sources

Campaign finance data displayed in these dashboards is derived from disclosure filings submitted to the San Francisco Ethics Commission. These filings are made publicly available in accordance with local and state campaign finance laws.

The dashboards focus on presentation and accessibility of the data; they are not a substitute for official filings.


## Development

### Prerequisites

- A modern web browser (to browse the website running on a local server)
- Ruby (required to install Jekyll)
- bash terminal or equivalent

### Setup guide

- Install Ruby: follow these instructions for your operating system [https://jekyllrb.com/docs/installation/](https://jekyllrb.com/docs/installation/)
- Install gems: run `gem install jekyll bundler`
- Clone this repository
- Open the repository, and run `bundle install`
- To start the local server, run `bundle exec jekyll serve`


