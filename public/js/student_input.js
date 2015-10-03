angular.module('student_input', [])
.directive('myClickerInput', function() {
	return {
		restrict:'E',
		template: '<div></div>',
		replace: true,
		//template: 'Name: {{student.name}} '
		controller: ["$scope", function($scope) {
			var ctlr = this;

			$scope.student = {
				//from varun
			};
			$scope.answer = {
				text: 'something'
			};

			$scope.stuff = 
			[
				"cool",
				"things",
				"stuff"
			]
			// $scope.questions = {
			// 	a: {question:"",}

			//};
		}],
		link: function(scope, elem, attrs, controller) {}
	}
})