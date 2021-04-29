function get_Y(obj){
    var ParentObj=obj;
    //var top=obj.offsetTop;
    //while(ParentObj=ParentObj.offsetParent){
        //top+=ParentObj.offsetTop;
    //}
    var top = 0;
    return top;
    document.write("<style>.header{position: sticky;top: 110px;}</style>");
}
function get_X(obj){
    var ParentObj=obj;
    var left = 0;
    //var left=obj.offsetLeft;
    //while(ParentObj=ParentObj.offsetParent){
    //    left+=ParentObj.offsetLeft;
    //}
    return left;
}
function addLoadEvent(func){
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload =function(){
			oldonload();
			func();
		}
	}
}
var DocY=400,DocX=800,Wl_Float_Div;
function DocLoad(){
	Wl_Float_Div=document.getElementById('Wl_Float_Div');
	DocX=get_X(Wl_Float_Div);
	DocY=get_Y(Wl_Float_Div);
	Wl_Float_Div.style.position='absolute';
	Wl_Float_Div.style.top=DocY + 'px';
	Wl_Float_Div.style.left=DocX + 'px';
	Wl_Float_Div.style.height=278 + 'px';
	Wl_Float_Div.style.width=251 + 'px';
	Wl_Float_Div.style.overflow='hidden';
	Wl_Float_Div.style.backgroundColor='#fff';
}
window.onscroll = function MoveQQ(){
	var temp = document.documentElement.scrollTop+document.body.scrollTop;
	if(temp > DocY + 25){
		//Wl_Float_Div.style.top=(temp+25) + "px";
	}else{
		//Wl_Float_Div.style.top=DocY + "px";
	}
}
DocLoad();