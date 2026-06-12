(function(){
	var DefaultOptions={
		scale: 0,
		width: 550,
		height: 450,
		bondLength: 19,
		bondThickness: 1.1,
		shortBondLength: 0.6,
		bondSpacing: 3.2,
		fontSizeLarge: 6.3,

		display: 'block',
	};
	var ColorScheme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
	function SetError(ele,code,err){
		ele.classList.add('smiles-error');
		ele.innerHTML=`
			Parsing SMILES failed:<br>
			<span class="smiles-string">${code}</span><br>
			<span class="smiles-error">${err}</span>`;
		console.error(code,'\n',err);
	}
	function Parse(ele){
		var content=ele.textContent.trim();
		// String
		const string=
			content.match(/^\s*smiles\s*:\s*(.+)\s*$/im)?.[1]||
			content.match(/^\s*(\S.*?)\s*$/m)?.[1]||
			null;
		if(!string){
			SetError(ele,content,'No valid SMILES string found.');
			return;
		}
		// Name
		var name=content.match(/^\s*name\s*:\s*(.+)\s*$/im)?.[1]||'';
		// Highlights
		var hlString=content.match(/^\s*highlights\s*:\s*(.+)\s*$/im)?.[1]||null;
		var highlights=null;
		if(hlString){
			highlights=[];
			hlString.matchAll(/(\d+)\[([#\w]+)\]/img)?.forEach((val)=>{
				highlights.push([parseInt(val[1]),val[2]]);
			});
		}
		// Options
		var options={...DefaultOptions};
		var optionString=content.match(/^options\s*\{\s*([\s\S]*?)\s*\}/im)?.[1]||null;
		if(optionString)
			optionString.matchAll(/([A-Za-z_]\w*)\s*=\s*([^;]+)\s*;/img)?.forEach((val)=>{
				if(val[2].match(/^\d+(\.\d+)?$/))
					val[2]=parseInt(val[2]);
				options[val[1]]=val[2];
			});
		console.log(optionString);
		DrawChemistry(content,ele,string,name,highlights,options);
	}
	/**
	 * @param {Element} ele
	 * @param {String} string
	 */
	function DrawChemistry(content,ele,string,name='',highlights=null,options=DefaultOptions){
		// Create container
		var graph=document.createElement('div');
		graph.classList.add('smiles');
		var svgid=btoa(string).substring(0,8).padEnd(8,'0').replaceAll(/[^\w]/g,'_');
		graph.innerHTML=`<svg id="${svgid}"></svg>`
		ele.parentElement.after(graph);
		ele.parentElement.remove();
		// Handle reaction
		if(string.match(">"))	graph.classList.add('smiles-reaction');
		else	graph.style.width=options.width+'px';
		// Deal with options
		console.log('options for ',graph,options);
		switch(options.display){
			case 'inline':
				graph.classList.add('smiles-inline');
				graph.style.maxWidth=`${2+Math.log(string.length)/Math.log(4)}em`
				break;
			case 'inline-block':
				graph.classList.add('smiles-inline-block');	break;
			case 'block': break;
			default:
				console.warn(`Unknown display option at ${graph}: ${options.display}`);
		}
		// Draw
		try{
			if(highlights)
				SmilesDrawer.parse(string,
					parsed=>{new SmilesDrawer.SvgDrawer(options)
						.draw(parsed,svgid,ColorScheme,null,false,highlights);},
					err=>{SetError(graph,string,err);}
				);
			else
				new SmilesDrawer.SmiDrawer(options).draw(string,`#${svgid}`,ColorScheme,null,
					err=>{SetError(graph,string,err);}
				);
		}catch(err){
			SetError(graph,string,err);
			console.error(graph,err);
		}
		if(options.display=='inline')
			graph.title=name;
		else
			graph.innerHTML+=`<div class="smiles-name">${name}</div>`;
	}
	function doWork(){
		document.querySelectorAll(
			"pre>code:is(.language-Smiles,.language-smiles)"
		).forEach(Parse);
		document.querySelectorAll("code").forEach((ele)=>{
			res=ele.textContent.trim().match(/\[Smiles\](?:\{([^}]*)\})?(.+)/im);
			if(res)
			{
				console.log('inline match',res);
				ele.innerHTML=`<temp>${res[2]}${res[1]?`\nName:${res[1]}`:''}\nOptions{display=inline;}</temp>`;
				Parse(ele.querySelector('temp'));
			}
		});
	}
	window.Smiles=doWork;
})();
