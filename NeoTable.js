function CSSColorToRGB(color)
{
	const tempDiv=document.createElement('div');
	tempDiv.style.color=color;
	document.body.appendChild(tempDiv);
	const computedColor=getComputedStyle(tempDiv).color;
	document.body.removeChild(tempDiv);
	const rgbMatch=computedColor.match(/\d+/g);
	if(rgbMatch&&rgbMatch.length>=3)
		return rgbMatch.slice(0,3).map(Number);
	console.warn('Invalid color format');
}
function isDarkColor(color)
{
	const [r,g,b]=CSSColorToRGB(color);
	const brightness=(r*299+g*587+b*114)/1000;
	return brightness<186;
}

/** @param {HTMLCollectionOf<HTMLTableCellElement>} tars */
function NeoTable(tars)
{
	/** @type {Array<HTMLElement>} */
	var DelList=new Array();
	for(i=0;i<tars.length;i++)
	{
		var now=tars[i];
		var res=now.textContent.match(/^\[([XOV])\]/);
		now.classList.add("NeoTd");
		if(res!=null)
		{
			switch(res[1])
			{
				case 'X':now.classList.add('NoTable');break;
				case 'O':now.classList.add('HalfTable');break;
				case 'V':now.classList.add('YesTable');break;
			}
			now.innerHTML=now.innerHTML.substring(res[0].length);
		}
		res=now.textContent.match(/^\[D\]/);
		if(res!=null)
		{
			now.innerHTML=now.innerHTML.substring(res[0].length);
			DelList.push(now);
		}

		res=now.textContent.match(/^\{cs=([0-9]+)\}/);
		if(res!=null)
		{
			now.setAttribute('colspan',res[1]);
			now.innerHTML=now.innerHTML.substring(res[0].length);
			Ex=now;
			for(var j=1;j<Number(res[1]);j++)
			{
				Ex=Ex.nextElementSibling;
				DelList.push(Ex);
			}
		}
		res=now.textContent.match(/^\{rs=([0-9]+)\}/);
		if(res!=null)
		{
			now.setAttribute('rowspan',res[1]);
			now.innerHTML=now.innerHTML.substring(res[0].length);
		}
		res=now.textContent.match(/^\{SL\}/);
		if(res!=null)
		{
			now.classList.add('StickLeft');
			now.innerHTML=now.innerHTML.substring(res[0].length);
		}
		res=now.textContent.match(/^\{col=(.+)\}/);
		if(res!=null)
		{
			now.classList.add("diigoHighlight");//darkreader
			now.style.setProperty("color",`${isDarkColor(res[1])?"#ffffffaf":"#000000af"}`);
			now.style.setProperty("background-color",`${res[1]}`);
			now.innerHTML=now.innerHTML.substring(res[0].length)+" ";
		}

		if(now.innerHTML=='')
		{
			if(now.classList.contains('YesTable'))
				now.innerHTML=('<img class="ImgNeo" src="https://images.cnblogs.com/cnblogs_com/blogs/766141/galleries/2264367/o_250228030719_Tick.svg">');
			if(now.classList.contains('HalfTable'))
				now.innerHTML=('<img class="ImgNeo" src="https://images.cnblogs.com/cnblogs_com/blogs/766141/galleries/2264367/o_250228030719_Circle.svg">');
			if(now.classList.contains('NoTable'))
				now.innerHTML=('<img class="ImgNeo" src="https://images.cnblogs.com/cnblogs_com/blogs/766141/galleries/2264367/o_250228030719_Cross.svg">');
		}
	}
	for(var i of DelList)
		i.remove();
}