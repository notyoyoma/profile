var bucketList = angular.module('bucketList', ['firebase']);

bucketList.controller('BucketListItems', function ($scope, $firebaseArray) {
  var ref = new Firebase( "https://ourbucketlist.firebaseio.com/items" );

  $scope.items = $firebaseArray(ref);

  $scope.addItem = function() {
    $scope.items.$add($scope.form);
  };
});
