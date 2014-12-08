myApp.directive('deselect',function(){
    var ignore = function(ev){
/*        console.log("IGNORING THIS ONE");
        ev.stopPropagation();
        ev.preventDefault();
        return false;*/
    };                
    var makeIgnore = function(){
        this.addEventListener("touchstart",ignore, true);
        this.addEventListener("touchmove",ignore, true);
        this.addEventListener("touch",ignore, true);
        this.addEventListener("touchend",ignore, true);
    }
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).each(makeIgnore);
         // $($(element).children()).each(makeIgnore);
        }
    };
});
