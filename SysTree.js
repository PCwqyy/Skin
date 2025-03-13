/** @type {String} */
var TreeWork;
/**
 *  @param {String} type 
 *  @returns {String} */
function GetTreeHTML(type)
{
// console.log(`[Now ${type}]${TreeWork.substring(0,20)}...`);
	var res=TreeWork.match(/^\s*([^\(|,|\)]*)\s*\(/);
	if(res==undefined)
	{
		res=TreeWork.match(/^\s*([^\(|,|\)]+)\s*/);
		TreeWork=TreeWork.substring(res[0].length);
// console.log(`[Ret]${TreeWork.substring(0,20)}...`);
		if(type=="DTree")
		{
			var res2=TreeWork.match(/^\s*,\s*/);
			if(res2!=null)	type="MTree";
		}
		var Name=res[1];
		var color="";
		res=Name.match(/\s*\[(.+)\]\s*/);
		if(res!=null)
			Name=Name.substring(res[0].length),
			color=res[1];
		return `
			<table class="SysTreeTable LeafTable"${color==""?"":` style=\"--systree-col:${color};\"`}><tr>
				<td class="SysTree ${type=="DTree"||type=="MTree"?"LineD":"LineH"}"></td>
				<td class="SysTree Leaf" rowspan="2">
					<span class="SysTreeText">${Name}</span>
				</td>
			</tr><tr>
				<td class="SysTree ${type=="UTree"||type=="MTree"?"LineU":"Empty"}"></td>
			</tr></table>`;
	}
	TreeWork=TreeWork.substring(res[0].length);
	var Parent=res[1];
	var color="";
	res=Parent.match(/\s*\[(.+)\]\s*/);
	if(res!=null)
		Parent=Parent.substring(res[0].length),
		color=res[1];
	var ret=`
		<table class="SysTreeTable"><tr>
			<td class="SysTree P ${type=="DTree"?"LineD":"LineH"}${Parent==""?" Empty":""}"${color==""?"":` style=\"border-bottom-color:${color};\"`}>
				<span class="SysTreeText">
					${Parent==""?"|":Parent}
				</span>
			</td>
			<td class="SysTree Childs" rowspan="2">
				<table class="SysTreeTable SysTreeChildsTable"${color==""?"":` style=\"--systree-col:${color};\"`}>`;
// console.log(`[Then]${TreeWork.substring(0,20)}...`);
	for(var i=0;true;i++)
	{
		var Child=GetTreeHTML(i==0?"UTree":"DTree");
		ret+=`<tr><td class="SysTree Childs">${Child}</td></tr>`;
// console.log(`TreeWork=${TreeWork.substring(0,20)}...`);
		res=TreeWork.match(/^\s*,\s*/);
		if(res==null)	break;
		TreeWork=TreeWork.substring(res[0].length);
// console.log(`[-,]${TreeWork.substring(0,20)}...`);
	}
	res=TreeWork.match(/^\s*\)\s*/);
	TreeWork=TreeWork.substring(res[0].length);
// console.log(`[-)]${TreeWork.substring(0,20)}...`);
	if(type=="DTree")
	{
		res=TreeWork.match(/^\s*,\s*/);
		if(res!=null)	type="MTree";
	}
// console.log(`Res:${ret.substring(0,20)}...`);
	ret+=`
			</table></td></tr><tr>
			<td class="SysTree Empty ${type=="UTree"||type=="MTree"?"LineU":""}">|</td>
		</tr></table>
		`
	return ret;
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