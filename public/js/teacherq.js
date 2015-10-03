angular.module('teacherq', [])
.directive('teacherQuestions', function() {
   return {
      restrict:'E',
      template: '<div ><ng-repeat stuff in stuffs><b>{{stuff}}</b></ng-repeat></div>',
      replace:  true,
      //template: 'Name: {{student.name}} '
      controller: ["$scope", function($scope) {
         $scope.stuffs= ["cool", "thing", "stuffs"];
         $scope.answer = {
            text: 'something'
         };
         //$scope.questions = {
         //   a: {question:"",}

         //}
      }]
   }
})