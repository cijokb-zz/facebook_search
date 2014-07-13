/*
	facebook_search app for pages...
	version:1.0

	developed by :Cijo K.B
	email:cijo.kb@gmail.com
	
*/

window.onload=initialize;

function initialize(){
	main_res=new Array;
	sub_res=new Array;
 	sort_array=new Array;
	
	div_res=document.getElementById("results");

	var srch=document.getElementById("srch_btn");
	srch.addEventListener("click",fb_search);
	

	var more_search=document.querySelector("#results");
	more_search.addEventListener("click",page_search);

	var enter_srch=document.getElementById("search");
	enter_srch.addEventListener("keypress",fb_search);

	loader=document.getElementById("loading");
}


function fb_search(e){
	
	if ((e.target.id=="search") ||(e.target.id=="srch_btn"))
		{
			if((e.keyCode==13) ||(e.type=="click"))
			{
				var srch_txt=document.getElementById("search").value;
				srch_txt=srch_txt.trim();
				if((srch_txt.length>0)||(srch_txt!==""))
				{
					div_res.innerHTML="";
					loader.style.display="block";
					var addr="https://graph.facebook.com/v2.0/search?q="+srch_txt+"&type=Page&limit=10&access_token=1021059697950074|4885e92eb4a22f130a78cd5e117eb973";
					var req=new XMLHttpRequest();
					req.open('Get',addr,true);
					req.send(null);
					req.onreadystatechange=function (){
						if((req.status==200) && (req.readyState==4)){
							main_res=JSON.parse(req.responseText);
							process_req(main_res);
						}
					};//end onreadystatechange 
				}
				else
				{
					alert("Please enter valid value");
				}
			}// keycode type if
		}//outer if
}//end of fb_search

//processing ajax responseText
function process_req(res_array){
	var res_arr_len=res_array.data.length;
	if(res_arr_len>0){
		res_array.data.sort(sort_dsc);
		creating(res_array);//creating elements
	}
	else
	{
		loader.style.display="none";
		div_res.innerHTML="<div id='no_data'>Sorry no record found</br>Please modify search</div>";
	}
}

function page_search(e){

var ret_array;
if(e.target.tagName=="A")
	{
		if(e.target.parentNode.parentNode.className!="inner"){
			e.preventDefault();
			if(e.target.parentNode.parentNode.childNodes.length<2){
				var addr="https://graph.facebook.com/"+e.target.parentNode.parentNode.id;
				req=new XMLHttpRequest();
				req.open('Get',addr,true);
				req.send(null);
				
				req.onreadystatechange=function (){
					if((req.status==200) && (req.readyState==4)){
						sub_res=JSON.parse(req.responseText);
						page_disp(e.target.parentNode.parentNode);
					}
				};//end onreadystatechange 
			}//length if
		}//class chekcing if	
	 }//tag if
	 else if(e.target.id=="asc")
	 {
	 	main_res.data.sort(sort_asc);
	 	creating(main_res);
	 }
	  else if(e.target.id=="dsc")
	 {
	 	main_res.data.sort(sort_dsc);
	 	creating(main_res);
	 }
	  else if(e.target.id=="next")
	 {
	 	next_page(main_res);
	 	//debugger;
	 }
	 else if(e.target.id=="prev")
	 {
	 	prev_page(main_res);
	 }
	 else if(e.target.className=="un_fav")
	 {
	 	e.target.className="fav";
		store_fav(e);
	 }
	  else if(e.target.className=="fav")
	  {
	  	e.target.className="un_fav";
	 	remove_fav(e);
	 }
} //end of page_search


function page_disp(parent_node){
	var flag=0;
	var cover_image="no_image.jpg";
	//var cover_image="http://imgur.com/IMR1mAo.jpg";
	for(var key in sub_res)
	{
		if(key=="cover"){
			flag=1;
		}
	}
	if(flag==1)	{
			cover_image=sub_res.cover.source;
	}
	var elmt="<div class='inner'><div class='img_div'>";
		elmt+="<img src='"+cover_image+"'/></div><div class='more_info'>";
		elmt+="<label>Category :"+sub_res.category+"</label><br/>";
		elmt+="<label>Likes : "+sub_res.likes+"</label><br/>";
		elmt+="<a href='"+sub_res.link+"' target='blank_new' >"+sub_res.link+"</a></div></div>";
	parent_node.innerHTML+=elmt;
}


function creating (mainres){

	var fav,elem;
	var fav_class;
	var n=mainres.data.length;
	loader.style.display="none";

	div_res.innerHTML="<input type='button' id='asc' value='Asc'/><input type='button' id='dsc' value='Desc'/><input type='button' id='prev' value='prev'/><input type='button' id='next' value='next'/></label>";
	for(var i=0;i<n;i++)
	{
			fav_class="un_fav";
			fav=check_favr(mainres.data[i].id); //checking favorites list
			if(fav==1){
				fav_class="fav";
			}
			elem="<div class='result' id='"+mainres.data[i].id+"'><div class='head'><a href='#'>"+mainres.data[i].name+"</a><a title='Click to Add/Remove favourites' ><div class='"+fav_class+"'></div></a></div>";
			div_res.innerHTML+=elem;
	}// end for
		
} 

//sorting ascending

function sort_asc(fst,scn){

	//alert("'");
	 var first = fst.name.toLowerCase();
     var scnd = scn.name.toLowerCase();
     if (first > scnd){
        return -1;
     }else if (first < scnd){
       return  1;
     }else{
       return 0;
     }
	
}//end of sort


function sort_dsc(fst,scn){

	 var first = fst.name.toLowerCase();
     var scnd = scn.name.toLowerCase();
     if (first< scnd){
        return -1;
     }else if (first> scnd){
       return  1;
     }else{
       return 0;
     }
	
}//end of sort


/* uisng id
function sort_asc(res_array){

	var sort_array=res_array;
	var n=sort_array.data.length-1;
	for(var i=0;i<n;i++)
		{
			for(var j=0; j<n-i;j++)
			{
				if(parseInt(sort_array.data[j].id)<=parseInt(sort_array.data[j+1].id)){
					var t=sort_array.data[j];
					sort_array.data[j]=sort_array.data[j+1];
					sort_array.data[j+1]=t;
				}
			}// inner for
		}//outer for	

return sort_array;		
}//end of sort

//sorting descending
function sort_dsc(res_array){
	sort_array=res_array;
	var n=sort_array.data.length-1;

	for(var i=0;i<n;i++)
		{
			for(var j=0; j<n-i;j++)
			{
				//console.log(main_res.data[j]+" i="+i+",j="+j);
				if(parseInt(sort_array.data[j].id)>=parseInt(sort_array.data[j+1].id)){
					var t=main_res.data[j];
					sort_array.data[j]=sort_array.data[j+1];
					sort_array.data[j+1]=t;
				}
			} //end inner for
		}//end outer for	
		return sort_array;	
	}//end of sort

*/
//storing favourites in localsotrage
function store_fav(e){
	
	if (!!window.localStorage||window['localStorage']!=null){
			
			var key_id=(e.target.parentNode.parentNode.parentNode.id);
			//console.log(key_id);
			var store="fav";
			window.localStorage.setItem(key_id,store);
		}
}

//removing favourites from localsotrage
function remove_fav(e){
	
	if (!!window.localStorage||window['localStorage']!=null){
			
			var key_id=(e.target.parentNode.parentNode.parentNode.id);
			if(window.localStorage.getItem(key_id)=="fav")
			{
				console.log(key_id);
				window.localStorage.removeItem(key_id);
			}
		}
}

//chekcing favorites in localstorage
function check_favr(id){

	if (!!window.localStorage||window['localStorage']!=null){
			var flag=0;
			var key_id=id;
			var store_value=window.localStorage.getItem(key_id);
			if(window.localStorage.getItem(key_id)=="fav")
			{
				flag=1;	
			}
			return flag;
		}// end main if 
}

//next page click
function next_page(mainres){

	var flag=0;
	var page_link;
	console.log(mainres);
	for(var key in mainres)		
		{
			if(key=='paging')
			{
				for(var innkey in mainres.paging)
				{
					if (innkey=='next') {
						page_link=mainres.paging.next;
						flag=1;
					}
				}//inner for
			}
		}//outer for
		
		if(flag==1){
			more_pages(page_link);
		}
}

function prev_page(mainres){
var flag=0;
var page_link;
for(var key in mainres)		
	{
		if(key=='paging')
		{
			for(var innkey in mainres.paging)
			{
			 	if(innkey=='previous'){
					page_link=mainres.paging.previous;
					flag=1;
				}
			}//inner for
		}
	}//outer for

	if(flag==1)	{
		more_pages(page_link);
	}

}

function more_pages(page_link){

	div_res.innerHTML="";
	loader.style.display="block";
	
	var addr=page_link;
	var req=new XMLHttpRequest();
	req.open('Get',addr,true);
	req.send(null);
	req.onreadystatechange=function (){
		if((req.status==200) && (req.readyState==4)){
			main_res=JSON.parse(req.responseText);
			process_req(main_res);
		}
	};//end onreadystatechange 
	
}//end 	

