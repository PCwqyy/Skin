/** @param {HTMLCollectionOf<HTMLTableCellElement>} tars */
function NeoTable(tars)
{
	/** @type {Element}*/
	var now,res;
	/** @type {Array<Element>} */
	var DelList;
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
		res=now.textContent.search('(\\[D\\])');
		if(res!=-1)
			DelList.push(now);
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
	}
	for(i in DelList)
		DelList[i].remove();
}
			
var Tds=document.getElementsByTagName('td');
var Ths=document.getElementsByTagName('th');
NeoTable(Tds);
NeoTable(Ths);