IndexController = function($scope) {
    window.s = $scope;
    $scope.t = text;

    $scope.mode = function(setMode) {
        if (setMode) {
            mode = setMode;
        }
        return mode;
    };

    $scope.proceedToGame = function(quickMode, spectateCpu) {
        Game.prototype.humanControl = spectateCpu ? 'none' : 'home';
        Game.prototype.quickMode = !!quickMode;
        $scope.y = new Game();
        var game = $scope.y;
        s2.y = game;
        bindMethods();
        jQ('.blocking').remove();
        if (game.humanControl == 'none' && game.quickMode) {
            var n = 0;
            do {
                n++;
                game.simulateInput(function(callback) {
                    typeof callback == 'function' && callback();
                });
            } while (game.stage != 'end' && n < 500);
            log('sim ended');
            game.debugOut();
        } else if (game.humanControl == 'none') {
            var scalar = game.quickMode ? 0.05 : 1;
            var auto = setInterval(function() {
                if (game.stage == 'end') {
                    clearInterval(auto);
                }
                game.simulatePitchAndSwing(function(callback) {
                    game.quickMode ? void 0 : $scope.$apply();
                    $scope.updateFlightPath(callback);
                });
            }, scalar*(game.field.hasRunnersOn() ? Animator.TIME_FROM_SET + 2000 : Animator.TIME_FROM_WINDUP + 2000));
        }
        if (game.humanControl == 'away') {
            game.simulateInput(function(callback) {
                $scope.updateFlightPath(callback);
            });
        }
        if (game.humanControl == 'home') {

        }
    };

    var bindMethods = function() {
        var game = $scope.y;
        $scope.holdUpTimeouts = [];
        $scope.expandScoreboard = false;
        var animator = new Animator();
        $scope.updateFlightPath = animator.updateFlightPath.bind($scope);

        // avoid scope cycles, any other easy way?
        var bat = jQ('.target .swing.stance-indicator');
        var showBat = function(event) {
            if (game.humanBatting()) {
                var offset = jQ('.target').offset();
                var relativeOffset = {
                    x : event.pageX - offset.left,
                    y : 200 - (event.pageY - offset.top)
                };
                var angle = game.setBatAngle(relativeOffset.x, relativeOffset.y);
                bat.css({
                    top: 200-relativeOffset.y + "px",
                    left: relativeOffset.x + "px",
                    transform: "rotate(" + angle + "deg) rotateY("+(game.batter.bats == "left" ? 0 : -0)+"deg)"
                });
                if (relativeOffset.x > 200 || relativeOffset.x < 0 || relativeOffset.y > 200 || relativeOffset.y < 0) {
                    bat.hide();
                } else {
                    bat.show();
                }
            }
        };
        var glove = jQ('.target .glove.stance-indicator');
        var showGlove = function(event) {
            if (game.humanPitching()) {
                var offset = jQ('.target').offset();
                var relativeOffset = {
                    x : event.pageX - offset.left,
                    y : 200 - (event.pageY - offset.top)
                };
                glove.css({
                    top: 200-relativeOffset.y + "px",
                    left: relativeOffset.x + "px"
                });
                if (relativeOffset.x > 200 || relativeOffset.x < 0 || relativeOffset.y > 200 || relativeOffset.y < 0) {
                    glove.hide();
                } else {
                    glove.show();
                }
            }
        };

        $scope.selectPitch = function(pitchName) {
            if (game.stage == 'pitch') {
                game.pitchInFlight = jQ.extend({}, game.pitcher.pitching[pitchName]);
                game.pitchInFlight.name = pitchName;
                game.swingResult.looking = true;
            }
        };
        $scope.allowInput = true;
        $scope.holdUp = function() {
            jQ('.no-swing').click();
            $scope.$apply();
        };
        game.startOpponentPitching = function(callback) {
            $scope.updateFlightPath(callback);
        };
        $scope.indicate = function($event) {
            if (!$scope.allowInput) {
                return;
            }
            if (game.pitcher.windingUp) {
                return;
            }
            if (game.humanPitching()) $scope.allowInput = false;
            var offset = jQ('.target').offset();
            var relativeOffset = {
                x : $event.pageX - offset.left,
                y : 200 - ($event.pageY - offset.top)
            };
            clearTimeout($scope.lastTimeout);
            while ($scope.holdUpTimeouts.length) {
                clearTimeout($scope.holdUpTimeouts.shift());
            }
            game.receiveInput(relativeOffset.x, relativeOffset.y, function(callback) {
                $scope.updateFlightPath(callback);
            });
        };
        $scope.abbreviatePosition = function(position) {
            if (mode == 'e') {
                return {
                    pitcher : 'P',
                    catcher : 'C',
                    first : '1B',
                    second : '2B',
                    short : 'SS',
                    third : '3B',
                    left : 'LF',
                    center : 'CF',
                    right : 'RF'
                }[position];
            }
            return text.fielderShortName(position);
        };
        $scope.$watch('y.humanBatting()', function() {
            if ($scope.y.humanBatting()) {
                jQ('.target').mousemove(showBat);
            } else {
                jQ('.target').unbind('mousemove', showBat);
                bat.hide();
            }
        });
        $scope.$watch('y.humanPitching()', function() {
            if ($scope.y.humanPitching()) {
                jQ('.target').mousemove(showGlove);
            } else {
                jQ('.target').unbind('mousemove', showGlove);
                glove.hide();
            }
        });
    };


};