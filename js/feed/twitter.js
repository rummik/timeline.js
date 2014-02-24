(function() {
'use strict';

Timeline.Stream.type.Twitter = {
	api: 'https://cdn.syndication.twimg.com/widgets/timelines/',
	jsonp: true,

	params: {
		lang: 'en',
		suppress_response_codes: 'true',
		rnd: function() { return Math.random(); },
		callback: '?',

		max_id: function() {
			if (this.received.low > 0)
				return this.received.low;
		},
	},

	pages: 10,
	fill: function fillTwitter(done) {
		var self = this;

		this.get((this.page > 1 ? 'paged/' : '') + this.stream, function(data) {
			var doc = document.implementation.createHTMLDocument('twitter');
			doc.body.innerHTML = data.body;

			var tweets = [].slice.apply(doc.querySelectorAll('.tweet'));

			if (self.received.high == -1)
				self.received.high = tweets[0].getAttribute('data-tweet-id');

			self.received.low = tweets[tweets.length - 1].getAttribute('data-tweet-id');

			tweets.forEach(function(tweet) {
				self.messages.push({
					date: new Date(tweet.querySelector('.permalink').getAttribute('data-datetime')).valueOf(),
					message: tweet.querySelector('.e-entry-title').innerHTML.replace(/<.+?>/g, ''),
				});
			});

			done();
		});
	},
};

})();
