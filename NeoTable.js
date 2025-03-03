/** @param {HTMLCollectionOf<HTMLTableCellElement>} tars */
function NeoTable(tars)
{
	/** @type {Element}*/
	var now,res;
	/** @type {Array<Element>} */
	var DelList=new Array();
	for(i=0;i<tars.length;i++)
	{
		now=tars[i];
		res=now.textContent.search('(\\[(X|O|V)\\])');
		if(res!=-1)
		{
			switch(now.textContent[res+1])
			{
				case 'X':now.classList.add('NoTable');break;
				case 'O':now.classList.add('HalfTable');break;
				case 'V':now.classList.add('YesTable');break;
			}
			now.innerHTML=now.innerHTML.substring(res+3);
		}
		res=now.textContent.match('(\\[D\\])');
		if(res!=null)
		{
			now.innerHTML=now.innerHTML.substring(res[0].length);
			DelList.push(now);
		}

		res=now.textContent.match('\\{cs=([0-9]+)\\}');
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
		res=now.textContent.match('\\{rs=([0-9]+)\\}');
		if(res!=null)
		{
			now.setAttribute('rowspan',res[1]);
			now.innerHTML=now.innerHTML.substring(res[0].length);
		}
		res=now.textContent.match('\\{SL\\}');
		if(res!=null)
		{
			now.classList.add('StickLeft');
			now.innerHTML=now.innerHTML.substring(res[0].length);
		}

		if(now.innerHTML=='')
		{
			if(now.classList.contains('YesTable'))
				now.innerHTML=('<img class="ImgNeo" src="https://img2023.cnblogs.com/blog/2971758/202412/2971758-20241223101514623-1345162790.png">');
			if(now.classList.contains('HalfTable'))
				now.innerHTML=('<img class="ImgNeo" src="https://img2023.cnblogs.com/blog/2971758/202412/2971758-20241223105901512-2143423915.png">');
			if(now.classList.contains('NoTable'))
				now.innerHTML=('<img class="ImgNeo" src="https://img2023.cnblogs.com/blog/2971758/202412/2971758-20241223110021941-1928889318.png">');
		}
	}
	for(i in DelList)
		DelList[i].remove();
}
			
var Tds=document.getElementsByTagName('td');
var Ths=document.getElementsByTagName('th');
NeoTable(Tds);
NeoTable(Ths);