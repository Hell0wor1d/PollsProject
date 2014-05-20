/**
 * Created by kev7n on 14-5-18.
 */
// Controller for the poll list
function PollListCtrl($scope, Poll) {
    $scope.polls = Poll.query();
}

// Controller for an individual poll
function PollItemCtrl($scope, $location, $routeParams, socket, Poll) {
    $scope.poll = Poll.get({pollId: $routeParams.pollId});

    socket.on('myvote', function (data) {
        console.dir(data);
        if (data._id === $routeParams.pollId) {
            $scope.poll = data;
        }
    });

    socket.on('vote', function (data) {
        console.dir(data);
        if (data._id === $routeParams.pollId) {
            $scope.poll.choices = data.choices;
            $scope.poll.totalVotes = data.totalVotes;
        }
    });

    $scope.vote = function () {
        var pollId = $scope.poll._id,
            choiceId = $scope.poll.userVote;

        if (choiceId) {
            var voteObj = { poll_id: pollId, choice: choiceId };
            socket.emit('send:vote', voteObj);
        } else {
            alert('请选择一个投票选项。');
        }
    };

    $scope.deleteVote = function () {
        if (confirm('确定删除该投票?')) {
            Poll.remove({pollId: $scope.poll._id}, function (result) {
                if (result.ok) {
                    $location.path("/polls");
                    //$scope.$apply(function() { $location.path("/polls"); });
                }
            });
        }
    }
}

// Controller for creating a new poll
function PollNewCtrl($scope, $location, Poll) {
    // Define an empty poll model object
    $scope.poll = {
        question: '',
        choices: [
            { text: '' },
            { text: '' },
            { text: '' }
        ]
    };

    // Method to add an additional choice option
    $scope.addChoice = function () {
        $scope.poll.choices.push({ text: '' });
    };

    // Validate and save the new poll to the database
    $scope.createPoll = function () {
        var poll = $scope.poll;

        // Check that a question was provided
        if (poll.question.length > 0) {
            var choiceCount = 0;

            // Loop through the choices, make sure at least two provided
            for (var i = 0, ln = poll.choices.length; i < ln; i++) {
                var choice = poll.choices[i];

                if (choice.text.length > 0) {
                    choiceCount++
                }
            }

            if (choiceCount > 1) {
                // Create a new poll from the model
                var newPoll = new Poll(poll);

                // Call API to save poll to the database
                newPoll.$save(function (p, resp) {
                    if (!p.error) {
                        // If there is no error, redirect to the main view
                        $location.path('polls');
                    } else {
                        alert('创建投票失败。');
                    }
                });
            } else {
                alert('至少填入两个选项。');
            }
        } else {
            alert('请填入投票问题。');
        }
    };
}