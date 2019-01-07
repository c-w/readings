## What's this?

This blog is a space for me to write about software things sometimes. The bulk
of the content is made up of short summaries of books, articles, papers, etc.
that relate to software engineering, data science, machine learning and so
forth.

The frontend for the blog is hosted on [gh-pages](https://justamouse.com/readings).
It's built using VueJS and MaterializeCSS and pulls data from this repository.

## Data schema

```json
{
  "content": [
    {
    "date": "YYYY-MM-DD",
    "summary": "string",
    "title": "string",
    "topics": [
      "string"
    ],
    "type": "string",
    "url": "string"
    }
  ]
}
```
