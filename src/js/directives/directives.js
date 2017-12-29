'use strict'
angular.module('canoeApp.directives')
  .directive('validAddress', ['$rootScope', 'raiblocksService',
    function ($rootScope, raiblocksService) {
      return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
          var validator = function (value) {
            // Regular url
            if (/^https?:\/\//.test(value)) {
              ctrl.$setValidity('validAddress', true)
              return value
            }

            // Regular Address
            var isValid = raiblocksService.isValidAccount(value)
            ctrl.$setValidity('validAddress', isValid)
            return value
          };

          ctrl.$parsers.unshift(validator)
          ctrl.$formatters.unshift(validator)
        }
      }
    }
  ])
  .directive('validAmount', ['configService',
    function (configService) {
      return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
          var val = function (value) {
            var settings = configService.getSync().wallet.settings
            var vNum = Number((value * settings.unitToRaw).toFixed(0))
            if (typeof value === 'undefined' || value == 0) {
              ctrl.$pristine = true
            }

            if (typeof vNum === 'number' && vNum > 0) {
              if (vNum > Number.MAX_SAFE_INTEGER) {
                ctrl.$setValidity('validAmount', false)
              } else {
                var decimals = Number(settings.unitDecimals)
                var sep_index = ('' + value).indexOf('.')
                var str_value = ('' + value).substring(sep_index + 1)
                if (sep_index >= 0 && str_value.length > decimals) {
                  ctrl.$setValidity('validAmount', false)
                  return;
                } else {
                  ctrl.$setValidity('validAmount', true)
                }
              }
            } else {
              ctrl.$setValidity('validAmount', false)
            }
            return value
          }
          ctrl.$parsers.unshift(val)
          ctrl.$formatters.unshift(val)
        }
      }
    }
  ])
  .directive('walletSecret', function (bitcore) {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var validator = function (value) {
          if (value.length > 0) {
            var m = value.match(/^[0-9A-HJ-NP-Za-km-z]{70,80}$/)
            ctrl.$setValidity('walletSecret', !!m)
          }
          return value
        };

        ctrl.$parsers.unshift(validator)
      }
    }
  })
  .directive('ngFileSelect', function () {
    return {
      link: function ($scope, el) {
        el.bind('change', function (e) {
          $scope.formData.file = (e.srcElement || e.target).files[0]
          $scope.getFile()
        })
      }
    }
  })
  .directive('contact', ['addressbookService', 'lodash',
    function (addressbookService, lodash) {
      return {
        restrict: 'E',
        link: function (scope, element, attrs) {
          var addr = attrs.address
          addressbookService.get(addr, function (err, ab) {
            if (ab) {
              var name = lodash.isObject(ab) ? ab.name : ab
              element.append(name)
            } else {
              element.append(addr)
            }
          })
        }
      }
    }
  ])
  .directive('ignoreMouseWheel', function ($rootScope, $timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.bind('mousewheel', function (event) {
          element[0].blur()
          $timeout(function () {
            element[0].focus()
          }, 1)
        })
      }
    }
  })