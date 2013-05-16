'use strict';

/*
 * GET home page.
 */

exports.manual = function(req, res){
	res.render('employee-manual', {
	title: 'Noodle Employee Manual',
	pagename: 'manual',
	user: req.user
	});
};

exports.resources = function(req, res){
	res.render('resources', {
	title: 'Noodle Resources',
	pagename: 'resources',
	user: req.user
	});
};

exports.main = function(req, res){

	res.render('main', {
	title: 'Noodle',
	pagename: 'home',
	user: req.user
	});
};

exports.index = function(req, res){

	var referenceurl = '';
	var releasename = req.params.release;
	//console.log('releasename = ', releasename);

	if (releasename === 'backlog') {
		referenceurl = 'http://www.trackerstorymaps.com/projects/679513/releases';
	}
	
	if (releasename === 'pnp') {
		referenceurl = 'http://www.trackerstorymaps.com/projects/187445/releases';
	}

	if (releasename === 'snt') {
		referenceurl = 'http://www.trackerstorymaps.com/projects/187421/releases';
	}

	if (releasename === 'jedis') {
		referenceurl = 'http://www.trackerstorymaps.com/projects/305603/releases';
	}

	res.render('iframe', {
	title: 'Noodle',
	referencesite: referenceurl,
	user: req.user,
	pagename: 'iframe'
	});
};

/* 
 * Wiki url route handlers 
 */

exports.wikifinance = function(req, res){
	var marked = require('marked');
	console.log('route handler for wiki finance(...) called');
	res.render('main', {
	title: 'Noodle',
	pagename: 'home',
	user: req.user
	});
};

exports.wikinews = function(req, res){
	var marked = require('marked');
	console.log('route handler for wiki news(...) called');
	res.render('main', {
	title: 'Noodle',
	pagename: 'home',
	user: req.user
	});
};

exports.wikimetrics = function(req, res){
	var marked = require('marked');
	console.log('route handler for wiki metrics(...) called');
	res.render('main', {
	title: 'Noodle',
	pagename: 'home',
	user: req.user
	});
};

exports.wikihandbook = function(req, res){
	var marked = require('marked');
	console.log('route handler for wiki handbook(...) called');
	res.render('main', {
	title: 'Noodle',
	pagename: 'home',
	user: req.user
	});
};

exports.wikimarketing = function(req, res){
	var marked = require('marked');
	console.log('route handler for wiki marketing(...) called');
	res.render('main', {
	title: 'Noodle',
	pagename: 'home',
	user: req.user
	});
};

exports.wikiresources = function(req, res){
	var marked = require('marked');
	console.log('route handler for wiki resources(...) called');
	res.render('main', {
	title: 'Noodle',
	pagename: 'home',
	user: req.user
	});
};

exports.wikitools = function(req, res){
	var marked = require('marked');
	console.log('route handler for wiki tools(...) called');
	res.render('main', {
	title: 'Noodle',
	pagename: 'home',
	user: req.user
	});
};

/*
 * Ajax API route handlers
 */
exports.getShortListOfWikiFiles = function(req, res){
	// place holder routine until actually coded
	var marked = require('marked');
	console.log('route handler for getShortListOfWikiFiles(...) called');
	res.render('main', {
	title: 'Noodle',
	pagename: 'home',
	user: req.user
	});
};

exports.getWikiFileById = function(req, res){
	// place holder routine until actually coded
	var marked = require('marked');
	console.log('route handler for getWikiFileById(...) called');
	res.render('main', {
	title: 'Noodle',
	pagename: 'home',
	user: req.user
	});
};

exports.insertWikiFile = function(req, res){
	// place holder routine until actually coded
	var marked = require('marked');
	console.log('route handler for insertWikiFile(...) called');
	res.render('main', {
	title: 'Noodle',
	pagename: 'home',
	user: req.user
	});
};

exports.updateWikiFile = function(req, res){
	// place holder routine until actually coded
	var marked = require('marked');
	console.log('route handler for updateWikiFile(...) called');
	res.render('main', {
	title: 'Noodle',
	pagename: 'home',
	user: req.user
	});
};

exports.deleteWikiFile = function(req, res){
	// place holder routine until actually coded
	var marked = require('marked');
	console.log('route handler for deleteWikiFile(...) called');
	res.render('main', {
	title: 'Noodle',
	pagename: 'home',
	user: req.user
	});
};