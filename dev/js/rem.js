"use strict";
~function(window){
	var designWidth=750/2;
	var headEl= window.document.getElementsByTagName('head')[0];
	var docEl=document.documentElement;
	var newDiv=window.document.createElement('div');

	newDiv.style.width='1rem';
	newDiv.style.display='none';
	headEl.appendChild(newDiv);
	var defaultFontsize=parseFloat(window.getComputedStyle(newDiv,null).getPropertyValue('width'));
	newDiv.remove();
	docEl.style.fontSize= window.innerWidth/designWidth*100/defaultFontsize*100+'%';

	window.rem2px=function(v){
		return parseFloat(v)*100
	};
	window.px2rem = function(v){
		return parseFloat(v)/100
	};
}(window);