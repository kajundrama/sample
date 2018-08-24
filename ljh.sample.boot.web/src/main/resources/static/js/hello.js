<script>
angular.module('hello', []).controller('home', function($http) {
	var self = this;
	$http.get('resource/').then(function(response) {
		self.greeting = response.data;
	})
});
<script src="js/jquery.js"></script>
</script>