(function() {
'use strict';

/* global Zenosphere */
var _ = Zenosphere.helpers;

Zenosphere.Stream.source.Twitter = {
	icon: 'twitter',

	options: {
		response: 'jsonp',
		url: 'https://cdn.syndication.twimg.com/widgets/timelines/',
		action: {
			fill: '{stream}',
			poll: 'paged/{stream}',
			refill: 'paged/{stream}',
		},
	},

	/* jshint -W106 */
	params: {
		lang: 'en',
		suppress_response_codes: 'true',
		rnd: function() { return Math.random(); },
		domain: location.host,
		callback: '?',

		since_id: function(action) {
			if (action == 'poll')
				return this.results.max;
		},

		max_id: function(action) {
			if (action == 'refill')
				return this.results.min;
		},
	},
	/* jshint +W106 */

	getEvents: function(data) {
		var doc = document.implementation.createHTMLDocument('twitter');
		doc.body.innerHTML = data.body;

		if (!this.vars.user)
			this.vars.user = this.getUser(doc);

		return _.toArray(doc.querySelectorAll('.tweet'));
	},

	getUser: function(data) {
		var user = data.querySelector('.profile').href;
		return user.substr(user.lastIndexOf('/') + 1);
	},

	getEventID: function(event) {
		return parseInt(event.getAttribute('data-tweet-id'), 10);
	},

	getEventDate: function(event) {
		var snowflake = parseInt(event.getAttribute('data-tweet-id'), 10);
		return Math.floor((snowflake / 4194304 + 1288834974657) / 1000);
	},

	getEventMessage: function(event) {
		var message = event.querySelector('.e-entry-title');

		_.toArray(message.querySelectorAll('.tco-hidden')).forEach(function(element) {
			element.parentNode.removeChild(element);
		});

		_.toArray(message.querySelectorAll('a')).forEach(function(a) {
			var link = document.createElement('a');
			link.textContent = a.textContent;
			link.target = '_blank';
			link.href = a.href;
			link.title = a.title;
			a.parentNode.insertBefore(link, a);
			a.parentNode.removeChild(a);
		});

		var user = this.getUser(event);
		message = message.innerHTML;

		if (user != this.vars.user) {
			message = _.template(
				'RT <a href="https://twitter.com/{user}" target="_blank">@{user}</a>: {message}',
				{
					user: user,
					message: message,
				}
			);
		}

		return message;
	},

	getEventLink: function(event) {
		return event.querySelector('.permalink').href;
	},
};

})();
