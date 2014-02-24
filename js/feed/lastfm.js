(function() {
'use strict';

var _ = Timeline.helpers;

Timeline.Stream.type['Last.fm'] = {
	api: 'https://ws.audioscrobbler.com/2.0/',
	xml: true,

	pages: 20,
	fill: function fillLastfm(done) {
		var self = this;
		var from = this.received.low ? '&to=' + this.received.low : '';

		this.get('user/' + this.stream + '/recenttracks.rss?limit=50' + from, function(data) {
			var tracks = [].slice.apply(data.querySelectorAll('item'));

			if (!self.received.high)
				self.received.high = _.parseTime(tracks[0].querySelector('pubDate').innerHTML);

			self.received.low = _.parseTime(tracks[tracks.length - 1].querySelector('pubDate').innerHTML);

			tracks.forEach(function(track) {
				self.messages.push({
					date: _.parseTime(track.querySelector('pubDate').innerHTML),
					message: track.querySelector('title').innerHTML,
				});
			});

			done();
		});
	},

	latest: function latestLastfm(done) {
		done();
	},
};

})();
