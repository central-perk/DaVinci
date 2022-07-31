/**
 *  导出客户
 *
 */
define(["app"], function (app) {
  app.service("$layerAnimate", [
    "config",
    "$layerManage",
    "$layerManage",
    "$imageUpload",
    "$alert",
    "$rootScope",
    "$utils",
    function (config, $layerManage, $imageUpload, $alert, $rootScope, $utils) {
      var deafults = {
        none: {
          config: {
            name: "none",
            type: "none",
          },
          dirs: [],
        },
        fadeIn: {
          config: {
            name: "move in",
            type: "fadeIn", //animation effect
            dir: "fromLeft", //animation direction
            distance: 150,
            duration: 1, //duration
            delay: 0, // delay time
            disappear: 0, //whether the animation disappears after the end of the animation
          },
          dirs: [
            {
              name: "from center",
              type: "fromCenter",
            },
            {
              name: "from the left",
              type: "fromLeft",
            },
            {
              name: "from the right",
              type: "fromRight",
            },
            {
              name: "from above",
              type: "fromTop",
            },
            {
              name: "from below",
              type: "fromBottom",
            },
            {
              name: "from top left corner",
              type: "fromLeftTop",
            },
            {
              name: "From the lower left corner",
              type: "fromLeftBottom",
            },
            {
              name: "From the top right corner",
              type: "fromRightTop",
            },
            {
              name: "From the bottom right corner",
              type: "fromRightBottom",
            },
          ],
        },
        moveIn: {
          config: {
            name: "Fly in",
            type: "moveIn", //animation effect
            dir: "fromLeft", //animation direction
            duration: 1, //duration
            distance: 640,
            delay: 0, // delay time
            disappear: 0, //whether the animation disappears after the end of the animation
          },
          dirs: [
            {
              name: "from the left",
              type: "fromLeft",
            },
            {
              name: "from the right",
              type: "fromRight",
            },
            {
              name: "from above",
              type: "fromTop",
            },
            {
              name: "from below",
              type: "fromBottom",
            },
            {
              name: "from top left corner",
              type: "fromLeftTop",
            },
            {
              name: "From the lower left corner",
              type: "fromLeftBottom",
            },
            {
              name: "From the top right corner",
              type: "fromRightTop",
            },
            {
              name: "From the bottom right corner",
              type: "fromRightBottom",
            },
          ],
        },
        bounceIn: {
          config: {
            name: "Bounce in",
            type: "bounceIn", //animation effect
            dir: "fromLeft", //animation direction
            duration: 1, //duration
            distance: 1000,
            delay: 0, // delay time
            disappear: 0, //whether the animation disappears after the end of the animation
          },
          dirs: [
            {
              name: "from center",
              type: "fromCenter",
            },
            {
              name: "from the left",
              type: "fromLeft",
            },
            {
              name: "from the right",
              type: "fromRight",
            },
            {
              name: "from above",
              type: "fromTop",
            },
            {
              name: "from below",
              type: "fromBottom",
            },
            {
              name: "from top left corner",
              type: "fromLeftTop",
            },
            {
              name: "From the lower left corner",
              type: "fromLeftBottom",
            },
            {
              name: "From the top right corner",
              type: "fromRightTop",
            },
            {
              name: "From the bottom right corner",
              type: "fromRightBottom",
            },
          ],
        },
        scaleIn: {
          config: {
            name: "zoom",
            type: "scaleIn", //animation effect
            dir: "fromBig", //animation direction
            duration: 1, //duration
            delay: 0, // delay time
            disappear: 0, //whether the animation disappears after the end of the animation
          },
          dirs: [
            {
              name: "From big to small",
              type: "fromBig",
            },
            {
              name: "From small to large",
              type: "fromSm",
            },
          ],
        },
        pull: {
          config: {
            name: "Expand",
            type: "pull", //animation effect
            dir: "toRight", //animation direction
            duration: 1, //duration
            delay: 0, // delay time
            disappear: 0, //whether the animation disappears after the end of the animation
          },
          dirs: [
            {
              name: "from the left",
              type: "toRight",
            },
            {
              name: "from the right",
              type: "toLeft",
            },
            {
              name: "from above",
              type: "toBottom",
            },
            {
              name: "from below",
              type: "toTop",
            },
          ],
        },
        rollIn: {
          config: {
            name: "roll in",
            type: "rollIn", //animation effect
            dir: "fromLeft", //animation direction
            duration: 1, //duration
            delay: 0, // delay time
            disappear: 0, //whether the animation disappears after the end of the animation
          },
          dirs: [
            {
              name: "from the left",
              type: "fromLeft",
            },
            {
              name: "from the right",
              type: "fromRight",
            },
            {
              name: "from above",
              type: "fromTop",
            },
            {
              name: "from below",
              type: "fromBottom",
            },
          ],
        },
        rotate: {
          config: {
            name: "Rotate",
            type: "rotate", //animation effect
            dir: "fromClockwise", //animation direction
            duration: 1, //duration
            delay: 0, // delay time
            count: "infinite", //Number of animation executions
            disappear: 0, //whether the animation disappears after the end of the animation
          },
          dirs: [
            {
              name: "Clockwise",
              type: "fromClockwise",
            },
            {
              name: "Counterclockwise",
              type: "fromAntiClockwise",
            },
            {
              name: "horizontal",
              type: "fromHorizontal",
            },
          ],
        },
        light: {
          config: {
            name: "flashing",
            type: "light", //animation effect
            dir: "fromCenter", //animation direction
            duration: 1, //duration
            delay: 0, // delay time
            disappear: 0,
            count: 1,
          },
          dirs: [],
        },
        shake: {
          config: {
            name: "jitter",
            type: "shake", //animation effect
            dir: "fromHorizontal", //animation direction
            duration: 1, //duration
            delay: 0,
            disappear: 0,
          },
          dirs: [
            {
              name: "Jitter left and right",
              type: "fromHorizontal",
            },
            {
              name: "Jitter up and down",
              type: "fromVertical",
            },
          ],
        },
      };
      var particle = {
        config: {
          name: "Particleization",
          type: "particle", //animation effect
          dir: "fromCenter", //animation direction
          // duration: 1, // duration
          delay: 0, // delay time
          disappear: 0,
          // count: 1
        },
        dirs: [],
      };

      this.getDefaultAnimate = function (type) {
        return angular.copy(deafults[type].config);
      };
      this.getDefaults = function () {
        return deafults;
      };

      this.list = function (layer) {
        // if($layerManage.isImage(layer)){
        // deafults.particle = particle;
        // }else{
        // delete deafults.particle;
        // }
        var animations = [];
        for (var key in deafults) {
          animations.push(deafults[key]);
        }
        return animations;
      };
    },
  ]);
});
