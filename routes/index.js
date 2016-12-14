var express = require('express'),
    http = require("http"),
    url = require("url"),
    fs = require('fs'),
    sm = require('sitemap'),
    options = {
        followLinks: false,
        filters: [".env", "temp"]
    },
    router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Sitemap POC',
    });
});

/* GET views */
router.get('/sitemap', function(req, res, next) {
    var path = ["index.pug", "error.pug", "layout.pug"],
        urls = [];
    path.forEach(function(i) {
        urls.push({
            url : '/' + i,
            lastmod : fs.statSync("/app/views/" + i).mtime,
            changefreq : 'daily',
            priority : 0.5
        });
    });
    sitemap = sm.createSitemap({
        hostname: 'http://sitemap-poc.com',
        cachetime: 60000,
        urls: urls,
        xslUrl : ''
    });
    sitemap.toXML(function(err, xml) {
        if (err) {
          console.log(err);
            return res.status(500).end();
        }
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    });
});

module.exports = router;
