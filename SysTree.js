/** @type {String} */
var TreeWork;
/**
 *  @param {String} type 
 *  @returns {String} */
function GetTreeHTML(type)
{
	// console.log(`[Now]${TreeWork}`);
	var res=TreeWork.match(/^\s*([^\(|,|\)]*)\s*\(/);
	if(res==undefined)
	{
		res=TreeWork.match(/^\s*([^\(|,|\)]+)\s*/);
		TreeWork=TreeWork.substring(res[0].length);
		// console.log(`[Ret]${TreeWork}`);
		return `
			<table class="SysTreeTable LeafTable"><tr>
				<td class="SysTree ${type=="DTree"?"LineD":"LineH"}"></td>
				<td class="SysTree Leaf" rowspan="2">
					<span class="SysTreeText">${res[1]}</span>
				</td>
			</tr><tr>
				<td class="SysTree ${type=="UTree"?"LineU":"Empty"}"></td>
			</tr></table>`;
	}
	var Parent=res[1];
	TreeWork=TreeWork.substring(res[0].length);
	// console.log(`[Then]${TreeWork}`);
	var Child1=GetTreeHTML("UTree");
	res=TreeWork.match(/^\s*,\s*/);
	TreeWork=TreeWork.substring(res[0].length);
	// console.log(`[-,]${TreeWork}`);
	var Child2=GetTreeHTML("DTree");
	res=TreeWork.match(/^\s*\)\s*/);
	TreeWork=TreeWork.substring(res[0].length);
	// console.log(`[-)]${TreeWork}`);
	return `
		<table class="SysTreeTable"><tr>
			<td class="SysTree P ${type=="DTree"?"LineD":"LineH"}">
				<span class="SysTreeText">${Parent}</span>
			</td>
			<td class="SysTree C1">${Child1}</td>
		</tr><tr>
			<td class="SysTree ${type=="UTree"?"LineU":"Empty"}"></td>
			<td class="SysTree C2">${Child2}</td>
		</tr></table>`;
}

/** @param {HTMLCollectionOf<HTMLDivElement>} eles */
function MakeTree(eles)
{
	for(var i=0;i<eles.length;i++)
	{
		var res=eles[i].textContent.match(/^\s*\|\|\|([^\|]+?)\|\|\|/m);
		if(res==null)	continue;
		TreeWork=res[1];
		eles[i].innerHTML=GetTreeHTML("Root");
		eles[i].classList.add("SysTreeWrapper");
	}
}

var Paragraphs=document.getElementsByTagName("p");
MakeTree(Paragraphs);